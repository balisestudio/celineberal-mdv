import { twMerge } from "tailwind-merge";

const wrapperClasses = "inline-flex items-start gap-2 cursor-pointer";
const inputClasses =
	"mt-0.5 h-5 w-5 shrink-0 rounded border border-sand text-bordeaux accent-bordeaux outline-none focus-visible:ring-2 focus-visible:ring-bordeaux focus-visible:ring-offset-1";

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
