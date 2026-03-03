import type { Media } from "@/payload-types";

export type MediaSizeKey = keyof NonNullable<Media["sizes"]>;

export const getMediaSrc = (
	media: Media | null | undefined,
	size?: MediaSizeKey,
): string => (size && media?.sizes?.[size]?.url) ?? media?.url ?? "";
