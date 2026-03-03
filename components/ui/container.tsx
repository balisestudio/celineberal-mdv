import type { ElementType } from "react";
import { twMerge } from "tailwind-merge";

const sizeClasses = {
	default: "max-w-7xl",
	narrow: "max-w-4xl",
	hero: "max-w-2xl",
} as const;

export const Container = ({
	children,
	className,
	as,
	narrow = false,
	size,
}: {
	children: React.ReactNode;
	className?: string;
	as?: ElementType;
	narrow?: boolean;
	size?: keyof typeof sizeClasses;
}) => {
	const Tag = as ?? "div";
	const maxWidth =
		size !== undefined
			? sizeClasses[size]
			: narrow
				? sizeClasses.narrow
				: sizeClasses.default;
	return (
		<Tag
			className={twMerge(
				"mx-auto w-full px-4 sm:px-6 lg:px-8",
				maxWidth,
				className,
			)}
		>
			{children}
		</Tag>
	);
};
