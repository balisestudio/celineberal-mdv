import type { CollectionConfig } from "payload";
import { can } from "@/lib/permissions";

export const Lots: CollectionConfig = {
	slug: "lots",
	labels: {
		singular: "Lot",
		plural: "Lots",
	},
	admin: {
		group: "Ventes",
		useAsTitle: "title",
		defaultColumns: ["title", "lotNumber", "sold", "updatedAt"],
	},
	access: {
		create: ({ req: { user } }) => can(user, "editor"),
		read: ({ req: { user } }) => can(user, "viewer"),
		update: ({ req: { user } }) => can(user, "editor"),
		delete: ({ req: { user } }) => can(user, "editor"),
	},
	fields: [
		{
			type: "tabs",
			tabs: [
				{
					label: "Informations générales",
					fields: [
						{
							type: "row",
							fields: [
								{
									name: "title",
									label: "Intitulé du lot",
									type: "text",
									required: true,
									localized: true,
									admin: { width: "50%" },
								},
								{
									name: "lotNumber",
									label: "Numéro du lot",
									type: "text",
									required: true,
									admin: { width: "50%" },
								},
							],
						},
						{
							name: "internalLotNumber",
							label: "Numéro de lot interne",
							type: "number",
							admin: {
								hidden: true,
							},
						},
						{
							name: "description",
							label: "Description du lot",
							type: "textarea",
							localized: true,
						},
						{
							name: "characteristics",
							label: "Caractéristiques",
							type: "array",
							labels: {
								singular: "Caractéristique",
								plural: "Caractéristiques",
							},
							fields: [
								{
									type: "row",
									fields: [
										{
											name: "key",
											label: "Clé",
											type: "text",
											required: true,
											localized: true,
											admin: { width: "50%" },
										},
										{
											name: "value",
											label: "Valeur",
											type: "text",
											required: true,
											localized: true,
											admin: { width: "50%" },
										},
									],
								},
							],
						},
					],
				},
				{
					label: "Estimations & Prix",
					fields: [
						{
							type: "row",
							fields: [
								{
									name: "lowEstimate",
									label: "Estimation basse",
									type: "number",
									admin: { width: "50%" },
								},
								{
									name: "highEstimate",
									label: "Estimation haute",
									type: "number",
									admin: { width: "50%" },
								},
							],
						},
						{
							name: "sold",
							label: "Vendu ?",
							type: "checkbox",
							defaultValue: false,
						},
						{
							name: "salePrice",
							label: "Prix de vente",
							type: "number",
							admin: {
								condition: (data) => data.sold === true,
							},
						},
					],
				},
				{
					label: "Images",
					fields: [
						{
							name: "images",
							label: "Images",
							type: "upload",
							relationTo: "media",
							hasMany: true,
							filterOptions: {
								usage: { equals: "lot" },
							},
						},
					],
				},
			],
		},
	],
};
