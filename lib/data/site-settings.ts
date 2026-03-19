import { unstable_cache } from "next/cache";
import { payload } from "@/lib/payload";

export const getSiteSettings = unstable_cache(
	async (locale?: string) =>
		payload.findGlobal({
			slug: "site-settings",
			depth: 1,
			...(locale && { locale: locale as "fr" | "en" }),
		}),
	["data/site-settings/getSiteSettings"],
	{ tags: ["site-settings"] },
);
