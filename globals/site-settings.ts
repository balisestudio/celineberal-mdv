import type { GlobalConfig } from "payload";
import { can } from "@/lib/permissions";

export const SiteSettings: GlobalConfig = {
	slug: "site-settings",
	label: "Paramètre du site",
	admin: {
		group: "Configuration",
	},
	access: {
		read: () => true,
		update: ({ req: { user } }) => can(user, "editor"),
	},
	fields: [
		{
			name: "siteName",
			label: "Nom du site",
			type: "text",
			required: true,
		},
		{
			name: "tagline",
			label: "Tagline",
			type: "text",
			required: true,
			localized: true,
		},
		{
			name: "graphics",
			label: "Graphiques",
			type: "group",
			fields: [
				{
					name: "logo",
					label: "Logo",
					type: "upload",
					relationTo: "media",
					required: true,
				},
				{
					name: "icon",
					label: "Icône",
					type: "upload",
					relationTo: "media",
					required: true,
				},
			],
		},
	],
};
