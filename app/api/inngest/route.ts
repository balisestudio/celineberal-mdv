import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { importLotsFunction } from "@/inngest/import-lots";

export const maxDuration = 300;

export const { GET, POST, PUT } = serve({
	client: inngest,
	functions: [importLotsFunction],
});
