import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { NavBar } from "@/components/navbar";
import { routing } from "@/i18n/routing";
import { getGraphicsDark, getSiteSettings } from "@/lib/data/site-settings";

const LocaleLayout = async ({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}) => {
	const { locale } = await params;
	if (!hasLocale(routing.locales, locale)) {
		notFound();
	}

	const settings = await getSiteSettings();
	const { logo } = getGraphicsDark(settings);

	return (
		<>
			<NavBar
				siteName={settings.siteName}
				siteTagline={settings.tagline}
				logoSrc={logo.src}
				logoAlt={logo.alt}
			/>
			<main>{children}</main>
		</>
	);
};

export default LocaleLayout;
