import { twMerge } from "tailwind-merge";
import { Link } from "@/i18n/navigation";

const variantClasses = {
	primary:
		"bg-bordeaux text-blanc-casse hover:bg-bordeaux/85 transition-colors",
	outline:
		"border border-bordeaux text-bordeaux hover:bg-bordeaux hover:text-blanc-casse transition-colors",
	ghost: "text-charcoal hover:text-bordeaux transition-colors",
	secondary: "bg-sand text-bordeaux hover:bg-sand/80 transition-colors",
} as const;

const sizeClasses = {
	sm: "px-4 py-2 text-sm tracking-widest",
	md: "px-6 py-3 text-base tracking-widest",
	lg: "px-8 py-4 text-base tracking-widest",
} as const;

const baseClasses =
	"inline-flex items-center font-sans uppercase cursor-pointer select-none";

export const Button = ({
	children,
	href,
	variant = "primary",
	size = "md",
	className,
	...props
}: {
	children: React.ReactNode;
	href?: string;
	variant?: keyof typeof variantClasses;
	size?: keyof typeof sizeClasses;
	className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
	const classes = twMerge(
		baseClasses,
		variantClasses[variant],
		sizeClasses[size],
		className,
	);

	if (href) {
		return (
			<Link href={href} className={classes}>
				{children}
			</Link>
		);
	}

	return (
		<button type="button" className={classes} {...props}>
			{children}
		</button>
	);
};
