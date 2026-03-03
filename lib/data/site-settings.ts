import { payload } from "@/lib/payload";
import type { Media, SiteSetting } from "@/payload-types";

export const getSiteSettings = async () => {
	return payload.findGlobal({ slug: "site-settings", depth: 1 });
};

export const getGraphicsDark = (settings: SiteSetting) => {
	const logo = settings.graphics.logo.dark as Media;
	const icon = settings.graphics.icon.dark as Media;

	return {
		logo: {
			src: logo.url ?? "",
			alt: logo.alt ?? settings.siteName,
		},
		icon: {
			src: icon.url ?? "",
			alt: icon.alt ?? settings.siteName,
		},
	};
};
