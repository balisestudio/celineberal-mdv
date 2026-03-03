"use server";

import { getLocale } from "next-intl/server";
import { getLots } from "@/lib/data/lots";

export const fetchLotsAction = async ({
	auctionId,
	page,
	sort,
}: {
	auctionId: number;
	page: number;
	sort: string;
}) => {
	const locale = await getLocale();
	return getLots({ auctionId, page, sort, locale });
};
