import { getLocale, getTranslations } from "next-intl/server";
import { AuctionList } from "@/components/auctions/auction-list";
import { AuctionsEmpty } from "@/components/auctions/auctions-empty";
import { PageHeader } from "@/components/page-header";
import { Container } from "@/components/ui/container";
import { getAuctions } from "@/lib/data/auctions";
import { getSiteSettings } from "@/lib/data/site-settings";

export const generateMetadata = async () => {
	const locale = await getLocale();
	const [settings, t] = await Promise.all([
		getSiteSettings(locale),
		getTranslations({ locale, namespace: "ventes" }),
	]);
	return { title: `${t("pageTitle")} – ${settings.siteName}` };
};

const AuctionsPage = async () => {
	const t = await getTranslations("ventes");
	const [settings, { docs: auctions }] = await Promise.all([
		getSiteSettings(),
		getAuctions(),
	]);

	return (
		<>
			<PageHeader tagline={settings.tagline} title={t("pageTitle")} />
			<section className="py-12">
				<Container>
					{auctions.length > 0 ? (
						<AuctionList auctions={auctions} />
					) : (
						<AuctionsEmpty message={t("empty")} />
					)}
				</Container>
			</section>
		</>
	);
};

export default AuctionsPage;
