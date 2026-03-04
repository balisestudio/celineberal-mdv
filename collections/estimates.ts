import type { CollectionConfig } from "payload";
import { can } from "@/lib/permissions";

export const Estimates: CollectionConfig = {
	slug: "estimates",
	labels: {
		singular: "Estimation",
		plural: "Estimations",
	},
	admin: {
		group: "Estimations",
		useAsTitle: "lastName",
		defaultColumns: ["lastName", "firstName", "email", "createdAt"],
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
					label: "Coordonnées personnelles",
					fields: [
						{
							name: "civility",
							label: "Civilité",
							type: "select",
							required: true,
							options: [
								{ label: "Madame", value: "woman" },
								{ label: "Monsieur", value: "man" },
								{ label: "Autre", value: "other" },
							],
						},
						{
							name: "firstName",
							label: "Prénom",
							type: "text",
							required: true,
						},
						{
							name: "lastName",
							label: "Nom",
							type: "text",
							required: true,
						},
						{
							name: "email",
							label: "Email",
							type: "email",
							required: true,
						},
						{
							name: "phone",
							label: "Téléphone",
							type: "text",
							required: true,
						},
						{
							name: "address",
							label: "Adresse",
							type: "text",
						},
						{
							name: "postalCode",
							label: "Code postal",
							type: "text",
						},
						{
							name: "city",
							label: "Ville",
							type: "text",
						},
					],
				},
				{
					label: "Détails",
					fields: [
						{
							name: "photos",
							label: "Photos",
							type: "array",
							required: true,
							minRows: 1,
							maxRows: 5,
							labels: {
								singular: "Photo",
								plural: "Photos",
							},
							fields: [
								{
									name: "media",
									label: "Média",
									type: "upload",
									relationTo: "media",
									required: true,
									filterOptions: {
										usage: { equals: "estimates" },
									},
								},
							],
						},
						{
							name: "dimensions",
							label: "Dimensions",
							type: "text",
						},
						{
							name: "descriptions",
							label: "Descriptions",
							type: "textarea",
						},
					],
				},
				{
					label: "Légal",
					fields: [
						{
							name: "acceptedTerms",
							label: "A accepté les CGU",
							type: "checkbox",
							required: true,
							defaultValue: false,
						},
						{
							name: "allowsPhotoReuse",
							label: "Autorise la réutilisation des photos",
							type: "checkbox",
							defaultValue: false,
						},
					],
				},
			],
		},
	],
};
