import { unstable_cache } from "next/cache";
import { payload } from "@/lib/payload";
import type { Encyclopedia } from "@/payload-types";

export const getEncyclopediaList = unstable_cache(
	async (params: {
		locale?: string;
		thematiqueId?: number;
		q?: string;
		sort?: "date-asc" | "date-desc";
		limit?: number;
	}): Promise<{ docs: Encyclopedia[]; totalDocs: number }> => {
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
			collection: "encyclopedia",
			where: { and },
			sort: sort === "date-asc" ? "updatedAt" : "-updatedAt",
			limit,
			depth: 1,
			locale: (locale as "fr" | "en") ?? "fr",
		});

		return {
			docs: result.docs as Encyclopedia[],
			totalDocs: result.totalDocs,
		};
	},
	["data/encyclopedia/getEncyclopediaList"],
	{ tags: ["encyclopedia"] },
);

export const getEncyclopediaBySlug = unstable_cache(
	async (slug: string, locale?: string): Promise<Encyclopedia | null> => {
		const result = await payload.find({
			collection: "encyclopedia",
			where: {
				and: [{ slug: { equals: slug } }, { _status: { equals: "published" } }],
			},
			depth: 2,
			limit: 1,
			locale: (locale as "fr" | "en") ?? "fr",
		});
		return (result.docs[0] as Encyclopedia) ?? null;
	},
	["data/encyclopedia/getEncyclopediaBySlug"],
	{ tags: ["encyclopedia"] },
);

export const getEncyclopediaByThematique = unstable_cache(
	async (
		thematiqueId: number,
		excludeArticleId: number,
		locale?: string,
		limit = 6,
	) => {
		const result = await payload.find({
			collection: "encyclopedia",
			where: {
				and: [
					{ thematique: { equals: thematiqueId } },
					{ _status: { equals: "published" } },
					{ id: { not_equals: excludeArticleId } },
				],
			},
			sort: "-updatedAt",
			limit,
			depth: 1,
			locale: (locale as "fr" | "en") ?? "fr",
		});
		return result.docs as Encyclopedia[];
	},
	["data/encyclopedia/getEncyclopediaByThematique"],
	{ tags: ["encyclopedia"] },
);

export const getAuctionIdsFromEncyclopediaContent = (
	content: Encyclopedia["content"],
): number[] => {
	const ids: number[] = [];
	const root = content?.root;
	if (!root || !Array.isArray(root.children)) return ids;

	const extractId = (val: unknown): number | null => {
		if (typeof val === "number") return val;
		if (typeof val === "object" && val !== null && "id" in val)
			return (val as { id: number }).id;
		return null;
	};

	for (const child of root.children) {
		const node = child as {
			type?: string;
			fields?: {
				auction?: number | { id?: number };
				auctions?: (number | { id?: number })[];
			};
		};
		if (node.type !== "block" || !node.fields) continue;

		const auctions =
			node.fields.auctions ??
			(node.fields.auction ? [node.fields.auction] : []);
		for (const a of Array.isArray(auctions) ? auctions : []) {
			const id = extractId(a);
			if (id != null && !ids.includes(id)) ids.push(id);
		}
	}
	return ids;
};
