import {
	BlockquoteFeature,
	BlocksFeature,
	BoldFeature,
	EXPERIMENTAL_TableFeature,
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
	UnorderedListFeature,
	UploadFeature,
} from "@payloadcms/richtext-lexical";

export const encyclopediaEditor = lexicalEditor({
	features: () => [
		ParagraphFeature(),
		HeadingFeature({
			enabledHeadingSizes: ["h2", "h3", "h4"],
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
		EXPERIMENTAL_TableFeature(),
		UnorderedListFeature(),
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
