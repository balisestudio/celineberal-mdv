"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Lot } from "@/payload-types";

const LotNav = ({
	auctionSlug,
	prevLot,
	nextLot,
}: {
	auctionSlug: string;
	prevLot: Lot | null;
	nextLot: Lot | null;
}) => {
	const t = useTranslations("lotDetail");

	const linkBase =
		"group flex items-center gap-1.5 text-[12px] uppercase tracking-widest text-muted hover:text-bordeaux transition-colors";

	return (
		<div className="border-t border-sand mt-16 pt-8 flex items-center justify-between">
			<div className="w-1/3">
				{prevLot ? (
					<Link
						href={`/auctions/${auctionSlug}/lots/${prevLot.lotNumber}`}
						className={linkBase}
					>
						<ArrowLeftIcon
							size={12}
							className="group-hover:-translate-x-px transition-transform"
						/>
						{t("prevLot", { n: prevLot.lotNumber })}
					</Link>
				) : (
					<span />
				)}
			</div>

			<div className="w-1/3 flex justify-center">
				<Link href={`/auctions/${auctionSlug}`} className={linkBase}>
					{t("allLots")}
				</Link>
			</div>

			<div className="w-1/3 flex justify-end">
				{nextLot ? (
					<Link
						href={`/auctions/${auctionSlug}/lots/${nextLot.lotNumber}`}
						className={linkBase}
					>
						{t("nextLot", { n: nextLot.lotNumber })}
						<ArrowRightIcon
							size={12}
							className="group-hover:translate-x-px transition-transform"
						/>
					</Link>
				) : (
					<span />
				)}
			</div>
		</div>
	);
};

export { LotNav };
