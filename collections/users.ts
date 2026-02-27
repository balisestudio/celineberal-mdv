import type { CollectionConfig } from "payload";
import { can } from "@/lib/permissions";

export const Users: CollectionConfig = {
	slug: "users",
	labels: {
		singular: "Utilisateur",
		plural: "Utilisateurs",
	},
	admin: {
		group: "Administration",
		useAsTitle: "email",
	},
	access: {
		create: ({ req: { user } }) => can(user, "admin"),
		read: ({ req: { user } }) => can(user, "viewer"),
		update: ({ req: { user, data } }) =>
			can(user, "admin") || user?.id === data?.id,
		delete: ({ req: { user } }) => can(user, "admin"),
	},
	auth: true,
	fields: [
		{
			name: "name",
			label: "Nom complet",
			type: "text",
			required: true,
		},
		{
			name: "role",
			label: "Rôle",
			type: "select",
			options: [
				{
					label: "Administrateur",
					value: "admin",
				},
				{
					label: "Éditeur",
					value: "editor",
				},
				{
					label: "Invité",
					value: "viewer",
				},
			],
			required: true,
			saveToJWT: true,
			access: {
				update: ({ req: { user } }) => user?.role === "admin",
			},
		},
	],
};
