import type { CollectionConfig } from "payload";
import { can } from "@/lib/permissions";

export const Thematics: CollectionConfig = {
	slug: "thematics",
	labels: {
		singular: "Thématique",
		plural: "Thématiques",
	},
	admin: {
		group: "Contenu",
		useAsTitle: "intitule",
		defaultColumns: ["intitule", "updatedAt"],
	},
	access: {
		create: ({ req: { user } }) => can(user, "editor"),
		read: ({ req: { user } }) => can(user, "viewer"),
		update: ({ req: { user } }) => can(user, "editor"),
		delete: ({ req: { user } }) => can(user, "editor"),
	},
	fields: [
		{
			name: "intitule",
			label: "Intitulé",
			type: "text",
			required: true,
			localized: true,
		},
		{
			name: "linked",
			label: "Articles liés",
			type: "join",
			collection: "guides",
			on: "thematique",
		},
	],
};
