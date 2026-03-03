import { logger, task } from "@trigger.dev/sdk/v3";
import pLimit from "p-limit";
import type { ImportLotsOptions } from "@/components/payload/imports-lots/action";
import { optimizeLot } from "@/lib/ai/optimize-lot";
import { translateLot } from "@/lib/ai/translate-lot";
import { payload } from "@/lib/payload";
import type {
	InterenchersLot,
	InterenchersLots,
} from "@/lib/schemas/interenchers";
import type { Auction, User } from "@/payload-types";

/**
 * Constants
 */

const TITLE_MAX_LENGTH = 80;
const CONCURRENCY = 15;

/**
 * Helpers
 */

const buildLotNumber = (lot: InterenchersLot): string => {
	const { numero, bis } = lot["numero-ordre"];
	return bis != null ? `${numero}-${bis}` : String(numero);
};

const cropTitle = (description: string): string => {
	if (description.length <= TITLE_MAX_LENGTH) return description;
	const cropped = description.slice(0, TITLE_MAX_LENGTH);
	const lastSpace = cropped.lastIndexOf(" ");
	return lastSpace > 0 ? cropped.slice(0, lastSpace) : cropped;
};

const downloadImage = async (
	url: string,
): Promise<{ buffer: Buffer; mimeType: string; filename: string }> => {
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`Failed to download image: ${url} (${response.status})`);
	}

	const arrayBuffer = await response.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);
	const contentType = response.headers.get("content-type") ?? "image/jpeg";

	const urlPath = new URL(url).pathname;
	const filename = urlPath.split("/").pop() ?? "image.jpg";

	return { buffer, mimeType: contentType, filename };
};

const formatImageIndex = (index: number): string =>
	String(index + 1).padStart(2, "0");

const clearTriggerId = async (auctionId: number) => {
	await payload.update({
		collection: "auctions",
		id: auctionId,
		data: { triggerId: null },
	});
};

/**
 * Core processing functions
 */

const deleteExistingLots = async (
	auctionId: number,
	transactionID: string | number,
) => {
	const existingLots = await payload.find({
		collection: "lots",
		where: { auction: { equals: auctionId } },
		limit: 0,
		depth: 0,
		req: { transactionID } as never,
	});

	logger.info("Suppression des anciens lots", {
		auctionId,
		count: existingLots.totalDocs,
	});

	if (existingLots.totalDocs > 0) {
		await payload.delete({
			collection: "lots",
			where: { auction: { equals: auctionId } },
			req: { transactionID } as never,
		});
	}

	logger.info("Tous les anciens lots supprimés", {
		count: existingLots.totalDocs,
	});
};

const processLotContent = async (
	lot: InterenchersLot,
	lotNumber: string,
	options: ImportLotsOptions,
): Promise<{
	frTitle: string;
	frDescription: string;
	frCharacteristics: { key: string; value: string }[];
	enTitle?: string;
	enDescription?: string;
	enCharacteristics?: { key: string; value: string }[];
}> => {
	const rawDescription = lot.description;
	let frTitle: string;
	let frDescription: string;
	let frCharacteristics: { key: string; value: string }[] = [];

	if (options.optimizeContent) {
		try {
			logger.info("AI optimisation - début", { lotNumber });
			const optimized = await optimizeLot(rawDescription);
			frTitle = optimized.title;
			frDescription = optimized.description;
			frCharacteristics = optimized.characteristics ?? [];
			logger.info("AI optimisation - terminé", {
				lotNumber,
				title: frTitle,
				hasCharacteristics: frCharacteristics.length > 0,
				characteristicsCount: frCharacteristics.length,
			});
		} catch (error) {
			logger.warn("AI optimisation échouée - fallback données brutes", {
				lotNumber,
				error: error instanceof Error ? error.message : String(error),
			});
			frTitle = cropTitle(rawDescription);
			frDescription = rawDescription;
			frCharacteristics = [];
		}
	} else {
		frTitle = cropTitle(rawDescription);
		frDescription = rawDescription;
	}

	let enTitle: string | undefined;
	let enDescription: string | undefined;
	let enCharacteristics: { key: string; value: string }[] | undefined;

	if (options.translateContent) {
		try {
			logger.info("AI traduction - début", { lotNumber, locale: "en" });
			const translated = await translateLot(
				{
					title: frTitle,
					description: frDescription,
					characteristics: frCharacteristics,
				},
				"en",
			);
			enTitle = translated.title;
			enDescription = translated.description;
			enCharacteristics = translated.characteristics;
			logger.info("AI traduction - terminé", {
				lotNumber,
				locale: "en",
				title: enTitle,
			});
		} catch (error) {
			logger.warn("AI traduction échouée - pas de locale EN", {
				lotNumber,
				error: error instanceof Error ? error.message : String(error),
			});
		}
	}

	return {
		frTitle,
		frDescription,
		frCharacteristics,
		enTitle,
		enDescription,
		enCharacteristics,
	};
};

