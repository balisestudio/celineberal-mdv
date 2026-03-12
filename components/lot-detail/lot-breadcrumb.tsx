import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { Link } from "@/i18n/navigation";
import type { Auction } from "@/payload-types";

const LotBreadcrumb = async ({
	auction,
	lotNumber,
}: {
	auction: Auction;
	lotNumber: string;
}) => {
	const t = await getTranslations("lotDetail");
	const tNav = await getTranslations("navbar");
	const isPast = new Date(auction.auctionDate) < new Date();
	const rootHref = isPast ? "/results" : "/auctions";
	const rootLabel = isPast ? tNav("links.results") : tNav("links.auctions");

	return (
		<div className="bg-blanc-casse border-b border-sand py-3">
			<Container>
				<div className="flex items-center gap-1.5 text-sm uppercase tracking-widest text-muted min-w-0">
					<Link
						href={rootHref}
						className="hover:text-bordeaux transition-colors shrink-0"
					>
						{rootLabel}
					</Link>
					<span className="shrink-0">›</span>
					<Link
						href={`/${isPast ? "results" : "auctions"}/${auction.slug}`}
						className="hover:text-bordeaux transition-colors truncate max-w-[200px] sm:max-w-none"
					>
						{auction.title}
					</Link>
					<span className="shrink-0">›</span>
					<span className="text-charcoal shrink-0">
						{t("prevLot", { n: lotNumber })}
					</span>
				</div>
			</Container>
		</div>
	);
};

export { LotBreadcrumb };
