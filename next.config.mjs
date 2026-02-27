import { withPayload } from "@payloadcms/next/withPayload";

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

export default withPayload(nextConfig, { devBundleServerPackages: false });
