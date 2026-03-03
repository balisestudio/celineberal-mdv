import { getMediaSrc } from "@/lib/media-src";
import { payload } from "@/lib/payload";
import type { Media, SiteSetting } from "@/payload-types";

export const getSiteSettings = async (locale?: string) => {
	return payload.findGlobal({
		slug: "site-settings",
		depth: 1,
		...(locale && { locale: locale as "fr" | "en" }),
	});
};

export const getGraphicsDark = (settings: SiteSetting) => {
	const logo = settings.graphics.logo.dark as Media;
	const icon = settings.graphics.icon.dark as Media;

	return {
		logo: {
			src: getMediaSrc(logo, "thumbnail"),
			alt: logo.alt ?? settings.siteName,
		},
		icon: {
			src: getMediaSrc(icon, "thumbnail"),
			alt: icon.alt ?? settings.siteName,
		},
	};
};

export const getGraphicsLight = (settings: SiteSetting) => {
	const logo = settings.graphics.logo.light as Media;
	const icon = settings.graphics.icon.light as Media;

	return {
		logo: {
			src: getMediaSrc(logo, "thumbnail"),
			alt: logo.alt ?? settings.siteName,
		},
		icon: {
			src: getMediaSrc(icon, "thumbnail"),
			alt: icon.alt ?? settings.siteName,
		},
	};
};
