import path from "node:path";
import { fileURLToPath } from "node:url";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { nodemailerAdapter } from "@payloadcms/email-nodemailer";
import { buildConfig } from "payload";
import sharp from "sharp";
import { Media } from "@/collections/media";
import { Users } from "@/collections/users";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const collections = [Users, Media].map((collection) => {
	return {
		...collection,
		admin: {
			...collection.admin,
			hideAPIURL: true,
		},
	};
});

export default buildConfig({
	admin: {
		user: Users.slug,
		importMap: {
			baseDir: path.resolve(dirname),
		},
		avatar: {
			Component: "/components/payload/avatar#Avatar",
		},
		autoRefresh: true,
	},
	collections,
	secret: process.env.PAYLOAD_SECRET || "",
	typescript: {
		outputFile: path.resolve(dirname, "payload-types.ts"),
	},
	db: postgresAdapter({
		pool: {
			connectionString: process.env.DATABASE_URL || "",
		},
	}),
	email: nodemailerAdapter({
		defaultFromAddress: process.env.DEFAULT_FROM_ADDRESS || "",
		defaultFromName: process.env.DEFAULT_FROM_NAME || "",
		transportOptions: {
			host: process.env.SMTP_HOST || "",
			port: parseInt(process.env.SMTP_PORT || "587"),
			auth: {
				user: process.env.SMTP_USER || "",
				pass: process.env.SMTP_PASSWORD || "",
			},
		},
	}),
	sharp,
	plugins: [],
});
