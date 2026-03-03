import { payload } from "@/lib/payload";

export const getContact = async () => {
	return (await payload.findGlobal({ slug: "contact", depth: 0 })) ?? null;
};
