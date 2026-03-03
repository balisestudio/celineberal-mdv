import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { AuctionInfo } from "@/components/auction-detail/auction-info";
import { getAuctionBySlug } from "@/lib/data/auctions";
import { getSiteSettings } from "@/lib/data/site-settings";

export const generateMetadata = async ({
	params,
}: {
	params: Promise<{ slug: string; locale: string }>;
}) => {
	const { slug, locale } = await params;
	const [auction, settings, t] = await Promise.all([
		getAuctionBySlug(slug, locale),
		getSiteSettings(locale),
		getTranslations({ locale, namespace: "auction" }),
	]);
	if (!auction) return { title: settings.siteName };
	return {
		title: `${auction.title} — ${t("info.about")} – ${settings.siteName}`,
	};
};

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
