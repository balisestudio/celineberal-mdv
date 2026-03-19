import { unstable_cache } from "next/cache";
import { payload } from "@/lib/payload";

export const getContact = unstable_cache(
	async () => (await payload.findGlobal({ slug: "contact", depth: 0 })) ?? null,
	["data/contact/getContact"],
	{ tags: ["contact"] },
);
