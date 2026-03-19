"use server";

import { XMLParser, XMLValidator } from "fast-xml-parser";
import { headers } from "next/headers";
import { getRunStatus, inngest } from "@/inngest/client";
import { payload } from "@/lib/payload";
import { can } from "@/lib/permissions";
import type { InterenchersLots } from "@/lib/schemas/interenchers";
import { interenchersSchema } from "@/lib/schemas/interenchers";
import {
	parseSaleExportCsv,
	salePricesMapToRecord,
} from "@/lib/schemas/sale-export";
import type { Auction, User } from "@/payload-types";

/**
 * Constants
 */

const ERRORS = {
	UNAUTHORIZED:
		"Vous ne disposez pas des droits requis pour téléverser un fichier d'importation.",
	INVALID_XML:
		"Le fichier téléversé n'est pas un document XML valide. Veuillez vérifier votre fichier Interencheres.",
	INVALID_STRUCTURE:
		"La structure du document est incorrecte. Veuillez vous assurer qu'il s'agit d'un export Interencheres conforme.",
	INVALID_CSV:
		"Le fichier CSV d'export des ventes est invalide ou ne correspond pas au format attendu.",
	TASK_FAILED:
		"Impossible de lancer la tâche d'importation. Veuillez réessayer.",
} as const;

const XML_PARSER_OPTIONS = {
	ignoreAttributes: false,
	parseTagValue: false,
	parseAttributeValue: false,
} as const;

/**
 * Helpers
 */

const getAuthenticatedUser = async () => {
	const { user } = await payload.auth({ headers: await headers() });
	return user;
};

const getAuctionWithLockStatus = async (auctionId: number, user: User) =>
	(await payload.findByID({
		collection: "auctions",
		id: auctionId,
		includeLockStatus: true,
		depth: 0,
		user,
		overrideAccess: false,
	})) as Auction & { _isLocked: boolean; _userEditing: User | null };

const parseAndValidateXml = (xml: string): InterenchersLots => {
	if (XMLValidator.validate(xml) !== true) {
		throw new Error(ERRORS.INVALID_XML);
	}

	const parser = new XMLParser(XML_PARSER_OPTIONS);
	const data = parser.parse(xml);
	const result = interenchersSchema.safeParse(data);

	if (!result.success) {
		throw new Error(ERRORS.INVALID_STRUCTURE);
	}

	return result.data["import-lots"].lots;
};

/**
 * Public API
 */

export const isAllowedToImportLots = async (
	auctionId: number,
): Promise<boolean> => {
	const user = await getAuthenticatedUser();
	if (!user || !can(user, "editor")) return false;

	const auction = await getAuctionWithLockStatus(auctionId, user as User);
	if (auction._isLocked) return false;

	if (auction.triggerId) {
		const { isRunning } = await getRunStatus(auction.triggerId);
		if (isRunning) return false;
		await payload.update({
			collection: "auctions",
			id: auctionId,
			data: { triggerId: null },
		});
	}

	return true;
};

export type ImportLotsOptions = {
	translateContent: boolean;
	optimizeContent: boolean;
};

type ImportLotsResult = { success: true } | { success: false; error: string };

export const importLots = async (
	xml: string,
	csv: string,
	auctionId: number,
	options: ImportLotsOptions,
): Promise<ImportLotsResult> => {
	const allowed = await isAllowedToImportLots(auctionId);
	if (!allowed) return { success: false, error: ERRORS.UNAUTHORIZED };

	let lots: InterenchersLots;
	try {
		lots = parseAndValidateXml(xml);
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : ERRORS.INVALID_STRUCTURE,
		};
	}

	let salePrices: Record<string, number | null>;
	try {
		const saleMap = parseSaleExportCsv(csv);
		salePrices = salePricesMapToRecord(saleMap);
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : ERRORS.INVALID_CSV,
		};
	}

	const [auction, user] = await Promise.all([
		payload.findByID({
			collection: "auctions",
			id: auctionId,
			depth: 0,
		}) as Promise<Auction>,
		getAuthenticatedUser(),
	]);

	if (!user) return { success: false, error: ERRORS.UNAUTHORIZED };

	try {
		const { ids } = await inngest.send({
			name: "auction/lots.import.requested",
			data: {
				lots,
				salePrices,
				auction,
				options,
				user: user as User,
			},
		});

		const eventId = ids?.[0];
		if (!eventId) throw new Error("No event ID returned");

		await payload.update({
			collection: "auctions",
			id: auctionId,
			data: { triggerId: eventId },
		});
		return { success: true };
	} catch (error) {
		await payload.update({
			collection: "auctions",
			id: auctionId,
			data: { triggerId: null },
		});
		return {
			success: false,
			error: error instanceof Error ? error.message : ERRORS.TASK_FAILED,
		};
	}
};
