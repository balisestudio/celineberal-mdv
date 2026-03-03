import { notFound } from "next/navigation";
import { AuctionHero } from "@/components/auction-detail/hero";
import { AuctionTabs } from "@/components/auction-detail/tabs";
import { getAuctionBySlug } from "@/lib/data/auctions";
import { getLots } from "@/lib/data/lots";

const AuctionLayout = async ({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ slug: string; locale: string }>;
}) => {
	const { slug, locale } = await params;
	const auction = await getAuctionBySlug(slug, locale);

	if (!auction) notFound();

	const { totalDocs: totalLots } = await getLots({
		auctionId: auction.id,
		limit: 1,
	});

	return (
		<>
			<AuctionHero auction={auction} locale={locale} />
			<AuctionTabs slug={auction.slug} totalLots={totalLots} />
			{children}
		</>
	);
};

export default AuctionLayout;
