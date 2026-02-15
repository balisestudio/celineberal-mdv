"use client";
import { useAuth } from "@payloadcms/ui";

export const Avatar = () => {
	const { user } = useAuth();
	return (
		// biome-ignore lint/a11y/useAltText: unnecessary
		<img
			src={`https://api.dicebear.com/9.x/glass/svg?seed=${user?.id}`}
			width={25}
			height={25}
			style={{ borderRadius: "50%" }}
		/>
	);
};
