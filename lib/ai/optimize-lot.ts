import { generateText, Output } from "ai";
import { z } from "zod";
import { model } from "@/lib/ai/provider";

const optimizeLotSchema = z.object({
	title: z
		.string()
		.describe(
			"Titre court et accrocheur du lot (max 80 caractères), résumant l'objet principal",
		),
	description: z
		.string()
		.describe(
			"Description nettoyée du lot, sans les caractéristiques techniques qui ont été extraites dans le champ characteristics. Ne pas inventer de contenu.",
		),
	characteristics: z
		.array(
			z.object({
				key: z.string().describe("Nom de la caractéristique technique"),
				value: z.string().describe("Valeur de la caractéristique technique"),
			}),
		)
		.describe(
			"Caractéristiques techniques extraites de la description originale. Uniquement si la description contient des données techniques factuelles (dimensions, matériaux, époque, poids, etc.). Ne rien inventer. Laisser vide si aucune caractéristique pertinente.",
		),
});

export type OptimizeLotResult = z.infer<typeof optimizeLotSchema>;

const SYSTEM_PROMPT = `Tu es un expert en catalogage de ventes aux enchères.
Tu reçois la description brute d'un lot provenant d'un export Interenchères.

Ton rôle :
1. Générer un titre court et accrocheur (max 80 caractères) qui résume l'objet principal du lot.
2. Nettoyer et reformuler la description pour la rendre plus lisible et professionnelle.
3. Extraire les caractéristiques techniques factuelles (dimensions, matériaux, époque, poids, signature, etc.) UNIQUEMENT si elles sont présentes dans la description originale.

Règles strictes :
- Ne JAMAIS inventer de contenu. Tout doit provenir de la description originale.
- Les caractéristiques extraites ne doivent PLUS apparaître dans la description pour éviter les doublons.
- Si la description ne contient aucune caractéristique technique factuelle, retourner un tableau vide pour characteristics.
- La description nettoyée doit rester fidèle au sens original.`;

export const optimizeLot = async (
	description: string,
): Promise<OptimizeLotResult> => {
	const { output } = await generateText({
		model,
		output: Output.object({ schema: optimizeLotSchema }),
		system: SYSTEM_PROMPT,
		prompt: description,
	});

	if (!output) {
		throw new Error("AI optimization returned no structured output");
	}

	return output;
};
