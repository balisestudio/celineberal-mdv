import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { LotGrid } from "@/components/auction-detail/lot-grid";
import { LotBreadcrumb } from "@/components/lot-detail/lot-breadcrumb";
import { LotGallery } from "@/components/lot-detail/lot-gallery";
import { LotInfo } from "@/components/lot-detail/lot-info";
import { LotNav } from "@/components/lot-detail/lot-nav";
import { Container } from "@/components/ui/container";
import {
	getLotByAuctionSlugAndLotNumber,
	getNextLot,
	getPrevLot,
	getSimilarLots,
} from "@/lib/data/lots";
import { getGraphicsDark, getSiteSettings } from "@/lib/data/site-settings";
import type { Auction, Lot, Media } from "@/payload-types";

export const generateMetadata = async ({
	params,
}: {
	params: Promise<{ slug: string; id: string; locale: string }>;
}) => {
	const { slug, id, locale } = await params;
	const [lot, settings] = await Promise.all([
		getLotByAuctionSlugAndLotNumber(slug, id, locale),
		getSiteSettings(locale),
	]);
	if (!lot) return { title: settings.siteName };
	return { title: `${lot.title} – ${settings.siteName}` };
};

const LotDetailPage = async ({
	params,
}: {
	params: Promise<{ slug: string; id: string; locale: string }>;
}) => {
	const { slug, id, locale } = await params;

	if (!id) notFound();

	const [lot, settings] = await Promise.all([
		getLotByAuctionSlugAndLotNumber(slug, id, locale),
		getSiteSettings(),
	]);

	if (!lot) notFound();

	const auction = lot.auction as Auction;

	const [prevLot, nextLot, similarLots] = await Promise.all([
		getPrevLot(auction.id, lot.internalLotNumber, locale),
		getNextLot(auction.id, lot.internalLotNumber, locale),
		getSimilarLots(auction.id, lot.lowEstimate, lot.id, 8, locale),
	]);

	const t = await getTranslations("lotDetail");
	const { icon } = getGraphicsDark(settings);
	const iconSrc = icon.src;
	const iconAlt = icon.alt;

	return (
		<>
			<LotBreadcrumb auction={auction} lotNumber={lot.lotNumber} />

			<Container className="py-12">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
					<LotGallery
						images={lot.images as (number | Media)[]}
						iconSrc={iconSrc}
						iconAlt={iconAlt}
						lotTitle={lot.title}
					/>
					<LotInfo lot={lot} />
				</div>

				<LotNav auctionSlug={slug} prevLot={prevLot} nextLot={nextLot} />
			</Container>

			{similarLots.length > 0 && (
				<section className="bg-blanc-casse border-t border-sand py-20 pb-28">
					<Container>
						<p className="text-sm uppercase tracking-[0.2em] text-muted mb-8">
							{t("similarTitle")}
						</p>
						<LotGrid
							lots={similarLots as Lot[]}
							iconSrc={iconSrc}
							iconAlt={iconAlt}
							auctionSlug={slug}
							columns="wide"
						/>
					</Container>
				</section>
			)}
		</>
	);
};

export default LotDetailPage;
