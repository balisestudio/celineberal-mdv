"use client";

import type { Lot } from "@/payload-types";
import { LotCard } from "./lot-card";

export const LotGrid = ({
	lots,
	auctionSlug,
	columns = "default",
}: {
	lots: Lot[];
	auctionSlug: string;
	columns?: "default" | "wide";
}) => {
	const gridClass =
		columns === "wide"
			? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10"
			: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10";

	return (
		<div className={gridClass}>
			{lots.map((lot, index) => (
				<LotCard
					key={lot.id}
					lot={lot}
					index={index}
					auctionSlug={auctionSlug}
				/>
			))}
		</div>
	);
};
