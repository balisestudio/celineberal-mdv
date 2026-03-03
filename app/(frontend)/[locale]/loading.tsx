import Image from "next/image";
import { getGraphicsDark, getSiteSettings } from "@/lib/data/site-settings";

const Loading = async () => {
	const settings = await getSiteSettings();
	const { icon } = getGraphicsDark(settings);

	return (
		<div className="min-h-[50vh] flex items-center justify-center">
			<Image
				src={icon.src}
				alt={icon.alt}
				width={48}
				height={48}
				className="animate-pulse"
			/>
		</div>
	);
};

export default Loading;
