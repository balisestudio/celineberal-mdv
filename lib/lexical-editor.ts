import {
	BlockquoteFeature,
	BlocksFeature,
	BoldFeature,
	HeadingFeature,
	HorizontalRuleFeature,
	InlineCodeFeature,
	InlineToolbarFeature,
	ItalicFeature,
	LinkFeature,
	lexicalEditor,
	ParagraphFeature,
	StrikethroughFeature,
	SubscriptFeature,
	SuperscriptFeature,
	UnderlineFeature,
	UploadFeature,
} from "@payloadcms/richtext-lexical";

export const guideEditor = lexicalEditor({
	features: () => [
		ParagraphFeature(),
		HeadingFeature({
			enabledHeadingSizes: ["h1", "h2", "h3"],
		}),
		BlockquoteFeature(),
		UploadFeature({
			collections: {
				media: {
					fields: [],
				},
			},
		}),
		HorizontalRuleFeature(),
		BlocksFeature({
			blocks: [
				{
					slug: "auction",
					labels: {
						singular: "Vente",
						plural: "Ventes",
					},
					fields: [
						{
							name: "auction",
							type: "relationship",
							relationTo: "auctions",
							required: true,
							label: "Vente",
						},
					],
				},
				{
					slug: "lot",
					labels: {
						singular: "Lot",
						plural: "Lots",
					},
					fields: [
						{
							name: "lot",
							type: "relationship",
							relationTo: "lots",
							required: true,
							label: "Lot",
						},
					],
				},
			],
		}),
		BoldFeature(),
		ItalicFeature(),
		UnderlineFeature(),
		StrikethroughFeature(),
		SubscriptFeature(),
		SuperscriptFeature(),
		InlineCodeFeature(),
		LinkFeature(),
		InlineToolbarFeature(),
	],
});