const uploadLotImages = async (
	lot: InterenchersLot,
	lotTitle: string,
	lotNumber: string,
	transactionID?: string | number,
): Promise<number[]> => {
	const images = lot.images?.image ?? [];
	if (images.length === 0) return [];

	const sorted = [...images].sort((a, b) => Number(a.rang) - Number(b.rang));

	const mediaIds: number[] = [];

	for (let i = 0; i < sorted.length; i++) {
		const image = sorted[i];
		const alt = `${lotTitle} - ${formatImageIndex(i)}`;

		logger.info("Téléchargement image", {
			lotNumber,
			imageUrl: image.chemin,
			rang: image.rang,
			index: i + 1,
			total: sorted.length,
		});

		const { buffer, mimeType, filename } = await downloadImage(image.chemin);

		logger.info("Upload image vers Payload", {
			lotNumber,
			filename,
			alt,
			size: buffer.length,
		});

		const media = await payload.create({
			collection: "media",
			data: {
				alt,
				usage: "lot",
			},
			file: {
				data: buffer,
				name: filename,
				mimetype: mimeType,
				size: buffer.length,
			},
			...(transactionID && { req: { transactionID } as never }),
		});

		logger.info("Image uploadée", {
			mediaId: media.id,
			alt,
			lotNumber,
		});

		mediaIds.push(media.id);
	}

	return mediaIds;
};

type ProcessSingleLotResult =
	| { success: true; lotNumber: string }
	| { success: false; lotNumber: string; error: string };

const processSingleLot = async (
	xmlLot: InterenchersLot,
	lotNumber: string,
	options: ImportLotsOptions,
	auctionId: number,
): Promise<ProcessSingleLotResult> => {
	try {
		const content = await processLotContent(xmlLot, lotNumber, options);

		const lotData = {
			auction: auctionId,
			title: content.frTitle,
			lotNumber,
			description: content.frDescription,
			characteristics:
				content.frCharacteristics.length > 0
					? content.frCharacteristics
					: undefined,
			lowEstimate: xmlLot["estimation-basse"],
			highEstimate: xmlLot["estimation-haute"],
		};

		const createdLot = await payload.create({
			collection: "lots",
			data: lotData,
			locale: "fr",
		});

		if (content.enTitle && content.enDescription) {
			const enData: Record<string, unknown> = {
				title: content.enTitle,
				description: content.enDescription,
			};

			if (content.enCharacteristics && content.enCharacteristics.length > 0) {
				enData.characteristics = content.enCharacteristics.map((c, i) => ({
					...c,
					id: createdLot.characteristics?.[i]?.id,
				}));
			}

			await payload.update({
				collection: "lots",
				id: createdLot.id,
				data: enData,
				locale: "en",
			});
		}

		const mediaIds = await uploadLotImages(xmlLot, content.frTitle, lotNumber);

		if (mediaIds.length > 0) {
			await payload.update({
				collection: "lots",
				id: createdLot.id,
				data: { images: mediaIds },
			});
		}

		return { success: true, lotNumber };
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		logger.error("Lot non importé", {
			lotNumber,
			error: errorMessage,
		});
		return { success: false, lotNumber, error: errorMessage };
	}
};

/**
 * Main task
 */

type ImportLotsPayload = {
	lots: InterenchersLots;
	auction: Auction;
	options: ImportLotsOptions;
	user: User;
};

export const importLotsTask = task({
	id: "import-lots",

	onSuccess: async ({ payload: data }) => {
		const { auction } = data as ImportLotsPayload;
		logger.info("Hook onSuccess - nettoyage triggerId", {
			auctionId: auction.id,
		});
		await clearTriggerId(auction.id);
	},

	onFailure: async ({ payload: data, error }) => {
		const { auction } = data as ImportLotsPayload;
		logger.error("Hook onFailure - nettoyage triggerId après échec", {
			auctionId: auction.id,
			error: error instanceof Error ? error.message : String(error),
		});
		try {
			await clearTriggerId(auction.id);
		} catch (cleanupError) {
			logger.error("Hook onFailure - impossible de nettoyer triggerId", {
				auctionId: auction.id,
				error:
					cleanupError instanceof Error
						? cleanupError.message
						: String(cleanupError),
			});
		}
	},

	run: async (data: ImportLotsPayload) => {
		const { lots, auction, options, user } = data;
		const xmlLots = lots.lot;

		logger.info("Début import lots", {
			auctionId: auction.id,
			auctionTitle: auction.title,
			totalLots: xmlLots.length,
			options,
			userId: user.id,
		});

		// Phase 1: Delete existing lots (transaction)
		const transactionID = await payload.db.beginTransaction();
		if (!transactionID) {
			throw new Error("Impossible de démarrer la transaction");
		}

		try {
			await deleteExistingLots(auction.id, transactionID);
			await payload.db.commitTransaction(transactionID);
		} catch (error) {
			logger.error("Erreur lors de la suppression des lots - rollback", {
				auctionId: auction.id,
				error: error instanceof Error ? error.message : String(error),
			});
			await payload.db.rollbackTransaction(transactionID);
			throw error;
		}

		// Phase 2: Process lots in parallel (no transaction)
		const limit = pLimit(CONCURRENCY);
		const results: ProcessSingleLotResult[] = await Promise.all(
			xmlLots.map((xmlLot) =>
				limit(() =>
					processSingleLot(xmlLot, buildLotNumber(xmlLot), options, auction.id),
				),
			),
		);

		const lotsCreated = results.filter(
			(
				r: ProcessSingleLotResult,
			): r is ProcessSingleLotResult & { success: true } => r.success,
		).length;
		const lotsFailed = results.filter(
			(
				r: ProcessSingleLotResult,
			): r is ProcessSingleLotResult & { success: false } => !r.success,
		);

		logger.info("Import terminé", {
			auctionId: auction.id,
			lotsCreated,
			lotsFailed: lotsFailed.length,
			totalLots: xmlLots.length,
		});

		if (lotsFailed.length > 0) {
			logger.warn("Lots non importés", {
				auctionId: auction.id,
				failed: lotsFailed.map((r) => ({
					lotNumber: r.lotNumber,
					error: r.error,
				})),
			});
		}
	},
});
