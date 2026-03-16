import { getLocale, getTranslations } from "next-intl/server";
import { EstimateBlock } from "@/components/home/estimate-block";
import { HeroBrand } from "@/components/home/hero-brand";
import { HeroSale } from "@/components/home/hero-sale";
import { SalesSection } from "@/components/home/sales-section";
import { TopLotsSection } from "@/components/home/top-lots-section";
import { getAuctions, getPastAuctions } from "@/lib/data/auctions";
import { getExceptionLots } from "@/lib/data/lots";
import {
	getGraphicsDark,
	getGraphicsLight,
	getSiteSettings,
} from "@/lib/data/site-settings";
import type { Auction } from "@/payload-types";

export const generateMetadata = async () => {
	const locale = await getLocale();
	const [settings, t] = await Promise.all([
		getSiteSettings(locale),
		getTranslations({ locale, namespace: "home" }),
	]);
	return { title: `${t("pageTitle")} – ${settings.siteName}` };
};

const HomePage = async () => {
	const [upcomingResult, pastResult, exceptionLots, settings] =
		await Promise.all([
			getAuctions(),
			getPastAuctions(),
			getExceptionLots(),
			getSiteSettings(),
		]);

	const upcoming = upcomingResult.docs as Auction[];
	const past = pastResult.docs as Auction[];
	const heroAuction: Auction | null = upcoming[0] ?? past[0] ?? null;
	const isUpcoming = Boolean(upcoming[0] && heroAuction?.id === upcoming[0].id);
	const allAuctions = [...upcoming, ...past];
	const topLots = exceptionLots;
	const { icon: iconDark } = getGraphicsDark(settings);
	const { icon: iconLight } = getGraphicsLight(settings);

	return (
		<>
			{heroAuction ? (
				<HeroSale
					auction={heroAuction}
					isUpcoming={isUpcoming}
					iconSrc={iconDark.src}
					iconAlt={iconDark.alt}
				/>
			) : (
				<HeroBrand
					siteName={settings.siteName}
					tagline={settings.tagline}
					iconSrc={iconDark.src}
					iconAlt={iconDark.alt}
				/>
			)}

			{allAuctions.length > 0 && (
				<SalesSection
					auctions={allAuctions}
					iconSrc={iconLight.src}
					iconAlt={iconLight.alt}
				/>
			)}

			{topLots.length > 0 && (
				<TopLotsSection
					lots={topLots}
					iconSrc={iconDark.src}
					iconAlt={iconDark.alt}
				/>
			)}

			<EstimateBlock />
		</>
	);
};

export { HomePage as default };
