import config from "@payload-config";
import { payload } from "@/lib/payload";

export const getAuctions = async () => {
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

export const getAuctionBySlug = async (slug: string, locale?: string) => {
	const result = await payload.find({
		collection: "auctions",
		where: {
			and: [{ slug: { equals: slug } }, { _status: { equals: "published" } }],
		},
		depth: 2,
		limit: 1,
		locale: (locale as "fr" | "en") ?? "fr",
	});
	return result.docs[0] ?? null;
};

export const getPastAuctions = async () => {
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
