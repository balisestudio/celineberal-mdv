import "dotenv/config";
import { additionalPackages } from "@trigger.dev/build/extensions/core";
import { defineConfig } from "@trigger.dev/sdk/v3";

export default defineConfig({
	project: "proj_vrkkkowcxucqpiphhppw",
	runtime: "node",
	logLevel: "log",
	maxDuration: 3600,
	dirs: ["trigger"],
	build: {
		external: ["drizzle-kit", "drizzle-kit/api"],
		extensions: [additionalPackages({ packages: ["drizzle-kit"] })],
	},
});
