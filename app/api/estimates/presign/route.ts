import { NextResponse } from "next/server";
import { getPresignedUploadUrls } from "@/lib/estimate-presign";
import { presignBodySchema } from "@/lib/schemas/estimate";

export const maxDuration = 30;

export const POST = async (req: Request) => {
	try {
		const body = await req.json();
		const parsed = presignBodySchema.safeParse(body);
		if (!parsed.success) {
			const first = parsed.error.flatten().fieldErrors?.files?.[0];
			const message = typeof first === "string" ? first : "minPhotos";
			return NextResponse.json({ error: message }, { status: 400 });
		}
		const urls = await getPresignedUploadUrls(parsed.data);
		return NextResponse.json({ urls });
	} catch (e) {
		console.error("Presign error:", e);
		return NextResponse.json({ error: "uploadFailed" }, { status: 500 });
	}
};
