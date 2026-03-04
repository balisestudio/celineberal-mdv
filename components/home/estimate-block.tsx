import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export const EstimateBlock = async () => {
	const t = await getTranslations("home");

	return (
		<section className="bg-white py-16 lg:py-20">
			<Container>
				<div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
					<div>
						<p className="text-[12px] uppercase tracking-[0.2em] text-bordeaux font-sans">
							{t("estimateTag")}
						</p>
						<h2 className="font-serif italic text-3xl text-charcoal mt-1">
							{t("estimateTitle")}
						</h2>
						<p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
							{t("estimateDesc")}
						</p>
					</div>
					<Button
						href="/estimate"
						variant="primary"
						size="lg"
						className="shrink-0"
					>
						{t("estimateCta")}
					</Button>
				</div>
			</Container>
		</section>
	);
};
