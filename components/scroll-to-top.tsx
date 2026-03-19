"use client";

import { useEffect } from "react";
import { usePathname } from "@/i18n/navigation";

export const ScrollToTop = () => {
	const pathname = usePathname();
	// biome-ignore lint/correctness/useExhaustiveDependencies: pathname triggers scroll on navigation
	useEffect(() => {
		window.scrollTo(0, 0);
	}, [pathname]);
	return null;
};
