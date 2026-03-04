import { twMerge } from "tailwind-merge";

const baseClasses =
	"block text-sm uppercase tracking-[0.15em] text-muted font-sans";

export const Label = ({
	className,
	...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) => (
	// htmlFor is passed by parent when used with an input
	// biome-ignore lint/a11y/noLabelWithoutControl: wrapper component, association is at call site
	<label className={twMerge(baseClasses, className)} {...props} />
);
