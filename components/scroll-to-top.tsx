"use client";

import { useEffect } from "react";
import { usePathname } from "@/i18n/navigation";

export const ScrollToTop = () => {
	const pathname = usePathname();
	// biome-ignore lint/correctness/useExhaustiveDependencies: pathname triggers scroll on navigation
	useEffect(() => {
		window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
	}, [pathname]);
	return null;
};
