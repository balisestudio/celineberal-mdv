import { getLocale, getTranslations } from "next-intl/server";
import { EncyclopediaListClient } from "@/components/encyclopedia/encyclopedia-list-client";
import { getSiteSettings } from "@/lib/data/site-settings";
import { getThematics } from "@/lib/data/thematics";

export const generateMetadata = async () => {
	const locale = await getLocale();
	const [settings, t] = await Promise.all([
		getSiteSettings(locale),
		getTranslations({ locale, namespace: "encyclopediaList" }),
	]);
	return { title: `${t("pageTitle")} – ${settings.siteName}` };
};

const EncyclopediaListPage = async ({
	params,
}: {
	params: Promise<{ locale: string }>;
}) => {
	const { locale } = await params;

	const t = await getTranslations("encyclopediaList");
	const [settings, thematics] = await Promise.all([
		getSiteSettings(locale),
		getThematics(locale),
	]);

	return (
		<EncyclopediaListClient
			locale={locale}
			tagline={settings.tagline}
			pageTitle={t("pageTitle")}
			thematics={thematics}
		/>
	);
};

export default EncyclopediaListPage;
