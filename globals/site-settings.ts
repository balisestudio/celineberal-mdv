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
			name: "exceptionLots",
			label: "Lots d'exception",
			type: "relationship",
			relationTo: "lots",
			hasMany: true,
			maxRows: 20,
		},
	],
};
