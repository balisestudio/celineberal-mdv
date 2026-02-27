import { z } from "zod";

export const envSchema = z
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
	})
	.parse(process.env);

export const env = envSchema;
