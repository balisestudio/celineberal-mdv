import path from "node:path";
import { fileURLToPath } from "node:url";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { nodemailerAdapter } from "@payloadcms/email-nodemailer";
import { fr } from "@payloadcms/translations/languages/fr";
import { buildConfig } from "payload";
import sharp from "sharp";
import { Auctions } from "@/collections/auctions";
import { Collaborators } from "@/collections/collaborators";
import { Estimates } from "@/collections/estimates";
import { Lots } from "@/collections/lots";
import { Media } from "@/collections/media";
import { Users } from "@/collections/users";
import { SiteSettings } from "@/globals/site-settings";
import { env } from "@/lib/env";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const collections = [
	Users,
	Media,
	Collaborators,
	Lots,
	Auctions,
	Estimates,
].map((collection) => {
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
	globals: [SiteSettings],
	secret: env.PAYLOAD_SECRET,
	typescript: {
		outputFile: path.resolve(dirname, "payload-types.ts"),
	},
	db: postgresAdapter({
		pool: {
			connectionString: env.DATABASE_URL,
		},
		push: false,
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
