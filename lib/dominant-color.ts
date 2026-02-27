import sharp from "sharp";

const BUCKET_SIZE = 32;
const SAMPLE_SIZE = 50;

export const getDominantColor = async (buffer: Buffer): Promise<string> => {
	try {
		const { data, info } = await sharp(buffer)
			.resize(SAMPLE_SIZE, SAMPLE_SIZE, { fit: "inside" })
			.raw()
			.toBuffer({ resolveWithObject: true });

		const channels = info.channels;
		const colorCounts = new Map<string, number>();

		for (let i = 0; i < data.length; i += channels) {
			const r = Math.floor((data[i] ?? 0) / BUCKET_SIZE) * BUCKET_SIZE;
			const g =
				Math.floor((data[i + 1] ?? data[i] ?? 0) / BUCKET_SIZE) * BUCKET_SIZE;
			const b =
				Math.floor((data[i + 2] ?? data[i] ?? 0) / BUCKET_SIZE) * BUCKET_SIZE;
			const key = `${r},${g},${b}`;
			colorCounts.set(key, (colorCounts.get(key) ?? 0) + 1);
		}

		let maxCount = 0;
		let dominantKey = "208,208,208";

		for (const [key, count] of colorCounts) {
			if (count > maxCount) {
				maxCount = count;
				dominantKey = key;
			}
		}

		const [r, g, b] = dominantKey.split(",").map(Number);
		const hex = [r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("");

		return `#${hex}`;
	} catch {
		return "#D1D1D1";
	}
};
