"use client";

import { motion, useInView } from "motion/react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import { Link } from "@/i18n/navigation";
import { getMediaSrc } from "@/lib/media-src";
import type { Lot, Media } from "@/payload-types";

export const LotCard = ({
	lot,
	index,
	iconSrc,
	iconAlt,
	auctionSlug,
}: {
	lot: Lot;
	index: number;
	iconSrc: string;
	iconAlt: string;
	auctionSlug: string;
}) => {
	const t = useTranslations("auction");
	const ref = useRef<HTMLDivElement>(null);
	const inView = useInView(ref, { once: true, margin: "0px 0px -40px 0px" });

	const firstImage = lot.images?.[0];
	const image =
		typeof firstImage === "object" && firstImage !== null
			? (firstImage as Media)
			: null;

	const hasEstimate = lot.lowEstimate || lot.highEstimate;
	const estimateText = hasEstimate
		? [lot.lowEstimate, lot.highEstimate]
				.filter(Boolean)
				.join(" – ")
				.concat(" €")
		: null;

	return (
		<motion.div
			ref={ref}
			initial={{ opacity: 0, y: 12 }}
			animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
			transition={{
				duration: 0.4,
				ease: "easeOut",
				delay: Math.min(index * 0.055, 0.35),
			}}
		>
			<Link
				href={`/auctions/${auctionSlug}/lots/${lot.lotNumber}`}
				className="group flex flex-col h-full"
			>
				<div className="relative h-64 bg-sand/20 overflow-hidden shrink-0">
					{getMediaSrc(image) ? (
						<Image
							src={getMediaSrc(image, "md")}
							alt={image?.alt ?? lot.title}
							fill
							className="object-contain p-4 group-hover:scale-[1.04] transition-transform duration-500"
							sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
						/>
					) : (
						<div className="w-full h-full flex items-center justify-center">
							{iconSrc && (
								<Image
									src={iconSrc}
									alt={iconAlt}
									width={40}
									height={40}
									className="opacity-40"
								/>
							)}
						</div>
					)}

					{lot.sold && (
						<span className="absolute top-2 right-2 bg-charcoal/80 text-blanc-casse text-[12px] uppercase tracking-widest px-2 py-0.5">
							{t("lot.sold")}
						</span>
					)}
				</div>

				<div className="flex flex-col flex-1 pt-3 gap-1">
					<p className="text-[12px] uppercase tracking-widest text-muted">
						{t("lot.number", { n: lot.lotNumber })}
					</p>
					<p className="text-sm text-charcoal line-clamp-2 group-hover:text-bordeaux transition-colors">
						{lot.title}
					</p>

					<div className="mt-auto pt-2 flex flex-col gap-0.5">
						{estimateText && (
							<p className="font-serif italic text-sm text-muted">
								{estimateText}
							</p>
						)}
						{lot.sold && lot.salePrice && (
							<p className="font-serif italic text-sm text-bordeaux">
								{lot.salePrice.toLocaleString()} €
							</p>
						)}
					</div>
				</div>
			</Link>
		</motion.div>
	);
};
