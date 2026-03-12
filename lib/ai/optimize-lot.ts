import { generateText, Output } from "ai";
import { z } from "zod";
import {
	AUCTION_CATALOG_SYSTEM_PROMPT,
	OPTIMIZE_SPECIFIC_INSTRUCTIONS,
	RAW_DESCRIPTION_PROMPT_PREFIX,
} from "@/lib/ai/prompts";
import { model } from "@/lib/ai/provider";

const optimizeLotSchema = z.object({
	title: z
		.string()
		.describe(
			"Titre court et accrocheur du lot (max 100 caractères), résumant l'objet principal",
		),
	description: z
		.string()
		.describe(
			"Notice en prose continue, sans les caractéristiques extraites. Ne pas inventer de contenu.",
		),
	characteristics: z
		.array(
			z.object({
				key: z.string().describe("Nom de la caractéristique technique"),
				value: z.string().describe("Valeur de la caractéristique technique"),
			}),
		)
		.describe(
			"Maximum 3 paires. Uniquement si une donnée factuelle essentielle ne peut pas s'intégrer dans la description. Vide par défaut.",
		),
});

type OptimizeLotResult = z.infer<typeof optimizeLotSchema>;

export const optimizeLot = async (
	description: string,
): Promise<OptimizeLotResult> => {
	const { output } = await generateText({
		model,
		output: Output.object({ schema: optimizeLotSchema }),
		system: `${AUCTION_CATALOG_SYSTEM_PROMPT}${OPTIMIZE_SPECIFIC_INSTRUCTIONS}`,
		prompt: `${RAW_DESCRIPTION_PROMPT_PREFIX}\n\n${description}`,
	});

	if (!output) {
		throw new Error("AI optimization returned no structured output");
	}

	return output;
};
