import type { CollectionConfig } from "payload";
import { can } from "@/lib/permissions";

export const Media: CollectionConfig = {
	slug: "media",
	access: {
		read: () => true,
		create: ({ req: { user } }) => can(user, "editor"),
	},
	fields: [
		{
			name: "alt",
			type: "text",
		},
	],
	upload: true,
};
