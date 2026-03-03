"use client";

import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

export const LocaleSwitcher = () => {
	const locale = useLocale();
	const pathname = usePathname();

	const targetLocale = locale === "fr" ? "en" : "fr";
	const label = targetLocale.toUpperCase();

	return (
		<Link
			href={pathname || "/"}
			locale={targetLocale}
			className="font-sans text-xs uppercase tracking-widest text-muted hover:text-bordeaux transition-colors cursor-pointer"
		>
			{label}
		</Link>
	);
};
