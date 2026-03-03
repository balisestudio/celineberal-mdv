import { AuctionItem } from "@/components/auctions/auction-item";
import type { Auction } from "@/payload-types";

export const AuctionList = ({
	auctions,
	iconSrc,
	iconAlt,
}: {
	auctions: Auction[];
	iconSrc: string;
	iconAlt: string;
}) => {
	return (
		<div className="border-y border-sand divide-y divide-sand">
			{auctions.map((auction, i) => (
				<AuctionItem
					key={auction.id}
					auction={auction}
					index={i}
					iconSrc={iconSrc}
					iconAlt={iconAlt}
				/>
			))}
		</div>
	);
};
