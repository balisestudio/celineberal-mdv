import type { CollectionConfig } from "payload";
import { getDominantColor } from "@/lib/dominant-color";
import { can } from "@/lib/permissions";

export const Media: CollectionConfig = {
	slug: "media",
	labels: {
		singular: "Média",
		plural: "Médias",
	},
	admin: {
		group: "Contenu",
	},
	access: {
		create: ({ req: { user } }) => can(user, "editor"),
		read: () => true,
		update: ({ req: { user } }) => can(user, "editor"),
		delete: ({ req: { user } }) => can(user, "editor"),
	},
	hooks: {
		beforeOperation: [
			async ({ req, operation }) => {
				if ((operation === "create" || operation === "update") && req.file) {
					const file = req.file as { data?: Buffer | Uint8Array };
					const buffer = file.data
						? Buffer.isBuffer(file.data)
							? file.data
							: Buffer.from(file.data)
						: null;
					if (buffer) {
						(req as { dominantColor?: string }).dominantColor =
							await getDominantColor(buffer);
					}
				}
			},
		],
		beforeChange: [
			async ({ data, req }) => {
				const dominantColor = (req as { dominantColor?: string }).dominantColor;
				if (dominantColor) {
					data.dominantColor = dominantColor;
				}
			},
		],
	},
	fields: [
		{
			name: "alt",
			label: "Texte alternatif",
			type: "text",
			localized: true,
		},
		{
			name: "usage",
			label: "Usage",
			type: "select",
			required: true,
			options: [
				{ label: "Lot", value: "lot" },
				{ label: "Collaborateur", value: "collaborator" },
				{ label: "Vente", value: "auction" },
				{ label: "Interne", value: "internal" },
				{ label: "Estimations", value: "estimates" },
			],
		},
		{
			name: "dominantColor",
			label: "Couleur dominante",
			type: "text",
			defaultValue: "#D1D1D1",
			admin: {
				hidden: true,
			},
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
