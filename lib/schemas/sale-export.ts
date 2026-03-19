import { parse } from "csv-parse/sync";
import { z } from "zod";

/**
 * Column names as produced by the sale export CSV (semicolon-delimited, UTF-8).
 */
const LOT_NUMBER_HEADER = "N° du lot";
const ADJUDICATION_HEADER = "Adjudication";

export type SaleExportRow = {
	lotNumber: string;
	adjudication: number | null;
};

const parseAdjudication = (raw: string | undefined | null): number | null => {
	if (raw === undefined || raw === null) return null;
	const trimmed = String(raw).trim();
	if (trimmed === "") return null;
	const n = Number(trimmed.replace(",", "."));
	return Number.isFinite(n) && n > 0 ? n : null;
};

const normalizeLotNumberKey = (
	raw: string | number | undefined | null,
): string => {
	if (raw === undefined || raw === null) return "";
	return String(raw).trim();
};

const rowSchema = z
	.object({
		[LOT_NUMBER_HEADER]: z.union([z.string(), z.number()]).optional(),
		[ADJUDICATION_HEADER]: z.union([z.string(), z.number()]).optional(),
	})
	.passthrough();

/**
 * Parses the sale export CSV and returns a map of lot number → adjudication (sale price).
 * Duplicate lot numbers: the last row wins.
 */
export const parseSaleExportCsv = (
	csvText: string,
): Map<string, SaleExportRow> => {
	const records = parse(csvText, {
		columns: true,
		delimiter: ";",
		bom: true,
		skip_empty_lines: true,
		relax_column_count: true,
		trim: false,
	}) as Record<string, string>[];

	if (records.length === 0) {
		throw new Error(
			"Le fichier CSV est vide ou ne contient pas d'en-têtes valides.",
		);
	}

	const first = records[0];
	if (!(LOT_NUMBER_HEADER in first) || !(ADJUDICATION_HEADER in first)) {
		throw new Error(
			"Le CSV ne contient pas les colonnes attendues (N° du lot, Adjudication).",
		);
	}

	const map = new Map<string, SaleExportRow>();

	for (const record of records) {
		const parsed = rowSchema.safeParse(record);
		if (!parsed.success) continue;

		const lotKey = normalizeLotNumberKey(parsed.data[LOT_NUMBER_HEADER]);
		if (lotKey === "") continue;

		const adjudication = parseAdjudication(
			parsed.data[ADJUDICATION_HEADER] != null
				? String(parsed.data[ADJUDICATION_HEADER])
				: "",
		);

		map.set(lotKey, { lotNumber: lotKey, adjudication });
	}

	if (map.size === 0) {
		throw new Error(
			"Aucune ligne exploitable n'a été trouvée dans l'export des ventes.",
		);
	}

	return map;
};

export const salePricesMapToRecord = (
	map: Map<string, SaleExportRow>,
): Record<string, number | null> => {
	const out: Record<string, number | null> = {};
	for (const [key, row] of map) {
		out[key] = row.adjudication;
	}
	return out;
};
