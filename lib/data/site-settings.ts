import { payload } from "@/lib/payload";

export const getSiteSettings = async () => {
	return payload.findGlobal({ slug: "site-settings", depth: 1 });
};
