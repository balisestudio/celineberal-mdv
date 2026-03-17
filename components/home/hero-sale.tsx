"use client";

import { ArrowRightIcon } from "@phosphor-icons/react";
import { format } from "date-fns";
import { enUS, fr } from "date-fns/locale";
import { motion } from "motion/react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Mark } from "@/components/logos";
import { Link } from "@/i18n/navigation";
import { getMediaSrc } from "@/lib/media-src";
import type { Auction, Media } from "@/payload-types";

export const HeroSale = ({
	auction,
	isUpcoming,
}: {
	auction: Auction;
	isUpcoming: boolean;
}) => {
	const t = useTranslations("home");
	const locale = useLocale();
	const poster = auction.poster as Media;
	const dateLocale = locale === "fr" ? fr : enUS;
	const formattedDate = format(new Date(auction.auctionDate), "PPP", {
		locale: dateLocale,
	});
	const hasPoster = Boolean(getMediaSrc(poster));

	return (
		<section className="bg-blanc-casse py-10 lg:py-14">
			<div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
				<Link
					href={`/auctions/${auction.slug}`}
					className="group min-h-[300px] lg:min-h-[500px] grid grid-cols-1 lg:grid-cols-[55%_45%]"
				>
					<div className="relative min-h-[300px] lg:min-h-[500px] bg-charcoal/5 overflow-hidden">
						{hasPoster ? (
							<Image
								src={getMediaSrc(poster) ?? ""}
								alt={poster?.alt ?? auction.title}
								fill
								className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
								sizes="(min-width: 1024px) 55vw, 100vw"
								priority
							/>
						) : (
							<div className="absolute inset-0 flex items-center justify-center bg-sand/30">
								<Mark variant="dark" size={120} className="opacity-60" />
							</div>
						)}
					</div>
					<div className="flex flex-col justify-center border-l-0 lg:border-l border-sand px-6 py-10 lg:px-8 lg:py-12">
						<motion.span
							className="text-sm uppercase tracking-[0.2em] text-bordeaux font-sans"
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
						>
							{isUpcoming ? t("nextSale") : t("pastSale")}
						</motion.span>
						<motion.h1
							className="font-serif italic text-2xl xl:text-[2.25rem] text-charcoal leading-tight mt-2 group-hover:text-bordeaux transition-colors"
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
						>
							{auction.title}
						</motion.h1>
						<motion.div
							className="mt-6 pt-6 border-t border-sand space-y-2.5"
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.4, ease: "easeOut", delay: 0.3 }}
						>
							<div className="flex gap-4">
								<span className="w-20 shrink-0 text-sm uppercase tracking-widest text-muted">
									{t("date")}
								</span>
								<span className="text-base text-charcoal">{formattedDate}</span>
							</div>
							{auction.location && (
								<div className="flex gap-4">
									<span className="w-20 shrink-0 text-sm uppercase tracking-widest text-muted">
										{t("location")}
									</span>
									<span className="text-base text-charcoal">
										{auction.location}
									</span>
								</div>
							)}
						</motion.div>
						<motion.div
							className="mt-6 flex items-center gap-1 text-sm uppercase tracking-[0.2em] text-bordeaux font-sans"
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.4, ease: "easeOut", delay: 0.4 }}
						>
							{t("discoverSale")}
							<ArrowRightIcon
								size={14}
								className="shrink-0 transition-transform duration-200 group-hover:translate-x-px"
							/>
						</motion.div>
					</div>
				</Link>
			</div>
		</section>
	);
};
