import "@/styles/globals.css";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { Mark } from "@/components/logos";
import { getSiteSettings } from "@/lib/data/site-settings";

const COPY = {
	fr: {
		title: "Page introuvable",
		description: "La page que vous recherchez n'existe pas ou a été déplacée.",
		backHome: "Retour à l'accueil",
	},
	en: {
		title: "Page not found",
		description:
			"The page you are looking for does not exist or has been moved.",
		backHome: "Back to home",
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
	const [copy] = await Promise.all([
		Promise.resolve(COPY[locale]),
		getSiteSettings(locale),
	]);
	const homeHref = locale === "en" ? "/en" : "/";

	return (
		<html lang={locale}>
			<body className="min-h-screen bg-blanc-casse text-bordeaux font-sans antialiased flex flex-col items-center justify-center px-4">
				<div className="flex flex-1 flex-col items-center justify-center text-center max-w-md">
					<Mark variant="dark" size={32} className="mx-auto mb-4" />
					<div
						className="font-serif italic text-bordeaux mb-4"
						style={{ fontSize: "48px", lineHeight: 1 }}
						aria-hidden
					>
						404
					</div>
					<h1 className="font-serif text-xl lg:text-2xl text-charcoal tracking-tight mb-3">
						{copy.title}
					</h1>
					<p className="text-muted text-sm mb-8">{copy.description}</p>
					<a
						href={homeHref}
						className="inline-block font-sans text-sm uppercase tracking-widest text-bordeaux hover:underline"
					>
						{copy.backHome}
					</a>
				</div>
			</body>
		</html>
	);
};

export default GlobalNotFound;
