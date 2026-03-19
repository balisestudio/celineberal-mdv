import { unstable_cache } from "next/cache";
import { payload } from "@/lib/payload";

type PayloadLocale = "fr" | "en" | "all";

export const getLegal = unstable_cache(
	async (locale?: PayloadLocale) =>
		(await payload.findGlobal({
			slug: "legal",
			depth: 0,
			locale,
		})) ?? null,
	["data/legal/getLegal"],
	{ tags: ["legal"] },
);
