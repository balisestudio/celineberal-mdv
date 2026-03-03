import { notFound } from "next/navigation";
import { AuctionInfo } from "@/components/auction-detail/auction-info";
import { getAuctionBySlug } from "@/lib/data/auctions";

const AuctionAboutPage = async ({
	params,
}: {
	params: Promise<{ slug: string; locale: string }>;
}) => {
	const { slug, locale } = await params;
	const auction = await getAuctionBySlug(slug, locale);

	if (!auction) notFound();

	return <AuctionInfo auction={auction} />;
};

export default AuctionAboutPage;
