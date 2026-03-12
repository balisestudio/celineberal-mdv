import { z } from "zod";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
const MAX_PHOTOS = 5;
const MIN_PHOTOS = 1;

export const estimateCoordsSchema = z.object({
	civility: z.enum(["man", "woman"], { message: "required" }),
	firstName: z.string().min(1, "required"),
	lastName: z.string().min(1, "required"),
	email: z.string().min(1, "required").email("invalidEmail"),
	phone: z.string().min(1, "required"),
	address: z.string().optional(),
	postalCode: z.string().optional(),
	city: z.string().optional(),
});

export type EstimateCoords = z.infer<typeof estimateCoordsSchema>;

export const estimateDetailsSchema = z.object({
	dimensions: z.string().optional(),
	descriptions: z.string().optional(),
});

export type EstimateDetails = z.infer<typeof estimateDetailsSchema>;

export const estimateConsentsSchema = z.object({
	acceptedTerms: z.literal(true, { message: "cguRequired" }),
	allowsPhotoReuse: z.boolean().optional(),
});

export type EstimateConsents = z.infer<typeof estimateConsentsSchema>;

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

export const submitBodySchema = estimateCoordsSchema
	.merge(estimateDetailsSchema)
	.merge(estimateConsentsSchema)
	.extend({
		photos: z
			.array(photoRefSchema)
			.min(MIN_PHOTOS, "minPhotos")
			.max(MAX_PHOTOS, "maxPhotos"),
	});

export type SubmitBody = z.infer<typeof submitBodySchema>;

export { ALLOWED_IMAGE_TYPES, MAX_PHOTOS, MIN_PHOTOS };
