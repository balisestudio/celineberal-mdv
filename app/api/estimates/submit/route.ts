import { NextResponse } from "next/server";
import { getPayload } from "payload";
import { env } from "@/lib/env";
import { keyToMediaParts } from "@/lib/estimate-presign";
import { submitBodySchema } from "@/lib/schemas/estimate";
import config from "@/payload.config";

export const maxDuration = 30;

const payloadPromise = getPayload({ config });

export const POST = async (req: Request) => {
	try {
		const body = await req.json();
		const parsed = submitBodySchema.safeParse(body);
		if (!parsed.success) {
			const msg =
				parsed.error.flatten().fieldErrors?.acceptedTerms?.[0] ??
				parsed.error.flatten().fieldErrors?.photos?.[0] ??
				"submitFailed";
			const message = typeof msg === "string" ? msg : "submitFailed";
			return NextResponse.json({ error: message }, { status: 400 });
		}
		const data = parsed.data;
		const payload = await payloadPromise;

		const mediaIds: number[] = [];
		for (const photo of data.photos) {
			const { prefix, filename } = keyToMediaParts(photo.key);
			// Use payload.db.create() to bypass upload hooks — the file is
			// already in S3, we only need to register the metadata in the DB.
			const record = await payload.db.create({
				collection: "media",
				data: {
					alt: `Estimation — ${data.lastName} ${data.firstName}`,
					usage: "estimates",
					prefix,
					filename,
					mimeType: photo.mimeType,
					filesize: photo.size,
					url: `${env.S3_CDN_URL}/${photo.key}`,
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
				},
			});
			mediaIds.push(record.id as number);
		}

		await payload.create({
			collection: "estimates",
			data: {
				civility: data.civility,
				firstName: data.firstName,
				lastName: data.lastName,
				email: data.email,
				phone: data.phone,
				address: data.address ?? null,
				postalCode: data.postalCode ?? null,
				city: data.city ?? null,
				photos: mediaIds.map((id) => ({ media: id })),
				dimensions: data.dimensions ?? null,
				descriptions: data.descriptions ?? null,
				acceptedTerms: true,
				allowsPhotoReuse: Boolean(data.allowsPhotoReuse),
			},
			overrideAccess: true,
		});

		return NextResponse.json({ success: true });
	} catch (e) {
		console.error("Estimate submit error:", e);
		return NextResponse.json({ error: "submitFailed" }, { status: 500 });
	}
};
