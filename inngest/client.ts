import { Inngest } from "inngest";
import { env } from "@/lib/env";

export const inngest = new Inngest({
	id: "celineberal-mdv",
	eventKey: env.INNGEST_EVENT_KEY,
	signingKey: env.INNGEST_SIGNING_KEY,
	isDev: process.env.NODE_ENV === "development",
});

export const getRunStatus = async (
	eventId: string,
): Promise<{ isRunning: boolean }> => {
	const res = await fetch(`https://api.inngest.com/v1/events/${eventId}/runs`, {
		headers: {
			Authorization: `Bearer ${env.INNGEST_SIGNING_KEY}`,
		},
	});
	if (!res.ok) return { isRunning: false };
	const json = (await res.json()) as { data?: { status: string }[] };
	const data = json.data ?? [];
	return {
		isRunning: data.some((run: { status: string }) => run.status === "Running"),
	};
};
