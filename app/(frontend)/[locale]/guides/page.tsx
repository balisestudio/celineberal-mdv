import { getLocale, getTranslations } from "next-intl/server";
import { GuidesListClient } from "@/components/guide/guides-list-client";
import { getSiteSettings } from "@/lib/data/site-settings";
import { getThematics } from "@/lib/data/thematics";

export const generateMetadata = async () => {
	const locale = await getLocale();
	const [settings, t] = await Promise.all([
		getSiteSettings(locale),
		getTranslations({ locale, namespace: "guidesList" }),
	]);
	return { title: `${t("pageTitle")} – ${settings.siteName}` };
};

const GuidesListPage = async ({
	params,
}: {
	params: Promise<{ locale: string }>;
}) => {
	const { locale } = await params;

	const t = await getTranslations("guidesList");
	const [settings, thematics] = await Promise.all([
		getSiteSettings(locale),
		getThematics(locale),
	]);

	return (
		<GuidesListClient
			locale={locale}
			tagline={settings.tagline}
			pageTitle={t("pageTitle")}
			thematics={thematics}
		/>
	);
};

export default GuidesListPage;
