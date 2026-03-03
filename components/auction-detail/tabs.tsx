"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

export const AuctionTabs = ({
	slug,
	totalLots,
}: {
	slug: string;
	totalLots: number;
}) => {
	const t = useTranslations("auction");
	const pathname = usePathname();

	const lotsPath = `/auctions/${slug}`;
	const aboutPath = `/auctions/${slug}/about`;

	const isLotsActive = pathname === lotsPath;
	const isAboutActive = pathname === aboutPath;

	const tabBase =
		"flex items-center gap-2 px-6 py-4 text-xs uppercase tracking-widest border-b-2 transition-colors";
	const activeTab = "border-bordeaux text-bordeaux";
	const inactiveTab = "border-transparent text-muted hover:text-charcoal";

	return (
		<div className="sticky top-16 z-20 bg-blanc-casse/95 backdrop-blur-sm border-b border-sand">
			<div className="flex">
				{totalLots > 0 ? (
					<Link
						href={lotsPath}
						className={`${tabBase} ${isLotsActive ? activeTab : inactiveTab}`}
					>
						{t("tabs.lots")}
						<span className="text-[10px] text-muted">{totalLots}</span>
					</Link>
				) : (
					<span
						className={`${tabBase} border-transparent text-muted/40 cursor-not-allowed`}
					>
						{t("tabs.lots")}
					</span>
				)}

				<Link
					href={aboutPath}
					className={`${tabBase} ${isAboutActive ? activeTab : inactiveTab}`}
				>
					{t("tabs.info")}
				</Link>
			</div>
		</div>
	);
};
