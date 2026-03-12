"use client";

import { useRef, useState } from "react";
import { MediaImage } from "@/components/ui/media-image";
import type { Media } from "@/payload-types";

const LotGallery = ({
	images,
	iconSrc,
	iconAlt,
	lotTitle,
}: {
	images: (number | Media)[] | null | undefined;
	iconSrc: string;
	iconAlt: string;
	lotTitle: string;
}) => {
	const populatedImages = (images ?? []).filter(
		(img): img is Media => typeof img === "object" && img !== null && !!img.url,
	);

	const [selectedIndex, setSelectedIndex] = useState(0);
	const [isZoomed, setIsZoomed] = useState(false);
	const [transformOrigin, setTransformOrigin] = useState("50% 50%");
	const imageWrapperRef = useRef<HTMLDivElement>(null);

	const selectedImage = populatedImages[selectedIndex] ?? null;

	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		const rect = imageWrapperRef.current?.getBoundingClientRect();
		if (!rect) return;
		const x = ((e.clientX - rect.left) / rect.width) * 100;
		const y = ((e.clientY - rect.top) / rect.height) * 100;
		setTransformOrigin(`${x}% ${y}%`);
	};

	const handleMouseEnter = () => setIsZoomed(true);
	const handleMouseLeave = () => {
		setIsZoomed(false);
		setTransformOrigin("50% 50%");
	};

	return (
		<div className="flex flex-col gap-4">
			<div
				ref={imageWrapperRef}
				role="img"
				className="aspect-square bg-blanc-casse border border-sand overflow-hidden select-none cursor-zoom-in"
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
				onMouseMove={handleMouseMove}
			>
				<div
					className="w-full h-full"
					style={{
						transform: selectedImage && isZoomed ? "scale(2.5)" : "scale(1)",
						transformOrigin,
						transition:
							selectedImage && isZoomed
								? "transform 250ms ease-out"
								: "transform 0ms",
					}}
				>
					<MediaImage
						media={selectedImage}
						iconSrc={iconSrc}
						iconAlt={iconAlt}
						size="lg"
						className="h-full w-full"
						imageClassName="object-contain p-6"
						iconSize={64}
						alt={selectedImage?.alt ?? lotTitle}
						sizes="(min-width: 1024px) 50vw, 100vw"
					/>
				</div>
			</div>

			{populatedImages.length > 1 && (
				<div className="flex gap-2 overflow-x-auto pb-1">
					{populatedImages.map((img, i) => (
						<button
							key={img.id}
							type="button"
							onClick={() => setSelectedIndex(i)}
							className={`shrink-0 w-16 h-16 border overflow-hidden bg-blanc-casse transition-colors ${
								i === selectedIndex
									? "border-2 border-bordeaux"
									: "border border-sand hover:border-bordeaux/50"
							}`}
						>
							<MediaImage
								media={img}
								iconSrc={iconSrc}
								iconAlt={iconAlt}
								size="thumbnail"
								className="w-full h-full"
								imageClassName="object-contain p-1.5"
								iconSize={40}
								alt={img.alt ?? lotTitle}
								sizes="64px"
							/>
						</button>
					))}
				</div>
			)}
		</div>
	);
};

export { LotGallery };
