import type { CollectionConfig } from "payload";
import { can } from "@/lib/permissions";

export const Media: CollectionConfig = {
	slug: "media",
	access: {
		create: ({ req: { user } }) => can(user, "editor"),
		read: () => true,
		update: ({ req: { user } }) => can(user, "editor"),
		delete: ({ req: { user } }) => can(user, "editor"),
	},
	fields: [
		{
			name: "alt",
			type: "text",
		},
	],
	upload: {
		adminThumbnail: "thumbnail",
		mimeTypes: ["image/*"],
		formatOptions: {
			format: "webp",
			options: { quality: 85 },
		},
		imageSizes: [
			{
				name: "thumbnail",
				width: 400,
				formatOptions: { format: "webp", options: { quality: 80 } },
			},
			{
				name: "sm",
				width: 768,
				formatOptions: { format: "webp", options: { quality: 80 } },
			},
			{
				name: "md",
				width: 1024,
				formatOptions: { format: "webp", options: { quality: 80 } },
			},
			{
				name: "lg",
				width: 1536,
				formatOptions: { format: "webp", options: { quality: 82 } },
			},
			{
				name: "xl",
				width: 2048,
				formatOptions: { format: "webp", options: { quality: 82 } },
			},
			{
				name: "2xl",
				width: 2560,
				formatOptions: { format: "webp", options: { quality: 82 } },
			},
		],
	},
};
