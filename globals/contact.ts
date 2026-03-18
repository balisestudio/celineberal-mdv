import type { GlobalConfig } from "payload";
import { can } from "@/lib/permissions";

export const Contact: GlobalConfig = {
	slug: "contact",
	label: "Contact",
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
					label: "Contact",
					fields: [
						{
							type: "row",
							fields: [
								{
									name: "email",
									label: "Email",
									type: "email",
									required: true,
									admin: { width: "50%" },
								},
								{
									name: "phone",
									label: "Téléphone",
									type: "text",
									required: true,
									admin: { width: "50%" },
								},
							],
						},
						{
							name: "address",
							label: "Adresse",
							type: "textarea",
							required: true,
						},
						{
							name: "horaires",
							label: "Horaires",
							type: "text",
						},
						{
							name: "socialLinks",
							label: "Réseaux sociaux",
							type: "array",
							fields: [
								{
									name: "name",
									label: "Nom du réseau",
									type: "text",
									required: true,
								},
								{
									name: "url",
									label: "Lien",
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
