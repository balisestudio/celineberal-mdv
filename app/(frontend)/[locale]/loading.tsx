import Image from "next/image";
import { getSiteSettings } from "@/lib/data/site-settings";
import type { Media } from "@/payload-types";

const Loading = async () => {
	const settings = await getSiteSettings();
	const icon = settings.graphics.icon as Media;

	return (
		<div className="min-h-[50vh] flex items-center justify-center">
			<Image
				src={icon.url ?? ""}
				alt={icon.alt ?? ""}
				width={48}
				height={48}
				className="animate-pulse"
			/>
		</div>
	);
};

export default Loading;
