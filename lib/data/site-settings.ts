import { payload } from "@/lib/payload";

export const getSiteSettings = async (locale?: string) => {
	return payload.findGlobal({
		slug: "site-settings",
		depth: 1,
		...(locale && { locale: locale as "fr" | "en" }),
	});
};
