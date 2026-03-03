"use server";

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
	return getLots({ auctionId, page, sort });
};
