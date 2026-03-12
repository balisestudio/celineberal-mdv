import type { Payload } from "payload";

const isMediaUsedElsewhere = async (
	payload: Payload,
	mediaId: number,
	excludeLotId?: number,
): Promise<boolean> => {
	const lotsWhere: Parameters<Payload["count"]>[0]["where"] =
		excludeLotId !== undefined
			? {
					and: [
						{ images: { in: [mediaId] } },
						{ id: { not_equals: excludeLotId } },
					],
				}
			: { images: { in: [mediaId] } };

	const [lotsResult, auctionsResult, estimatesResult, collaboratorsResult] =
		await Promise.all([
			payload.count({
				collection: "lots",
				where: lotsWhere,
			}),
			payload.count({
				collection: "auctions",
				where: { poster: { equals: mediaId } },
			}),
			payload.count({
				collection: "estimates",
				where: { "photos.media": { equals: mediaId } },
			}),
			payload.count({
				collection: "collaborators",
				where: { photo: { equals: mediaId } },
			}),
		]);

	return (
		lotsResult.totalDocs > 0 ||
		auctionsResult.totalDocs > 0 ||
		estimatesResult.totalDocs > 0 ||
		collaboratorsResult.totalDocs > 0
	);
};

export const extractMediaIds = (images: unknown): number[] => {
	if (!images || !Array.isArray(images)) return [];
	return images
		.map((img) =>
			typeof img === "number" ? img : (img as { id?: number })?.id,
		)
		.filter((id): id is number => typeof id === "number");
};

type PayloadRequest = Parameters<Payload["delete"]>[0]["req"];

export const deleteOrphanLotImages = async (
	payload: Payload,
	mediaIds: number[],
	excludeLotId?: number,
	req?: PayloadRequest,
): Promise<void> => {
	for (const mediaId of mediaIds) {
		const usedElsewhere = await isMediaUsedElsewhere(
			payload,
			mediaId,
			excludeLotId,
		);
		if (!usedElsewhere) {
			await payload.delete({
				collection: "media",
				id: mediaId,
				req,
			});
		}
	}
};
