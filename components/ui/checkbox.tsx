"use client";

import { Check } from "@phosphor-icons/react";
import { twMerge } from "tailwind-merge";

const wrapperClasses = "inline-flex items-start gap-2 cursor-pointer";

export const Checkbox = ({
	className,
	labelClassName,
	children,
	checked,
	onChange,
	...props
}: {
	className?: string;
	labelClassName?: string;
	children?: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>) => (
	<label className={twMerge(wrapperClasses, className)}>
		<input
			type="checkbox"
			className="sr-only"
			checked={checked}
			onChange={onChange}
			{...props}
		/>
		<span
			aria-hidden
			className={twMerge(
				"mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border border-sand transition-colors",
				checked ? "bg-bordeaux" : "bg-transparent",
			)}
		>
			<Check
				size={11}
				color="#fcfaf7"
				weight="bold"
				className={checked ? "opacity-100" : "opacity-0"}
			/>
		</span>
		{children != null && (
			<span
				className={twMerge("text-base font-sans text-charcoal", labelClassName)}
			>
				{children}
			</span>
		)}
	</label>
);
