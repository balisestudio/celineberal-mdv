import { withPayload } from "@payloadcms/next/withPayload";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		serverActions: {
			bodySizeLimit: "4mb",
		},
		globalNotFound: true,
	},
	images: {
		unoptimized: true,
	},
};

export default withNextIntl(withPayload(nextConfig, { devBundleServerPackages: false }));
