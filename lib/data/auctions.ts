import { unstable_cache } from "next/cache";
import { payload } from "@/lib/payload";

export const getAuctions = unstable_cache(
	async () =>
		payload.find({
			collection: "auctions",
			where: {
				and: [
					{ _status: { equals: "published" } },
					{ auctionDate: { greater_than: new Date().toISOString() } },
				],
			},
			sort: "auctionDate",
			depth: 1,
		}),
	["data/auctions/getAuctions"],
	{ tags: ["auctions"] },
);

export const getAuctionBySlug = unstable_cache(
	async (slug: string, locale?: string) => {
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
	},
	["data/auctions/getAuctionBySlug"],
	{ tags: ["auctions"] },
);

export const getPastAuctions = unstable_cache(
	async () =>
		payload.find({
			collection: "auctions",
			where: {
				and: [
					{ _status: { equals: "published" } },
					{ auctionDate: { less_than: new Date().toISOString() } },
				],
			},
			sort: "-auctionDate",
			depth: 1,
		}),
	["data/auctions/getPastAuctions"],
	{ tags: ["auctions"] },
);
