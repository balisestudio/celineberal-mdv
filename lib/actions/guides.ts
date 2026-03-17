"use server";

import { getLocale } from "next-intl/server";
import { getGuidesList } from "@/lib/data/guides";
import type { Guide } from "@/payload-types";

export const fetchGuidesListAction = async ({
	thematiqueId,
	q,
	sort,
}: {
	thematiqueId?: number;
	q?: string;
	sort?: "date-asc" | "date-desc";
}): Promise<{ docs: Guide[]; totalDocs: number }> => {
	const locale = await getLocale();
	return getGuidesList({
		locale: locale as "fr" | "en",
		thematiqueId,
		q: q?.trim() || undefined,
		sort: sort ?? "date-desc",
	});
};
