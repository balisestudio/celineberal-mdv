import { createId } from "@paralleldrive/cuid2";
import type { CollectionConfig } from "payload";
import { slugify } from "payload/shared";
import { can } from "@/lib/permissions";

export const Auctions: CollectionConfig = {
	slug: "auctions",
	labels: {
		singular: "Vente",
		plural: "Ventes",
	},
	admin: {
		group: "Ventes",
		useAsTitle: "title",
		defaultColumns: ["title", "auctionDate", "location", "updatedAt"],
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
					data.slug = `${slugify(data.title)}-${createId()}`;
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
							label: "Intitulé de la vente",
							type: "text",
							required: true,
						},
						{
							type: "row",
							fields: [
								{
									name: "auctionDate",
									label: "Date et heure de la vente",
									type: "date",
									required: true,
									admin: {
										width: "50%",
										date: {
											pickerAppearance: "dayAndTime",
										},
									},
								},
								{
									name: "location",
									label: "Lieu de la vente",
									type: "text",
									required: true,
									admin: { width: "50%" },
								},
							],
						},
						{
							name: "poster",
							label: "Affiche de la vente",
							type: "upload",
							relationTo: "media",
							required: true,
							filterOptions: {
								usage: { equals: "auction" },
							},
						},
						{
							name: "description",
							label: "Description",
							type: "textarea",
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
					],
				},
				{
					label: "Lots",
					fields: [
						{
							name: "lots",
							label: "Lots",
							type: "array",
							labels: {
								singular: "Lot",
								plural: "Lots",
							},
							fields: [
								{
									name: "lot",
									label: "Lot",
									type: "relationship",
									relationTo: "lots",
									required: true,
								},
							],
						},
					],
				},
				{
					label: "Collaborateurs",
					fields: [
						{
							name: "collaborators",
							label: "Collaborateurs",
							type: "array",
							labels: {
								singular: "Collaborateur",
								plural: "Collaborateurs",
							},
							fields: [
								{
									name: "collaborator",
									label: "Collaborateur",
									type: "relationship",
									relationTo: "collaborators",
									required: true,
								},
								{
									name: "role",
									label: "Rôle",
									type: "text",
									required: true,
									localized: true,
								},
							],
						},
					],
				},
			],
		},
	],
};
