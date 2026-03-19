import type { CollectionConfig } from "payload";
import {
	revalidateAfterChange,
	revalidateAfterDelete,
} from "@/hooks/revalidate-tag";
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
	hooks: {
		afterChange: [revalidateAfterChange("thematics", "encyclopedia")],
		afterDelete: [revalidateAfterDelete("thematics", "encyclopedia")],
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
			collection: "encyclopedia",
			on: "thematique",
		},
	],
};
