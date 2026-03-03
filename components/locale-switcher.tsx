"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

export const LocaleSwitcher = () => {
	const locale = useLocale() as Locale;
	const router = useRouter();
	const pathname = usePathname();

	const targetLocale: Locale = locale === "fr" ? "en" : "fr";

	const handleSwitch = () => {
		router.replace(pathname, { locale: targetLocale });
	};

	return (
		<button
			type="button"
			onClick={handleSwitch}
			className="font-sans cursor-pointer text-xs uppercase tracking-widest text-muted transition-colors hover:text-bordeaux"
		>
			{targetLocale.toUpperCase()}
		</button>
	);
};
