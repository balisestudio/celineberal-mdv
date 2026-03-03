import { getTranslations } from "next-intl/server";
import { SectionHeader } from "@/components/home/section-header";
import { TopLotCard } from "@/components/home/top-lot-card";
import { Container } from "@/components/ui/container";
import type { Lot } from "@/payload-types";

export const TopLotsSection = async ({
	lots,
	iconSrc,
	iconAlt,
}: {
	lots: Lot[];
	iconSrc: string;
	iconAlt: string;
}) => {
	const t = await getTranslations("home");

	return (
		<section className="bg-blanc-casse py-16 lg:py-20">
			<Container>
				<SectionHeader title={t("topLotsTitle")} />
				<div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
					{lots.map((lot, index) => (
						<TopLotCard
							key={lot.id}
							lot={lot}
							index={index}
							iconSrc={iconSrc}
							iconAlt={iconAlt}
						/>
					))}
				</div>
			</Container>
		</section>
	);
};
