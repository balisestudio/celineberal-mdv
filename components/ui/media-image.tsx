"use client";

import Image from "next/image";
import { useState } from "react";
import { getMediaSrc } from "@/lib/media-src";
import type { Media } from "@/payload-types";

type MediaSizeKey = keyof NonNullable<Media["sizes"]>;

interface MediaImageProps {
	media: Media | null | undefined;
	iconSrc?: string;
	iconAlt?: string;
	size?: MediaSizeKey;
	className?: string;
	imageClassName?: string;
	iconSize?: number;
	iconClassName?: string;
	fallbackClassName?: string;
	sizes?: string;
	priority?: boolean;
	alt?: string;
}

export const MediaImage = ({
	media,
	iconSrc,
	iconAlt = "",
	size,
	className = "",
	imageClassName = "",
	iconSize = 48,
	iconClassName = "object-contain",
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
					{iconSrc && (
						<Image
							src={iconSrc}
							alt={iconAlt}
							width={iconSize}
							height={iconSize}
							className={iconClassName}
						/>
					)}
				</div>
			)}
		</div>
	);
};
