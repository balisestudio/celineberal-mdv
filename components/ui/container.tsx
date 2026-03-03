import type { ElementType } from "react";
import { twMerge } from "tailwind-merge";

export const Container = ({
	children,
	className,
	as,
	narrow = false,
}: {
	children: React.ReactNode;
	className?: string;
	as?: ElementType;
	narrow?: boolean;
}) => {
	const Tag = as ?? "div";
	return (
		<Tag
			className={twMerge(
				"mx-auto w-full px-4 sm:px-6 lg:px-8",
				narrow ? "max-w-4xl" : "max-w-7xl",
				className,
			)}
		>
			{children}
		</Tag>
	);
};
