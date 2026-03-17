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
	locale = "fr",
}: {
	auctionId: number;
	page?: number;
	sort?: string;
	limit?: number;
	locale?: string;
}) => {
	return payload.find({
		collection: "lots",
		where: {
			and: [
				{ auction: { equals: auctionId } },
				{ "auction._status": { equals: "published" } },
			],
		},
		sort: SORT_MAP[sort] ?? "internalLotNumber",
		page,
		limit,
		depth: 1,
		locale: (locale as "fr" | "en") ?? "fr",
		overrideAccess: true,
	});
};

const _getLotByLotNumber = async (
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
				{ "auction._status": { equals: "published" } },
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
				{ "auction._status": { equals: "published" } },
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
	locale?: string,
) => {
	if (!currentInternalLotNumber) return null;
	const result = await payload.find({
		collection: "lots",
		where: {
			and: [
				{ auction: { equals: auctionId } },
				{ internalLotNumber: { less_than: currentInternalLotNumber } },
				{ "auction._status": { equals: "published" } },
			],
		},
		sort: "-internalLotNumber",
		limit: 1,
		depth: 0,
		locale: (locale as "fr" | "en") ?? "fr",
		overrideAccess: true,
	});
	return (result.docs[0] as Lot) ?? null;
};

export const getNextLot = async (
	auctionId: number,
	currentInternalLotNumber: number | null | undefined,
	locale?: string,
) => {
	if (!currentInternalLotNumber) return null;
	const result = await payload.find({
		collection: "lots",
		where: {
			and: [
				{ auction: { equals: auctionId } },
				{ internalLotNumber: { greater_than: currentInternalLotNumber } },
				{ "auction._status": { equals: "published" } },
			],
		},
		sort: "internalLotNumber",
		limit: 1,
		depth: 0,
		locale: (locale as "fr" | "en") ?? "fr",
		overrideAccess: true,
	});
	return (result.docs[0] as Lot) ?? null;
};

export const getSimilarLots = async (
	auctionId: number,
	currentLowEstimate: number | null | undefined,
	excludeLotId: number,
	limit = 8,
	locale?: string,
) => {
	const half = Math.ceil(limit / 2);
	const resolvedLocale = (locale as "fr" | "en") ?? "fr";

	const refPrice = currentLowEstimate ?? 0;

	const [cheaper, pricier] = await Promise.all([
		payload.find({
			collection: "lots",
			where: {
				and: [
					{ auction: { equals: auctionId } },
					{ id: { not_equals: excludeLotId } },
					{ "auction._status": { equals: "published" } },
					...(refPrice > 0
						? [{ lowEstimate: { less_than_equal: refPrice } }]
						: []),
				],
			},
			sort: "-lowEstimate",
			limit: half,
			depth: 1,
			locale: resolvedLocale,
			overrideAccess: true,
		}),
		payload.find({
			collection: "lots",
			where: {
				and: [
					{ auction: { equals: auctionId } },
					{ id: { not_equals: excludeLotId } },
					{ "auction._status": { equals: "published" } },
					...(refPrice > 0
						? [{ lowEstimate: { greater_than: refPrice } }]
						: []),
				],
			},
			sort: "lowEstimate",
			limit: half,
			depth: 1,
			locale: resolvedLocale,
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

export const getExceptionLots = async (): Promise<Lot[]> => {
	const settings = await payload.findGlobal({
		slug: "site-settings",
		depth: 2,
		overrideAccess: true,
	});
	const raw = (settings as { exceptionLots?: unknown }).exceptionLots;
	if (!Array.isArray(raw) || raw.length === 0) return [];
	const lots = raw.filter(
		(item): item is Lot =>
			typeof item === "object" &&
			item !== null &&
			"id" in item &&
			typeof (item as Lot).id === "number",
	) as Lot[];
	const published = lots.filter((lot) => {
		const auction = lot.auction;
		if (typeof auction !== "object" || !auction || !("_status" in auction))
			return true;
		return (auction as { _status?: string })._status === "published";
	});
	return published;
};

export const getTopLots = async (limit = 10) =>
	payload.find({
		collection: "lots",
		where: {
			and: [
				{ sold: { equals: true } },
				{ salePrice: { exists: true } },
				{ "auction._status": { equals: "published" } },
			],
		},
		sort: "-salePrice",
		limit,
		depth: 2,
		overrideAccess: true,
	});
