import Image from "next/image";

export const Logotype = ({
	src,
	alt,
	height = 22,
	width,
	className,
}: {
	src: string;
	alt: string;
	height?: number;
	width?: number;
	className?: string;
}) => {
	const ratio = 1005 / 222;
	const computedWidth = width ?? Math.round(height * ratio);

	return (
		<Image
			src={src}
			alt={alt}
			height={height}
			width={computedWidth}
			className={className}
			priority
		/>
	);
};
