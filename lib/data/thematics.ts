import { unstable_cache } from "next/cache";
import { payload } from "@/lib/payload";
import type { Thematic } from "@/payload-types";

export const getThematics = unstable_cache(
	async (locale?: string): Promise<Thematic[]> => {
		const result = await payload.find({
			collection: "thematics",
			locale: (locale as "fr" | "en") ?? "fr",
			limit: 100,
			sort: "intitule",
			depth: 0,
		});
		return result.docs as Thematic[];
	},
	["data/thematics/getThematics"],
	{ tags: ["thematics"] },
);
