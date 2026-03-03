import { getTranslations } from "next-intl/server";
import { AuctionList } from "@/components/auctions/auction-list";
import { AuctionsEmpty } from "@/components/auctions/auctions-empty";
import { PageHeader } from "@/components/page-header";
import { Container } from "@/components/ui/container";
import { getAuctions } from "@/lib/data/auctions";
import { getGraphicsDark, getSiteSettings } from "@/lib/data/site-settings";

const AuctionsPage = async () => {
	const t = await getTranslations("ventes");
	const [settings, { docs: auctions }] = await Promise.all([
		getSiteSettings(),
		getAuctions(),
	]);

	const { icon } = getGraphicsDark(settings);
	const iconSrc = icon.src;
	const iconAlt = icon.alt;

	return (
		<>
			<PageHeader tagline={settings.tagline} title={t("pageTitle")} />
			<section className="py-12">
				<Container>
					{auctions.length > 0 ? (
						<AuctionList
							auctions={auctions}
							iconSrc={iconSrc}
							iconAlt={iconAlt}
						/>
					) : (
						<AuctionsEmpty
							iconSrc={iconSrc}
							iconAlt={iconAlt}
							message={t("empty")}
						/>
					)}
				</Container>
			</section>
		</>
	);
};

export default AuctionsPage;
