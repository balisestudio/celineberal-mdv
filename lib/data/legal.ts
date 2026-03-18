import { payload } from "@/lib/payload";

type PayloadLocale = "fr" | "en" | "all";

export const getLegal = async (locale?: PayloadLocale) => {
	return (
		(await payload.findGlobal({
			slug: "legal",
			depth: 0,
			locale,
		})) ?? null
	);
};
