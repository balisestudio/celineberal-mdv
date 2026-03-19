import { notFound, redirect } from "next/navigation";
import { LotSection } from "@/components/auction-detail/lot-section";
import { Container } from "@/components/ui/container";
import { getAuctionBySlug } from "@/lib/data/auctions";
import { getLots } from "@/lib/data/lots";
import { getSiteSettings } from "@/lib/data/site-settings";
import type { Lot } from "@/payload-types";

const VALID_SORTS = [
	"lotNumber",
	"alpha",
	"estimateAsc",
	"estimateDesc",
] as const;
type SortOption = (typeof VALID_SORTS)[number];

const parseSortParam = (raw: string | undefined): SortOption => {
	return VALID_SORTS.includes(raw as SortOption)
		? (raw as SortOption)
		: "lotNumber";
};

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
	searchParams: Promise<{ page?: string; sort?: string }>;
}) => {
	const { slug, locale } = await params;
	const { page: pageParam, sort: sortParam } = await searchParams;

	const [auction, _settings] = await Promise.all([
		getAuctionBySlug(slug, locale),
		getSiteSettings(),
	]);

	if (!auction) notFound();

	const rawPage = Number(pageParam);
	const safePage =
		Number.isFinite(rawPage) && rawPage >= 1 ? Math.floor(rawPage) : 1;

	const sort = parseSortParam(sortParam);

	const lotsResult = await getLots({
		auctionId: auction.id,
		page: safePage,
		sort,
		locale,
	});

	if (lotsResult.totalDocs === 0) {
		redirect(`/auctions/${slug}/about`);
	}

	const clampedPage =
		safePage > lotsResult.totalPages ? lotsResult.totalPages : safePage;
	if (clampedPage !== safePage) {
		redirect(`/auctions/${slug}?page=${clampedPage}&sort=${sort}`);
	}

	return (
		<Container className="py-0">
			<LotSection
				key={`${clampedPage}-${sort}`}
				slug={slug}
				lots={lotsResult.docs as Lot[]}
				totalDocs={lotsResult.totalDocs}
				totalPages={lotsResult.totalPages}
				currentPage={clampedPage}
				currentSort={sort}
			/>
		</Container>
	);
};

export default AuctionLotsPage;
