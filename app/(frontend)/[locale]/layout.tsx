import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Footer } from "@/components/footer";
import { NavBar } from "@/components/navbar";
import { ScrollToTop } from "@/components/scroll-to-top";
import { routing } from "@/i18n/routing";
import { getContact } from "@/lib/data/contact";
import {
	getGraphicsDark,
	getGraphicsLight,
	getSiteSettings,
} from "@/lib/data/site-settings";

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
	setRequestLocale(locale);

	const [messages, settings, contact] = await Promise.all([
		getMessages(),
		getSiteSettings(locale),
		getContact(),
	]);
	const { logo } = getGraphicsDark(settings);
	const { icon: iconLight } = getGraphicsLight(settings);

	return (
		<html lang={locale}>
			<body>
				<NextIntlClientProvider messages={messages}>
					<ScrollToTop />
					<NavBar
						siteName={settings.siteName}
						siteTagline={settings.tagline}
						logoSrc={logo.src}
						logoAlt={logo.alt}
					/>
					<main className="min-h-screen">{children}</main>
					<Footer
						siteName={settings.siteName}
						tagline={settings.tagline}
						iconLightSrc={iconLight.src}
						iconLightAlt={iconLight.alt}
						contact={contact}
					/>
				</NextIntlClientProvider>
			</body>
		</html>
	);
};

export default LocaleLayout;
