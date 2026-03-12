import { twMerge } from "tailwind-merge";

const baseClasses =
	"block text-sm uppercase tracking-[0.15em] text-muted font-sans";

export const Label = ({
	className,
	...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) => (
	// biome-ignore lint/a11y/noLabelWithoutControl: wrapper component, association is at call site
	<label className={twMerge(baseClasses, className)} {...props} />
);
