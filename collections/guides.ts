import { createId } from "@paralleldrive/cuid2";
import type { CollectionConfig } from "payload";
import { slugify } from "payload/shared";
import { guideEditor } from "@/lib/lexical-editor";
import { can } from "@/lib/permissions";

export const Guides: CollectionConfig = {
	slug: "guides",
	labels: {
		singular: "Guide",
		plural: "Guides",
	},
	admin: {
		group: "Contenu",
		useAsTitle: "title",
		defaultColumns: ["title", "thematique", "updatedAt"],
	},
	access: {
		create: ({ req: { user } }) => can(user, "editor"),
		read: ({ req: { user } }) => {
			if (user && can(user, "viewer")) return true;
			return { _status: { equals: "published" } };
		},
		update: ({ req: { user } }) => can(user, "editor"),
		delete: ({ req: { user } }) => can(user, "editor"),
	},
	versions: {
		drafts: true,
		maxPerDoc: 100,
	},
	hooks: {
		beforeValidate: [
			({ data }) => {
				if (data?.title && !data?.slug) {
					data.slug = `${slugify(data.title)}-${createId().slice(0, 5)}`;
				}
				return data;
			},
		],
	},
	fields: [
		{
			type: "tabs",
			tabs: [
				{
					label: "Informations générales",
					fields: [
						{
							name: "title",
							label: "Titre",
							type: "text",
							required: true,
							localized: true,
						},
						{
							name: "slug",
							label: "Slug",
							type: "text",
							required: true,
							unique: true,
							index: true,
							admin: {
								hidden: true,
							},
						},
						{
							name: "poster",
							label: "Image à la une",
							type: "upload",
							relationTo: "media",
							required: true,
							filterOptions: {
								usage: { equals: "guide" },
							},
						},
					],
				},
				{
					label: "Contenu",
					fields: [
						{
							name: "content",
							label: "Contenu",
							type: "richText",
							required: true,
							localized: true,
							editor: guideEditor,
						},
					],
				},
				{
					label: "Métadonnées",
					fields: [
						{
							name: "thematique",
							label: "Thématique",
							type: "relationship",
							relationTo: "thematics",
							required: true,
						},
						{
							name: "author",
							label: "Auteur",
							type: "relationship",
							relationTo: "collaborators",
							required: true,
						},
					],
				},
			],
		},
	],
};
