import { generateText, Output } from "ai";
import { z } from "zod";
import {
	AUCTION_CATALOG_SYSTEM_PROMPT,
	TRANSLATE_TO_LOCALE_INSTRUCTIONS,
} from "@/lib/ai/prompts";
import { model } from "@/lib/ai/provider";

const translateLotSchema = z.object({
	title: z.string().describe("Translated lot title"),
	description: z.string().describe("Translated lot description"),
	characteristics: z
		.array(
			z.object({
				key: z.string().describe("Translated characteristic key"),
				value: z.string().describe("Translated characteristic value"),
			}),
		)
		.describe(
			"Translated characteristics. Must have the same number of items as the input, in the same order.",
		),
});

type TranslateLotResult = z.infer<typeof translateLotSchema>;

type TranslateLotInput = {
	title: string;
	description: string;
	characteristics?: { key: string; value: string }[];
};

export const translateLot = async (
	input: TranslateLotInput,
	targetLocale: string,
): Promise<TranslateLotResult> => {
	const langLabel = targetLocale === "en" ? "anglais" : targetLocale;
	const prompt = `Traduis en ${langLabel} le contenu suivant en respectant les règles de traduction du titre (noms propres et titres d'oeuvres inchangés, partie descriptive traduite). Conserve le ton et ne reformule pas.

Titre : ${input.title}

Description : ${input.description}

Caractéristiques :
${
	input.characteristics?.length
		? input.characteristics.map((c) => `- ${c.key} : ${c.value}`).join("\n")
		: "(aucune)"
}`;

	const { output } = await generateText({
		model,
		output: Output.object({ schema: translateLotSchema }),
		system: `${AUCTION_CATALOG_SYSTEM_PROMPT}${TRANSLATE_TO_LOCALE_INSTRUCTIONS}`,
		prompt,
	});

	if (!output) {
		throw new Error("AI translation returned no structured output");
	}

	return output;
};
