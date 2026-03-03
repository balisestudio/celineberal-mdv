import { generateText, Output } from "ai";
import { z } from "zod";
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

export type TranslateLotResult = z.infer<typeof translateLotSchema>;

export type TranslateLotInput = {
	title: string;
	description: string;
	characteristics?: { key: string; value: string }[];
};

const SYSTEM_PROMPT = `Tu es un traducteur professionnel spécialisé dans les ventes aux enchères et le marché de l'art.

Tu reçois le titre, la description et les caractéristiques d'un lot de vente aux enchères en français.
Tu dois les traduire fidèlement dans la langue cible.

Règles strictes :
- Traduire fidèlement sans rien modifier, ajouter ou supprimer.
- Conserver le ton professionnel du catalogue.
- Les noms propres (artistes, marques, lieux) restent inchangés.
- Les unités de mesure restent dans le système métrique.
- Le nombre de caractéristiques en sortie doit être identique à celui en entrée, dans le même ordre.
- Si le tableau de caractéristiques en entrée est vide, retourner un tableau vide.`;

export const translateLot = async (
	input: TranslateLotInput,
	targetLocale: string,
): Promise<TranslateLotResult> => {
	const prompt = `Traduis en ${targetLocale === "en" ? "anglais" : targetLocale} le contenu suivant :

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
		system: SYSTEM_PROMPT,
		prompt,
	});

	if (!output) {
		throw new Error("AI translation returned no structured output");
	}

	return output;
};
