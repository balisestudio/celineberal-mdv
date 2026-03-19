import type { CollectionConfig } from "payload";
import {
	revalidateAfterChange,
	revalidateAfterDelete,
} from "@/hooks/revalidate-tag";
import { can } from "@/lib/permissions";

export const Collaborators: CollectionConfig = {
	slug: "collaborators",
	labels: {
		singular: "Collaborateur",
		plural: "Collaborateurs",
	},
	admin: {
		group: "Administration",
		useAsTitle: "name",
		defaultColumns: ["name", "role", "email", "updatedAt"],
	},
	access: {
		create: ({ req: { user } }) => can(user, "editor"),
		read: ({ req: { user } }) => can(user, "viewer"),
		update: ({ req: { user } }) => can(user, "editor"),
		delete: ({ req: { user } }) => can(user, "editor"),
	},
	hooks: {
		afterChange: [revalidateAfterChange("auctions", "about")],
		afterDelete: [revalidateAfterDelete("auctions", "about")],
	},
	fields: [
		{
			name: "name",
			label: "Prénom & Nom",
			type: "text",
			required: true,
		},
		{
			name: "role",
			label: "Rôle",
			type: "text",
			localized: true,
			required: true,
		},
		{
			name: "bio",
			label: "Biographie",
			type: "textarea",
			localized: true,
		},
		{
			type: "row",
			fields: [
				{
					name: "email",
					label: "Email",
					type: "email",
					admin: { width: "50%" },
				},
				{
					name: "phone",
					label: "Téléphone",
					type: "text",
					admin: { width: "50%" },
				},
			],
		},
		{
			name: "photo",
			label: "Photo",
			type: "upload",
			relationTo: "media",
			filterOptions: {
				usage: { equals: "collaborator" },
			},
		},
	],
};
