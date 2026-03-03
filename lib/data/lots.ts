import config from "@payload-config";
import { payload } from "@/lib/payload";
import type { Lot } from "@/payload-types";

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

export const getLotByLotNumber = async (
	auctionId: number,
	lotNumber: string,
	locale?: string,
) => {
	const result = await payload.find({
		collection: "lots",
		where: {
			and: [
				{ auction: { equals: auctionId } },
				{ lotNumber: { equals: lotNumber } },
			],
		},
		depth: 2,
		limit: 1,
		locale: (locale as "fr" | "en") ?? "fr",
		overrideAccess: true,
	});
	return (result.docs[0] as Lot) ?? null;
};

export const getLotByAuctionSlugAndLotNumber = async (
	auctionSlug: string,
	lotNumber: string,
	locale?: string,
) => {
	const result = await payload.find({
		collection: "lots",
		where: {
			and: [
				{ "auction.slug": { equals: auctionSlug } },
				{ lotNumber: { equals: lotNumber } },
			],
		},
		depth: 2,
		limit: 1,
		locale: (locale as "fr" | "en") ?? "fr",
		overrideAccess: true,
	});
	return (result.docs[0] as Lot) ?? null;
};

export const getPrevLot = async (
	auctionId: number,
	currentInternalLotNumber: number | null | undefined,
) => {
	if (!currentInternalLotNumber) return null;
	const result = await payload.find({
		collection: "lots",
		where: {
			and: [
				{ auction: { equals: auctionId } },
				{ internalLotNumber: { less_than: currentInternalLotNumber } },
			],
		},
		sort: "-internalLotNumber",
		limit: 1,
		depth: 0,
		overrideAccess: true,
	});
	return (result.docs[0] as Lot) ?? null;
};

export const getNextLot = async (
	auctionId: number,
	currentInternalLotNumber: number | null | undefined,
) => {
	if (!currentInternalLotNumber) return null;
	const result = await payload.find({
		collection: "lots",
		where: {
			and: [
				{ auction: { equals: auctionId } },
				{ internalLotNumber: { greater_than: currentInternalLotNumber } },
			],
		},
		sort: "internalLotNumber",
		limit: 1,
		depth: 0,
		overrideAccess: true,
	});
	return (result.docs[0] as Lot) ?? null;
};

export const getSimilarLots = async (
	auctionId: number,
	currentLowEstimate: number | null | undefined,
	excludeLotId: number,
	limit = 8,
) => {
	const half = Math.ceil(limit / 2);

	const refPrice = currentLowEstimate ?? 0;

	const [cheaper, pricier] = await Promise.all([
		payload.find({
			collection: "lots",
			where: {
				and: [
					{ auction: { equals: auctionId } },
					{ id: { not_equals: excludeLotId } },
					...(refPrice > 0
						? [{ lowEstimate: { less_than_equal: refPrice } }]
						: []),
				],
			},
			sort: "-lowEstimate",
			limit: half,
			depth: 1,
			overrideAccess: true,
		}),
		payload.find({
			collection: "lots",
			where: {
				and: [
					{ auction: { equals: auctionId } },
					{ id: { not_equals: excludeLotId } },
					...(refPrice > 0
						? [{ lowEstimate: { greater_than: refPrice } }]
						: []),
				],
			},
			sort: "lowEstimate",
			limit: half,
			depth: 1,
			overrideAccess: true,
		}),
	]);

	const combined = [...cheaper.docs, ...pricier.docs] as Lot[];
	combined.sort(
		(a, b) =>
			Math.abs((a.lowEstimate ?? 0) - refPrice) -
			Math.abs((b.lowEstimate ?? 0) - refPrice),
	);

	return combined.slice(0, limit);
};
