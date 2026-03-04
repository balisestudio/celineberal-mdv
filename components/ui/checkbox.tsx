import { twMerge } from "tailwind-merge";

const wrapperClasses =
	"inline-flex items-center gap-2 cursor-pointer focus-within:ring-2 focus-within:ring-bordeaux focus-within:ring-offset-1";
const inputClasses =
	"h-4 w-4 border border-sand text-bordeaux focus:ring-bordeaux accent-bordeaux";

export const Checkbox = ({
	className,
	labelClassName,
	children,
	...props
}: {
	className?: string;
	labelClassName?: string;
	children?: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>) => (
	<label className={twMerge(wrapperClasses, className)}>
		<input type="checkbox" className={inputClasses} {...props} />
		{children != null && (
			<span
				className={twMerge("text-base font-sans text-charcoal", labelClassName)}
			>
				{children}
			</span>
		)}
	</label>
);
