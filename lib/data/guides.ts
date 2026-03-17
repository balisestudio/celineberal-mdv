import { payload } from "@/lib/payload";
import type { Guide } from "@/payload-types";

export const getGuidesList = async (params: {
	locale?: string;
	thematiqueId?: number;
	q?: string;
	sort?: "date-asc" | "date-desc";
	limit?: number;
}): Promise<{ docs: Guide[]; totalDocs: number }> => {
	const {
		locale = "fr",
		thematiqueId,
		q,
		sort = "date-desc",
		limit = 100,
	} = params;

	const and: Array<
		| { _status: { equals: string } }
		| { thematique: { equals: number } }
		| { title: { contains: string } }
		| { hideFromList: { not_equals: true } }
	> = [
		{ _status: { equals: "published" } },
		{ hideFromList: { not_equals: true } },
	];

	if (thematiqueId != null) {
		and.push({ thematique: { equals: thematiqueId } });
	}

	const searchTrimmed = q?.trim();
	if (searchTrimmed) {
		and.push({ title: { contains: searchTrimmed } });
	}

	const result = await payload.find({
		collection: "guides",
		where: { and },
		sort: sort === "date-asc" ? "updatedAt" : "-updatedAt",
		limit,
		depth: 1,
		locale: (locale as "fr" | "en") ?? "fr",
	});

	return { docs: result.docs as Guide[], totalDocs: result.totalDocs };
};

export const getGuideBySlug = async (
	slug: string,
	locale?: string,
): Promise<Guide | null> => {
	const result = await payload.find({
		collection: "guides",
		where: {
			and: [{ slug: { equals: slug } }, { _status: { equals: "published" } }],
		},
		depth: 2,
		limit: 1,
		locale: (locale as "fr" | "en") ?? "fr",
	});
	return (result.docs[0] as Guide) ?? null;
};

export const getGuidesByThematique = async (
	thematiqueId: number,
	excludeGuideId: number,
	locale?: string,
	limit = 6,
) => {
	const result = await payload.find({
		collection: "guides",
		where: {
			and: [
				{ thematique: { equals: thematiqueId } },
				{ _status: { equals: "published" } },
				{ id: { not_equals: excludeGuideId } },
			],
		},
		sort: "-updatedAt",
		limit,
		depth: 1,
		locale: (locale as "fr" | "en") ?? "fr",
	});
	return result.docs as Guide[];
};

export function getAuctionIdsFromGuideContent(
	content: Guide["content"],
): number[] {
	const ids: number[] = [];
	const root = content?.root;
	if (!root || !Array.isArray(root.children)) return ids;

	for (const child of root.children) {
		const node = child as {
			type?: string;
			fields?: { auction?: number | { id?: number } };
		};
		if (node.type !== "block" || !node.fields?.auction) continue;
		const auction = node.fields.auction;
		const id =
			typeof auction === "object" && auction !== null && "id" in auction
				? auction.id
				: typeof auction === "number"
					? auction
					: null;
		if (id != null && !ids.includes(id)) ids.push(id);
	}
	return ids;
}
