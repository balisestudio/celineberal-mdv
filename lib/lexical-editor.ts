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

export const encyclopediaEditor = lexicalEditor({
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
						singular: "Ventes",
						plural: "Ventes",
					},
					fields: [
						{
							name: "auctions",
							type: "relationship",
							relationTo: "auctions",
							hasMany: true,
							required: true,
							minRows: 1,
							label: "Ventes",
						},
					],
				},
				{
					slug: "lot",
					labels: {
						singular: "Lots",
						plural: "Lots",
					},
					fields: [
						{
							name: "lots",
							type: "relationship",
							relationTo: "lots",
							hasMany: true,
							required: true,
							minRows: 1,
							label: "Lots",
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
