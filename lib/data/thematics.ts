import { payload } from "@/lib/payload";
import type { Thematic } from "@/payload-types";

export const getThematics = async (locale?: string): Promise<Thematic[]> => {
	const result = await payload.find({
		collection: "thematics",
		locale: (locale as "fr" | "en") ?? "fr",
		limit: 100,
		sort: "intitule",
		depth: 0,
	});
	return result.docs as Thematic[];
};
