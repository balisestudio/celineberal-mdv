import config from "@payload-config";
import { getPayload } from "payload";

export const getAuctions = async () => {
	const payload = await getPayload({ config });
	return payload.find({
		collection: "auctions",
		where: {
			and: [
				{ _status: { equals: "published" } },
				{ auctionDate: { greater_than: new Date().toISOString() } },
			],
		},
		sort: "auctionDate",
		depth: 1,
	});
};

export const getPastAuctions = async () => {
	const payload = await getPayload({ config });
	return payload.find({
		collection: "auctions",
		where: {
			and: [
				{ _status: { equals: "published" } },
				{ auctionDate: { less_than: new Date().toISOString() } },
			],
		},
		sort: "-auctionDate",
		depth: 1,
	});
};
