import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { NavBar } from "@/components/navbar";
import { routing } from "@/i18n/routing";
import { getSiteSettings } from "@/lib/data/site-settings";
import type { Media } from "@/payload-types";

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
	const logo = settings.graphics.logo as Media;

	return (
		<>
			<NavBar
				siteName={settings.siteName}
				siteTagline={settings.tagline}
				logoSrc={logo.url ?? ""}
				logoAlt={logo.alt ?? settings.siteName}
			/>
			<main>{children}</main>
		</>
	);
};

export default LocaleLayout;
