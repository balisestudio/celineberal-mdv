import { format } from "date-fns";
import { enUS, fr } from "date-fns/locale";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { Link } from "@/i18n/navigation";
import { getMediaSrc } from "@/lib/media-src";
import type { Auction, Media } from "@/payload-types";

export const AuctionHero = async ({
	auction,
	locale,
}: {
	auction: Auction;
	locale: string;
}) => {
	const t = await getTranslations("auction");
	const poster = auction.poster as Media;
	const isUpcoming = new Date(auction.auctionDate) > new Date();

	const dateLocale = locale === "fr" ? fr : enUS;
	const formattedDate = format(new Date(auction.auctionDate), "PPP", {
		locale: dateLocale,
	});

	return (
		<section className="relative bg-charcoal py-16 selection:bg-white/20 selection:text-white overflow-hidden">
			{getMediaSrc(poster) && (
				<>
					<Image
						src={getMediaSrc(poster, "xl")}
						alt={poster.alt ?? auction.title}
						fill
						className="object-cover opacity-30"
						priority
					/>
					<div className="absolute inset-0 bg-linear-to-b from-charcoal/20 via-charcoal/70 to-charcoal" />
				</>
			)}

			<Container className="relative">
				<div className="flex items-center gap-1.5 text-sm uppercase tracking-widest text-white/50 mb-8 min-w-0">
					<Link
						href="/auctions"
						className="hover:text-white transition-colors shrink-0"
					>
						{t("breadcrumb")}
					</Link>
					<span className="shrink-0">›</span>
					<span className="text-white/80 truncate">{auction.title}</span>
				</div>

				<div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
					<div className="flex flex-col gap-4">
						<span className="self-start text-sm uppercase tracking-widest text-white/70 bg-charcoal/60 border border-blanc-casse/20 px-3 py-1">
							{isUpcoming ? t("upcoming") : t("past")}
						</span>

						<h1 className="font-serif italic text-white text-4xl sm:text-5xl lg:text-6xl leading-none">
							{auction.title}
						</h1>

						<div className="flex flex-wrap gap-x-6 gap-y-1 mt-2">
							<p className="text-sm uppercase tracking-widest">
								<span className="text-white/40 mr-2">{t("date")}</span>
								<span className="text-white/70">{formattedDate}</span>
							</p>
							{auction.location && (
								<p className="text-sm uppercase tracking-widest">
									<span className="text-white/40 mr-2">
										{t("locationLabel")}
									</span>
									<span className="text-white/70">{auction.location}</span>
								</p>
							)}
						</div>
					</div>

					{isUpcoming && (
						<div className="lg:flex lg:items-end lg:shrink-0">
							<Link
								href="/estimate"
								className="inline-flex items-center font-sans uppercase text-sm tracking-widest px-6 py-2.5 border border-white text-white hover:bg-white hover:text-bordeaux transition-colors"
							>
								{t("sellItem")}
							</Link>
						</div>
					)}
				</div>
			</Container>
		</section>
	);
};
