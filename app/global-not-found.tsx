import "@/styles/globals.css";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Image from "next/image";
import { getGraphicsDark, getSiteSettings } from "@/lib/data/site-settings";

const COPY = {
	fr: {
		title: "Page introuvable",
		description: "La page que vous recherchez n'existe pas ou a été déplacée.",
		backHome: "Retour à l'accueil",
		viewSales: "Voir les ventes",
	},
	en: {
		title: "Page not found",
		description:
			"The page you are looking for does not exist or has been moved.",
		backHome: "Back to home",
		viewSales: "View sales",
	},
} as const;

const getLocaleFromHeaders = async (): Promise<"fr" | "en"> => {
	const headersList = await headers();
	const acceptLanguage = headersList.get("accept-language") ?? "";
	return acceptLanguage.toLowerCase().startsWith("en") ? "en" : "fr";
};

export const metadata: Metadata = {
	title: "404",
	description:
		"Page introuvable. The page you are looking for does not exist or has been moved.",
};

const GlobalNotFound = async () => {
	const locale = await getLocaleFromHeaders();
	const [copy, settings] = await Promise.all([
		Promise.resolve(COPY[locale]),
		getSiteSettings(locale),
	]);
	const { icon } = getGraphicsDark(settings);
	const homeHref = locale === "en" ? "/en" : "/";
	const salesHref = locale === "en" ? "/en/auctions" : "/auctions";

	return (
		<html lang={locale}>
			<body className="min-h-screen bg-blanc-casse text-bordeaux font-sans antialiased flex flex-col items-center justify-center px-4">
				<div className="flex flex-1 flex-col items-center justify-center text-center max-w-md">
					<Image
						src={icon.src}
						alt={icon.alt}
						width={64}
						height={64}
						className="mx-auto mb-6 opacity-20 object-contain"
					/>
					<div
						className="font-serif italic text-bordeaux mb-6"
						style={{ fontSize: "64px", lineHeight: 1 }}
						aria-hidden
					>
						404
					</div>
					<h1 className="font-serif text-2xl lg:text-3xl text-charcoal tracking-tight mb-4">
						{copy.title}
					</h1>
					<p className="text-muted text-sm mb-10">{copy.description}</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<a
							href={homeHref}
							className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-sans uppercase tracking-widest border border-bordeaux text-bordeaux hover:bg-bordeaux hover:text-blanc-casse transition-colors"
						>
							{copy.backHome}
						</a>
						<a
							href={salesHref}
							className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-sans uppercase tracking-widest border border-sand text-charcoal hover:bg-charcoal hover:text-blanc-casse transition-colors"
						>
							{copy.viewSales}
						</a>
					</div>
				</div>
			</body>
		</html>
	);
};

export default GlobalNotFound;
