import { getLocale, getTranslations } from "next-intl/server";
import { LegalPageShell } from "@/components/legal/legal-page-shell";
import { getLegal } from "@/lib/data/legal";
import { getSiteSettings } from "@/lib/data/site-settings";

export const generateMetadata = async () => {
	const locale = await getLocale();
	const [t, settings] = await Promise.all([
		getTranslations({ locale, namespace: "terms" }),
		getSiteSettings(locale),
	]);
	return { title: `${t("privacyTitle")} – ${settings.siteName}` };
};

const PrivacyPage = async () => {
	const locale = await getLocale();
	const [t, settings, legal] = await Promise.all([
		getTranslations({ locale, namespace: "terms" }),
		getSiteSettings(locale),
		getLegal(locale as "fr" | "en"),
	]);

	return (
		<LegalPageShell
			title={t("privacyTitle")}
			siteName={settings.siteName}
			locale={locale}
			content={legal?.privacyPolicy}
			updatedAt={legal?.updatedAt}
		/>
	);
};

export default PrivacyPage;
