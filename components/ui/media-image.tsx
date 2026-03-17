"use client";

import Image from "next/image";
import { useState } from "react";
import { Mark } from "@/components/logos";
import { getMediaSrc } from "@/lib/media-src";
import type { Media } from "@/payload-types";

type MediaSizeKey = keyof NonNullable<Media["sizes"]>;

interface MediaImageProps {
	media: Media | null | undefined;
	size?: MediaSizeKey;
	className?: string;
	imageClassName?: string;
	iconSize?: number;
	iconVariant?: "dark" | "light";
	fallbackClassName?: string;
	sizes?: string;
	priority?: boolean;
	alt?: string;
}

export const MediaImage = ({
	media,
	size,
	className = "",
	imageClassName = "",
	iconSize = 48,
	iconVariant = "dark",
	fallbackClassName = "bg-sand/30",
	sizes,
	priority = false,
	alt,
}: MediaImageProps) => {
	const src = getMediaSrc(media, size);
	const hasSrc = Boolean(src);
	const [loaded, setLoaded] = useState(false);

	return (
		<div
			className={`relative overflow-hidden ${className}`.trim()}
			style={
				hasSrc && !loaded && media?.dominantColor
					? { backgroundColor: media.dominantColor }
					: undefined
			}
		>
			{hasSrc ? (
				<Image
					src={src}
					alt={alt ?? media?.alt ?? ""}
					fill
					className={imageClassName}
					sizes={sizes}
					priority={priority}
					onLoad={() => setLoaded(true)}
				/>
			) : (
				<div
					className={`absolute inset-0 flex items-center justify-center ${fallbackClassName}`}
				>
					<Mark variant={iconVariant} size={iconSize} />
				</div>
			)}
		</div>
	);
};
