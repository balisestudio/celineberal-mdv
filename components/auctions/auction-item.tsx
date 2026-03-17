"use client";

import { ArrowRightIcon } from "@phosphor-icons/react";
import { format } from "date-fns";
import { enUS, fr } from "date-fns/locale";
import { motion, useInView } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { useRef } from "react";
import { MediaImage } from "@/components/ui/media-image";
import { Link } from "@/i18n/navigation";
import type { Auction, Media } from "@/payload-types";

export const AuctionItem = ({
	auction,
	index,
}: {
	auction: Auction;
	index: number;
}) => {
	const t = useTranslations("ventes");
	const locale = useLocale();
	const ref = useRef<HTMLDivElement>(null);
	const inView = useInView(ref, { once: true, margin: "0px 0px -40px 0px" });

	const poster = auction.poster as Media;
	const totalDocs = auction.lots?.totalDocs ?? 0;

	const dateLocale = locale === "fr" ? fr : enUS;
	const formattedDate = format(new Date(auction.auctionDate), "PPP", {
		locale: dateLocale,
	});

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
				className="group flex items-center gap-4 px-2 py-4 hover:bg-blanc-casse/60 transition-colors"
			>
				<MediaImage
					media={poster}
					size="thumbnail"
					className="w-20 h-24 lg:w-24 lg:h-28 shrink-0"
					imageClassName="object-cover group-hover:scale-105 transition-transform duration-500"
					iconSize={40}
					alt={poster.alt ?? auction.title}
					sizes="(min-width: 1024px) 96px, 80px"
				/>

				<div className="flex-1 min-w-0">
					<p className="text-sm uppercase tracking-widest text-muted mb-1">
						{formattedDate}
						{auction.location && (
							<>
								{" · "}
								{auction.location}
							</>
						)}
					</p>
					<p className="font-serif italic text-xl lg:text-2xl text-charcoal group-hover:text-bordeaux transition-colors truncate">
						{auction.title}
					</p>
					{totalDocs > 0 && (
						<p className="text-sm text-muted mt-1">
							{t("lots", { count: totalDocs })}
						</p>
					)}
				</div>

				<div className="shrink-0 flex items-center">
					<ArrowRightIcon
						size={18}
						className="text-muted group-hover:translate-x-px group-hover:text-bordeaux transition-all duration-200"
					/>
				</div>
			</Link>
		</motion.div>
	);
};
