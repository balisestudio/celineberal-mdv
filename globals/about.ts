import type { GlobalConfig } from "payload";
import { can } from "@/lib/permissions";

export const About: GlobalConfig = {
	slug: "about",
	label: "À propos",
	admin: {
		group: "Configuration",
	},
	access: {
		read: () => true,
		update: ({ req: { user } }) => can(user, "editor"),
	},
	fields: [
		{
			type: "tabs",
			tabs: [
				{
					label: "Manifeste",
					fields: [
						{
							name: "manifesto",
							label: "Manifeste",
							type: "textarea",
							required: true,
							localized: true,
						},
						{
							name: "signature",
							label: "Signature",
							type: "text",
							required: true,
						},
						{
							name: "aboutImage",
							label: "Photo à propos",
							type: "upload",
							relationTo: "media",
						},
					],
				},
				{
					label: "Valeurs",
					fields: [
						{
							name: "values",
							label: "Nos valeurs",
							type: "array",
							fields: [
								{
									name: "title",
									label: "Titre",
									type: "text",
									localized: true,
								},
								{
									name: "description",
									label: "Description",
									type: "textarea",
									localized: true,
								},
							],
						},
					],
				},
				{
					label: "À propos",
					fields: [
						{
							name: "aboutText",
							label: "Texte à propos",
							type: "textarea",
							required: true,
							localized: true,
						},
					],
				},
				{
					label: "Presse",
					fields: [
						{
							name: "press",
							label: "Ils parlent de nous",
							type: "array",
							fields: [
								{
									name: "label",
									label: "Nom / titre",
									type: "text",
									required: true,
								},
							],
						},
					],
				},
			],
		},
	],
};
