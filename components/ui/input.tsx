import { twMerge } from "tailwind-merge";

const baseClasses =
	"w-full border border-sand bg-white px-3 py-2.5 text-charcoal font-sans text-base outline-none transition-colors focus:border-bordeaux";

export const Input = ({
	className,
	...props
}: React.InputHTMLAttributes<HTMLInputElement>) => (
	<input className={twMerge(baseClasses, className)} {...props} />
);
