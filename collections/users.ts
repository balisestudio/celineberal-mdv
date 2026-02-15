import type { CollectionConfig } from "payload";
import { can } from "@/lib/permissions";

export const Users: CollectionConfig = {
	slug: "users",
	admin: {
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
			name: "roles",
			type: "select",
			options: ["admin", "editor", "viewer"],
			defaultValue: ["viewer"],
			required: true,
			saveToJWT: true,
			access: {
				update: ({ req: { user } }) => user?.roles === "admin",
			},
		},
	],
};
