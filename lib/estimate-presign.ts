import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createId } from "@paralleldrive/cuid2";
import sanitize from "sanitize-s3-objectkey";
import { env } from "@/lib/env";
import type { PresignBody } from "@/lib/schemas/estimate";

const MEDIA_PREFIX = "media";
const ESTIMATES_SUBPATH = "estimates";
const PRESIGN_EXPIRES_IN = 60 * 15; // 15 minutes

const getS3Client = () =>
	new S3Client({
		credentials: {
			accessKeyId: env.S3_ACCESS_KEY_ID,
			secretAccessKey: env.S3_SECRET_ACCESS_KEY,
		},
		region: env.S3_REGION,
		endpoint: env.S3_ENDPOINT,
		forcePathStyle: true,
	});

/**
 * Generate presigned PUT URLs for client-side upload to S3.
 * Returns one URL and key per file. Keys are: media/estimates/{cuid}-{sanitizedFilename}.
 */
export const getPresignedUploadUrls = async (
	body: PresignBody,
): Promise<{ url: string; key: string }[]> => {
	const client = getS3Client();
	const results: { url: string; key: string }[] = [];

	for (const file of body.files) {
		const ext = file.filename.includes(".")
			? file.filename.slice(file.filename.lastIndexOf("."))
			: "";
		const base =
			file.filename.slice(0, file.filename.length - ext.length) || "image";
		const safeName = sanitize(base) + ext;
		const key = `${MEDIA_PREFIX}/${ESTIMATES_SUBPATH}/${createId()}-${safeName}`;

		const command = new PutObjectCommand({
			Bucket: env.S3_BUCKET,
			Key: key,
			ContentType: file.mimeType,
			ContentLength: file.size,
		});

		const url = await getSignedUrl(client, command, {
			expiresIn: PRESIGN_EXPIRES_IN,
		});

		results.push({ url, key });
	}

	return results;
};

/** Extract prefix and filename for Payload Media from S3 key (e.g. media/estimates/xxx.jpg → prefix: media, filename: estimates/xxx.jpg). */
export const keyToMediaParts = (
	key: string,
): { prefix: string; filename: string } => {
	const firstSlash = key.indexOf("/");
	if (firstSlash === -1) {
		return { prefix: MEDIA_PREFIX, filename: key };
	}
	return {
		prefix: key.slice(0, firstSlash),
		filename: key.slice(firstSlash + 1),
	};
};
