import config from "@payload-config";
import { getPayload } from "payload";

const SORT_MAP: Record<string, string> = {
	lotNumber: "internalLotNumber",
	alpha: "title",
	estimateAsc: "lowEstimate",
	estimateDesc: "-lowEstimate",
};

export const getLots = async ({
	auctionId,
	page = 1,
	sort = "lotNumber",
	limit = 24,
}: {
	auctionId: number;
	page?: number;
	sort?: string;
	limit?: number;
}) => {
	const payload = await getPayload({ config });
	return payload.find({
		collection: "lots",
		where: { auction: { equals: auctionId } },
		sort: SORT_MAP[sort] ?? "internalLotNumber",
		page,
		limit,
		depth: 1,
		overrideAccess: true,
	});
};
