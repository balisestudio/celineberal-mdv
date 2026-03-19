import path from "node:path";
import { fileURLToPath } from "node:url";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { nodemailerAdapter } from "@payloadcms/email-nodemailer";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
import { fr } from "@payloadcms/translations/languages/fr";
import { buildConfig } from "payload";
import sharp from "sharp";
import { Auctions } from "@/collections/auctions";
import { Collaborators } from "@/collections/collaborators";
import { Encyclopedias } from "@/collections/encyclopedia";
import { Estimates } from "@/collections/estimates";
import { Lots } from "@/collections/lots";
import { Media } from "@/collections/media";
import { Thematics } from "@/collections/thematics";
import { Users } from "@/collections/users";
import { About } from "@/globals/about";
import { Contact } from "@/globals/contact";
import { Legal } from "@/globals/legal";
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
	Thematics,
	Encyclopedias,
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
		components: {},
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
	editor: lexicalEditor(),
	collections,
	globals: [SiteSettings, Contact, Legal, About],
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
	plugins: [
		s3Storage({
			collections: {
				media: {
					prefix: "media",
					disablePayloadAccessControl: true,
					generateFileURL: ({ prefix, filename }) =>
						`${env.S3_CDN_URL}/${prefix}/${filename}`,
				},
			},
			clientUploads: true,
			bucket: env.S3_BUCKET,
			config: {
				credentials: {
					accessKeyId: env.S3_ACCESS_KEY_ID,
					secretAccessKey: env.S3_SECRET_ACCESS_KEY,
				},
				region: env.S3_REGION,
				endpoint: env.S3_ENDPOINT,
				forcePathStyle: true,
			},
		}),
	],
});
