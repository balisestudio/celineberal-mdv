"use client";

import type { Lot } from "@/payload-types";
import { LotCard } from "./lot-card";

export const LotGrid = ({
	lots,
	iconSrc,
	iconAlt,
}: {
	lots: Lot[];
	iconSrc: string;
	iconAlt: string;
}) => {
	return (
		<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
			{lots.map((lot, index) => (
				<LotCard
					key={lot.id}
					lot={lot}
					index={index}
					iconSrc={iconSrc}
					iconAlt={iconAlt}
				/>
			))}
		</div>
	);
};
