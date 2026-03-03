import { z } from "zod";

/**
 * Preprocessors
 */

const toArray = <T>(val: T | T[] | null | undefined): T[] =>
	Array.isArray(val) ? val : val != null ? [val] : [];

const toOptionalNumber = (val: unknown): number | undefined => {
	if (val === "" || val === undefined || val === null) return undefined;
	const n = Number(val);
	return Number.isNaN(n) ? undefined : n;
};

const toOptionalBis = (val: unknown): string | number | undefined => {
	if (typeof val === "object" && val !== null) return undefined;
	if (val === "") return undefined;
	return typeof val === "string" || typeof val === "number" ? val : undefined;
};

/**
 * Sub-schemas
 */

const numeroOrdreSchema = z.object({
	numero: z.coerce.number(),
	bis: z.preprocess(
		toOptionalBis,
		z.union([z.string(), z.number()]).optional(),
	),
});

const imageSchema = z.object({
	chemin: z.url(),
	rang: z.string(),
	legende: z.string().optional(),
});

const imagesSchema = z.preprocess(
	(val) => (!val || val === "" ? { image: [] } : val),
	z
		.object({
			image: z.preprocess(toArray, z.array(imageSchema)),
		})
		.optional(),
);

const lotSchema = z.object({
	identifiant: z.string(),
	"numero-ordre": numeroOrdreSchema,
	"id-categorie": z.string().optional(),
	description: z.string(),
	"estimation-basse": z.preprocess(toOptionalNumber, z.number().optional()),
	"estimation-haute": z.preprocess(toOptionalNumber, z.number().optional()),
	"lot-phare": z.preprocess(toOptionalNumber, z.number().optional()),
	"prix-depart": z.preprocess(toOptionalNumber, z.number().optional()),
	"prix-reserve": z.preprocess(toOptionalNumber, z.number().optional()),
	"type-lot": z.string().optional(),
	"tva-recuperable": z.preprocess(toOptionalNumber, z.number().optional()),
	images: imagesSchema,
});

/**
 * Main schema
 */

export const interenchersSchema = z.object({
	"import-lots": z.object({
		lots: z.object({
			lot: z.preprocess(toArray, z.array(lotSchema)),
		}),
	}),
});

/**
 * Types
 */

export type InterenchersLot = z.infer<typeof lotSchema>;
export type InterenchersLots = z.infer<
	typeof interenchersSchema
>["import-lots"]["lots"];
export type InterenchersSchema = z.infer<typeof interenchersSchema>;
