import { z } from "zod";

export const env = z
	.object({
		DATABASE_URL: z.string(),
		PAYLOAD_SECRET: z.string(),
		SMTP_HOST: z.string(),
		SMTP_PORT: z.string().transform(Number),
		SMTP_USER: z.string(),
		SMTP_PASSWORD: z.string(),
		DEFAULT_FROM_ADDRESS: z.email(),
		DEFAULT_FROM_NAME: z.string(),
		SITE_NAME: z.string(),
		AI_GATEWAY_API_KEY: z.string(),
		TRIGGER_SECRET_KEY: z.string(),
		S3_BUCKET: z.string(),
		S3_ACCESS_KEY_ID: z.string(),
		S3_SECRET_ACCESS_KEY: z.string(),
		S3_REGION: z.string(),
		S3_ENDPOINT: z.string(),
		S3_CDN_URL: z.string(),
	})
	.parse(process.env);
