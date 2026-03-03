import config from "@payload-config";
import { logger, task } from "@trigger.dev/sdk/v3";
import type { BasePayload } from "payload";
import { getPayload } from "payload";
import type { ImportLotsOptions } from "@/components/payload/imports-lots/action";
import { optimizeLot } from "@/lib/ai/optimize-lot";
import { translateLot } from "@/lib/ai/translate-lot";
import type {
	InterenchersLot,
	InterenchersLots,
} from "@/lib/schemas/interenchers";
import type { Auction, User } from "@/payload-types";

/**
 * Constants
 */

const TITLE_MAX_LENGTH = 80;

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

const getPayloadInstance = () => getPayload({ config });

const clearTriggerId = async (auctionId: number) => {
	const payload = await getPayloadInstance();
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
	payload: BasePayload,
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
	} else {
		frTitle = cropTitle(rawDescription);
		frDescription = rawDescription;
	}

	let enTitle: string | undefined;
	let enDescription: string | undefined;
	let enCharacteristics: { key: string; value: string }[] | undefined;

	if (options.translateContent) {
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
	payload: BasePayload,
	lot: InterenchersLot,
	lotTitle: string,
	lotNumber: string,
	transactionID: string | number,
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
			req: { transactionID } as never,
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

		const payload = await getPayloadInstance();
		const transactionID = await payload.db.beginTransaction();

		if (!transactionID) {
			throw new Error("Impossible de démarrer la transaction");
		}

		logger.info("Transaction démarrée", { transactionID });

		try {
			// A. Delete existing lots
			await deleteExistingLots(payload, auction.id, transactionID);

			// B. Process each XML lot
			let lotsCreated = 0;

			for (let i = 0; i < xmlLots.length; i++) {
				const xmlLot = xmlLots[i];
				const lotNumber = buildLotNumber(xmlLot);

				logger.info("Traitement lot", {
					lotNumber,
					index: i + 1,
					total: xmlLots.length,
					identifiant: xmlLot.identifiant,
				});

				// B.1 + B.2 + B.3: AI optimization + translation
				const content = await processLotContent(xmlLot, lotNumber, options);

				// B.4: Create lot in Payload (FR locale)
				const lotData = {
					auction: auction.id,
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

				logger.info("Création lot (FR)", {
					lotNumber,
					title: content.frTitle,
				});

				const createdLot = await payload.create({
					collection: "lots",
					data: lotData,
					locale: "fr",
					req: { transactionID } as never,
				});

				logger.info("Lot créé", {
					lotId: createdLot.id,
					lotNumber,
					title: content.frTitle,
				});

				// B.5: Add EN locale if translated
				if (content.enTitle && content.enDescription) {
					const enData: Record<string, unknown> = {
						title: content.enTitle,
						description: content.enDescription,
					};

					if (
						content.enCharacteristics &&
						content.enCharacteristics.length > 0
					) {
						enData.characteristics = content.enCharacteristics;
					}

					logger.info("Mise à jour locale EN", {
						lotId: createdLot.id,
						lotNumber,
						title: content.enTitle,
					});

					await payload.update({
						collection: "lots",
						id: createdLot.id,
						data: enData,
						locale: "en",
						req: { transactionID } as never,
					});
				}

				// B.6 + B.7: Download and upload images
				const mediaIds = await uploadLotImages(
					payload,
					xmlLot,
					content.frTitle,
					lotNumber,
					transactionID,
				);

				// B.8: Link images to lot
				if (mediaIds.length > 0) {
					logger.info("Liaison images au lot", {
						lotId: createdLot.id,
						lotNumber,
						imageCount: mediaIds.length,
					});

					await payload.update({
						collection: "lots",
						id: createdLot.id,
						data: { images: mediaIds },
						req: { transactionID } as never,
					});
				}

				lotsCreated++;
			}

			// C. Commit transaction
			await payload.db.commitTransaction(transactionID);

			logger.info("Import terminé avec succès", {
				auctionId: auction.id,
				lotsCreated,
				totalImages: xmlLots.reduce(
					(sum, lot) => sum + (lot.images?.image?.length ?? 0),
					0,
				),
			});
		} catch (error) {
			logger.error("Erreur lors de l'import - rollback", {
				auctionId: auction.id,
				error: error instanceof Error ? error.message : String(error),
				stack: error instanceof Error ? error.stack : undefined,
			});

			await payload.db.rollbackTransaction(transactionID);

			throw error;
		}
	},
});
