"use client";

import { motion, useInView } from "motion/react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import { Link } from "@/i18n/navigation";
import { getMediaSrc } from "@/lib/media-src";
import type { Auction, Lot, Media } from "@/payload-types";

export const TopLotCard = ({
	lot,
	index,
	iconSrc,
	iconAlt,
}: {
	lot: Lot;
	index: number;
	iconSrc: string;
	iconAlt: string;
}) => {
	const t = useTranslations("auction");
	const ref = useRef<HTMLDivElement>(null);
	const inView = useInView(ref, { once: true, margin: "0px 0px -40px 0px" });

	const firstImage = lot.images?.[0];
	const image =
		typeof firstImage === "object" && firstImage !== null
			? (firstImage as Media)
			: null;
	const hasImage = Boolean(getMediaSrc(image));
	const auction =
		typeof lot.auction === "object" && lot.auction !== null
			? (lot.auction as Auction)
			: null;
	const auctionSlug = auction?.slug ?? "";

	return (
		<motion.div
			ref={ref}
			className="h-full"
			initial={{ opacity: 0, y: 12 }}
			animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
			transition={{
				duration: 0.4,
				ease: "easeOut",
				delay: Math.min(index * 0.055, 0.35),
			}}
		>
			<Link
				href={
					auctionSlug ? `/auctions/${auctionSlug}/lots/${lot.lotNumber}` : "#"
				}
				className="group flex flex-col h-full border border-sand bg-white transition-colors hover:border-bordeaux/30"
			>
				<div className="relative aspect-square overflow-hidden bg-sand/20">
					{hasImage ? (
						<Image
							src={getMediaSrc(image) ?? ""}
							alt={image?.alt ?? lot.title}
							fill
							className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
							sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
						/>
					) : (
						<div className="absolute inset-0 flex items-center justify-center bg-sand/20">
							<Image
								src={iconSrc}
								alt={iconAlt}
								width={40}
								height={40}
								className="opacity-40 object-contain"
							/>
						</div>
					)}
				</div>
				<div className="flex flex-col flex-1 border-t border-sand p-3">
					<p className="text-[12px] uppercase tracking-widest text-muted">
						{t("lot.number", { n: lot.lotNumber })}
					</p>
					<p className="font-serif italic text-sm text-charcoal line-clamp-2 mt-0.5 group-hover:text-bordeaux transition-colors">
						{lot.title}
					</p>
					{lot.sold && lot.salePrice != null && (
						<p className="text-xs font-semibold text-bordeaux mt-auto pt-2">
							{lot.salePrice.toLocaleString()} €
						</p>
					)}
				</div>
			</Link>
		</motion.div>
	);
};
