import path from "node:path";
import { fileURLToPath } from "node:url";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { nodemailerAdapter } from "@payloadcms/email-nodemailer";
import { fr } from "@payloadcms/translations/languages/fr";
import { buildConfig } from "payload";
import sharp from "sharp";
import { Media } from "@/collections/media";
import { Users } from "@/collections/users";
import { env } from "@/lib/env";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const collections = [Users, Media].map((collection) => {
	return {
		...collection,
		admin: {
			...collection.admin,
			hideAPIURL: process.env.NODE_ENV === "production",
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
		components: {
			graphics: {
				Icon: "/components/payload/graphics#Icon",
				Logo: "/components/payload/graphics#Logo",
			},
		},
		meta: {
			titleSuffix: `– ${env.SITE_NAME}`,
			icons: {
				icon: "/favicon.ico",
			},
		},
		autoRefresh: true,
		theme: "light",
	},
	localization: {
		defaultLocale: "fr",
		locales: ["fr", "en"],
	},
	collections,
	secret: env.PAYLOAD_SECRET,
	typescript: {
		outputFile: path.resolve(dirname, "payload-types.ts"),
	},
	db: postgresAdapter({
		pool: {
			connectionString: env.DATABASE_URL,
		},
	}),
	email: nodemailerAdapter({
		defaultFromAddress: env.DEFAULT_FROM_ADDRESS,
		defaultFromName: env.DEFAULT_FROM_NAME,
		transportOptions: {
			host: env.SMTP_HOST,
			port: env.SMTP_PORT,
			auth: {
				user: env.SMTP_USER,
				pass: env.SMTP_PASSWORD,
			},
		},
	}),
	i18n: {
		supportedLanguages: { fr },
	},
	sharp,
	plugins: [],
});
