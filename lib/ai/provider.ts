import { createGateway } from "ai";
import { env } from "@/lib/env";

const gateway = createGateway({
	apiKey: env.AI_GATEWAY_API_KEY,
});

export const model = gateway("google/gemini-2.0-flash-lite");
