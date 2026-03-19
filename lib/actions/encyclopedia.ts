"use server";

import { getLocale } from "next-intl/server";
import { getEncyclopediaList } from "@/lib/data/encyclopedia";
import type { Encyclopedia } from "@/payload-types";

export const fetchEncyclopediaListAction = async ({
	thematiqueId,
	q,
	sort,
}: {
	thematiqueId?: number;
	q?: string;
	sort?: "date-asc" | "date-desc";
}): Promise<{ docs: Encyclopedia[]; totalDocs: number }> => {
	const locale = await getLocale();
	return getEncyclopediaList({
		locale: locale as "fr" | "en",
		thematiqueId,
		q: q?.trim() || undefined,
		sort: sort ?? "date-desc",
	});
};
