import { unstable_cache } from "next/cache";
import { payload } from "@/lib/payload";

export const getAbout = unstable_cache(
	async (locale?: string) =>
		(await payload.findGlobal({
			slug: "about",
			depth: 2,
			locale: (locale as "fr" | "en") ?? "fr",
		})) ?? null,
	["data/about/getAbout"],
	{ tags: ["about"] },
);
