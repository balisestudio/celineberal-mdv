import { notFound, redirect } from "next/navigation";
import { LotSection } from "@/components/auction-detail/lot-section";
import { Container } from "@/components/ui/container";
import { getAuctionBySlug } from "@/lib/data/auctions";
import { getLots } from "@/lib/data/lots";
import { getSiteSettings } from "@/lib/data/site-settings";
import type { Lot } from "@/payload-types";

export const generateMetadata = async ({
	params,
}: {
	params: Promise<{ slug: string; locale: string }>;
}) => {
	const { slug, locale } = await params;
	const [auction, settings] = await Promise.all([
		getAuctionBySlug(slug, locale),
		getSiteSettings(locale),
	]);
	if (!auction) return { title: settings.siteName };
	return { title: `${auction.title} – ${settings.siteName}` };
};

const AuctionLotsPage = async ({
	params,
	searchParams,
}: {
	params: Promise<{ slug: string; locale: string }>;
	searchParams: Promise<{ page?: string }>;
}) => {
	const { slug, locale } = await params;
	const { page: pageParam } = await searchParams;

	const [auction, _settings] = await Promise.all([
		getAuctionBySlug(slug, locale),
		getSiteSettings(),
	]);

	if (!auction) notFound();

	const rawPage = Number(pageParam);
	const safePage =
		Number.isFinite(rawPage) && rawPage >= 1 ? Math.floor(rawPage) : 1;

	const lotsResult = await getLots({
		auctionId: auction.id,
		page: safePage,
		locale,
	});

	if (lotsResult.totalDocs === 0) {
		redirect(`/auctions/${slug}/about`);
	}

	const clampedPage =
		safePage > lotsResult.totalPages ? lotsResult.totalPages : safePage;
	if (clampedPage !== safePage) {
		redirect(`/auctions/${slug}?page=${clampedPage}`);
	}

	return (
		<Container className="py-0">
			<LotSection
				slug={slug}
				auctionId={auction.id}
				initialLots={lotsResult.docs as Lot[]}
				initialTotalDocs={lotsResult.totalDocs}
				initialTotalPages={lotsResult.totalPages}
				currentPage={clampedPage}
			/>
		</Container>
	);
};

export default AuctionLotsPage;
