"use client";

import { format } from "date-fns";
import { enUS, fr } from "date-fns/locale";
import { motion, useInView } from "motion/react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useRef } from "react";
import { Link } from "@/i18n/navigation";
import { getMediaSrc } from "@/lib/media-src";
import type { Auction, Media } from "@/payload-types";

const SAND_VARIANTS = ["bg-sand/50", "bg-sand/30", "bg-sand/20"] as const;

export const SaleCard = ({
	auction,
	index,
	iconSrc,
	iconAlt,
}: {
	auction: Auction;
	index: number;
	iconSrc: string;
	iconAlt: string;
}) => {
	const t = useTranslations("home");
	const tVentes = useTranslations("ventes");
	const tAuction = useTranslations("auction");
	const locale = useLocale();
	const ref = useRef<HTMLDivElement>(null);
	const inView = useInView(ref, { once: true, margin: "0px 0px -40px 0px" });

	const poster = auction.poster as Media;
	const totalDocs = auction.lots?.totalDocs ?? 0;
	const hasPoster = Boolean(getMediaSrc(poster));
	const isUpcoming = new Date(auction.auctionDate) > new Date();
	const dateLocale = locale === "fr" ? fr : enUS;
	const formattedDate = format(new Date(auction.auctionDate), "PPP", {
		locale: dateLocale,
	});
	const sandVariant = SAND_VARIANTS[index % SAND_VARIANTS.length];

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
				href={`/auctions/${auction.slug}`}
				className="group block border border-sand bg-white transition-colors hover:border-bordeaux/30"
			>
				<div className="relative h-52 overflow-hidden">
					{hasPoster ? (
						<Image
							src={getMediaSrc(poster) ?? ""}
							alt={poster?.alt ?? auction.title}
							fill
							className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
							sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
						/>
					) : (
						<div
							className={`absolute inset-0 flex items-center justify-center ${sandVariant}`}
						>
							<Image
								src={iconSrc}
								alt={iconAlt}
								width={48}
								height={48}
								className="opacity-60 object-contain"
							/>
						</div>
					)}
				</div>
				<div className="border-t border-sand p-5">
					<p className="text-[12px] uppercase tracking-widest text-muted">
						{formattedDate}
						{auction.location && (
							<>
								{" · "}
								{auction.location}
							</>
						)}
					</p>
					<p className="font-serif italic text-lg text-charcoal mt-1 group-hover:text-bordeaux transition-colors">
						{auction.title}
					</p>
					<div className="mt-3 flex items-center justify-between gap-2">
						{totalDocs > 0 && (
							<p className="text-xs text-muted">
								{tVentes("lots", { count: totalDocs })}
							</p>
						)}
						<span
							className={`text-[12px] uppercase tracking-widest shrink-0 ${
								isUpcoming ? "text-bordeaux" : "text-muted"
							}`}
						>
							{isUpcoming ? tAuction("upcoming") : tAuction("past")}
						</span>
					</div>
				</div>
			</Link>
		</motion.div>
	);
};
