import { payload } from "@/lib/payload";

export const getAbout = async (locale?: string) => {
	return (
		(await payload.findGlobal({
			slug: "about",
			depth: 1,
			locale: (locale as "fr" | "en") ?? "fr",
		})) ?? null
	);
};
