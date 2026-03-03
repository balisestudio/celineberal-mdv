import { task } from "@trigger.dev/sdk/v3";
import type { InterenchersLots } from "@/lib/schemas/interenchers";
import type { Auction, User } from "@/payload-types";

export const importLotsTask = task({
	id: "import-lots",
	run: async (data: {
		lots: InterenchersLots;
		auction: Auction;
		options: {
			translateContent: boolean;
			optimizeContent: boolean;
		};
		user: User;
	}) => {},
});
