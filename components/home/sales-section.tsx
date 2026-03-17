import { getTranslations } from "next-intl/server";
import { SaleCard } from "@/components/home/sale-card";
import { SectionHeader } from "@/components/home/section-header";
import { Container } from "@/components/ui/container";
import type { Auction } from "@/payload-types";

export const SalesSection = async ({ auctions }: { auctions: Auction[] }) => {
	const t = await getTranslations("home");

	return (
		<section className="py-16 lg:py-20">
			<Container>
				<SectionHeader
					title={t("salesTitle")}
					linkHref="/auctions"
					linkLabel={t("seeAllSales")}
				/>
				<div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{auctions.map((auction, index) => (
						<SaleCard key={auction.id} auction={auction} index={index} />
					))}
				</div>
			</Container>
		</section>
	);
};
