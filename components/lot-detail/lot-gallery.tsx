"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { getMediaSrc } from "@/lib/media-src";
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
				{getMediaSrc(selectedImage) ? (
					<div
						className="w-full h-full"
						style={{
							transform: isZoomed ? "scale(2.5)" : "scale(1)",
							transformOrigin,
							transition: isZoomed
								? "transform 250ms ease-out"
								: "transform 0ms",
						}}
					>
						<Image
							src={getMediaSrc(selectedImage, "lg")}
							alt={selectedImage?.alt ?? lotTitle}
							fill
							className="object-contain p-6"
							sizes="(min-width: 1024px) 50vw, 100vw"
							draggable={false}
						/>
					</div>
				) : (
					<div className="w-full h-full bg-sand/20 flex items-center justify-center">
						{iconSrc && (
							<Image src={iconSrc} alt={iconAlt} width={64} height={64} />
						)}
					</div>
				)}
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
							<div className="relative w-full h-full">
								<Image
									src={getMediaSrc(img, "thumbnail")}
									alt={img.alt ?? lotTitle}
									fill
									className="object-contain p-1.5"
									sizes="64px"
								/>
							</div>
						</button>
					))}
				</div>
			)}
		</div>
	);
};

export { LotGallery };
