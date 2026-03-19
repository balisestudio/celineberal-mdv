import type { GlobalConfig } from "payload";
import { revalidateGlobalAfterChange } from "@/hooks/revalidate-tag";
import { encyclopediaEditor } from "@/lib/lexical-editor";
import { can } from "@/lib/permissions";

export const Legal: GlobalConfig = {
	slug: "legal",
	label: "Légal",
	admin: {
		group: "Configuration",
	},
	access: {
		read: () => true,
		update: ({ req: { user } }) => can(user, "editor"),
	},
	hooks: {
		afterChange: [revalidateGlobalAfterChange("legal")],
	},
	fields: [
		{
			type: "tabs",
			tabs: [
				{
					label: "Informations générales",
					fields: [
						{
							name: "siret",
							label: "SIRET",
							type: "text",
							required: true,
						},
						{
							name: "rcs",
							label: "RCS",
							type: "text",
							required: true,
						},
						{
							name: "capitalSocial",
							label: "Capital social",
							type: "text",
							required: true,
						},
						{
							name: "agrement",
							label: "Agrément",
							type: "text",
							required: true,
						},
					],
				},
				{
					label: "Documents",
					fields: [
						{
							name: "legalNotice",
							label: "Mentions légales",
							type: "richText",
							required: true,
							localized: true,
							editor: encyclopediaEditor,
						},
						{
							name: "privacyPolicy",
							label: "Politique de confidentialité",
							type: "richText",
							required: true,
							localized: true,
							editor: encyclopediaEditor,
						},
					],
				},
			],
		},
	],
};
