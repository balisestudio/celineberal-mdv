"use client";

import { format } from "date-fns";
import { enUS, fr } from "date-fns/locale";
import { motion, useInView } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { useRef } from "react";
import { MediaImage } from "@/components/ui/media-image";
import { Link } from "@/i18n/navigation";
import type { Auction, Media } from "@/payload-types";

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
	const isUpcoming = new Date(auction.auctionDate) > new Date();
	const dateLocale = locale === "fr" ? fr : enUS;
	const formattedDate = format(new Date(auction.auctionDate), "PPP", {
		locale: dateLocale,
	});

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
				href={`/auctions/${auction.slug}`}
				className="group flex h-full flex-col border border-sand bg-white transition-colors hover:border-bordeaux/30"
			>
				<MediaImage
					media={poster}
					iconSrc={iconSrc}
					iconAlt={iconAlt}
					size="md"
					className="h-52 shrink-0"
					imageClassName="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
					iconSize={48}
					iconClassName="object-contain"
					alt={poster?.alt ?? auction.title}
					sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
				/>
				<div className="flex min-h-0 flex-1 flex-col border-t border-sand p-5">
					<p className="text-sm uppercase tracking-widest text-muted">
						{formattedDate}
						{auction.location && (
							<>
								{" · "}
								{auction.location}
							</>
						)}
					</p>
					<p className="font-serif italic text-lg text-charcoal line-clamp-2 mt-1 group-hover:text-bordeaux transition-colors">
						{auction.title}
					</p>
					<div className="mt-auto flex items-center justify-between gap-2 pt-3">
						{totalDocs > 0 && (
							<p className="text-sm text-muted">
								{tVentes("lots", { count: totalDocs })}
							</p>
						)}
						<span
							className={`text-sm uppercase tracking-widest shrink-0 ${
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
