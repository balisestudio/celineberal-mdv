import { z } from "zod";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
const MAX_PHOTOS = 5;
const MIN_PHOTOS = 1;

export const estimateStep0Schema = z.object({
	civility: z.enum(["man", "woman"], { message: "required" }),
	firstName: z.string().min(1, "required"),
	lastName: z.string().min(1, "required"),
	email: z.string().min(1, "required").email("invalidEmail"),
	phone: z.string().min(1, "required"),
	address: z.string().optional(),
	postalCode: z.string().optional(),
	city: z.string().optional(),
});

export type EstimateStep0 = z.infer<typeof estimateStep0Schema>;

export const estimateStep1Schema = z.object({
	dimensions: z.string().optional(),
	descriptions: z.string().optional(),
});

export type EstimateStep1 = z.infer<typeof estimateStep1Schema>;

export const estimateStep2Schema = z.object({
	acceptedTerms: z.literal(true, { message: "cguRequired" }),
	allowsPhotoReuse: z.boolean().optional(),
});

export type EstimateStep2 = z.infer<typeof estimateStep2Schema>;

export const presignFileSchema = z.object({
	filename: z.string().min(1),
	mimeType: z.enum(ALLOWED_IMAGE_TYPES as unknown as [string, ...string[]], {
		message: "photoType",
	}),
	size: z.number().int().positive(),
});

export const presignBodySchema = z.object({
	files: z
		.array(presignFileSchema)
		.min(MIN_PHOTOS, "minPhotos")
		.max(MAX_PHOTOS, "maxPhotos"),
});

export type PresignBody = z.infer<typeof presignBodySchema>;

export const photoRefSchema = z.object({
	key: z.string().min(1),
	filename: z.string().min(1),
	mimeType: z.string(),
	size: z.number().int().positive(),
});

export type PhotoRef = z.infer<typeof photoRefSchema>;

export const submitBodySchema = estimateStep0Schema
	.merge(estimateStep1Schema)
	.merge(estimateStep2Schema)
	.extend({
		photos: z
			.array(photoRefSchema)
			.min(MIN_PHOTOS, "minPhotos")
			.max(MAX_PHOTOS, "maxPhotos"),
	});

export type SubmitBody = z.infer<typeof submitBodySchema>;

export { ALLOWED_IMAGE_TYPES, MAX_PHOTOS, MIN_PHOTOS };
