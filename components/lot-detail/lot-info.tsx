import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import type { Lot } from "@/payload-types";

const LotInfo = async ({ lot }: { lot: Lot }) => {
	const t = await getTranslations("lotDetail");
	const tAuction = await getTranslations("auction");

	const hasEstimate = lot.lowEstimate || lot.highEstimate;
	const estimateText = hasEstimate
		? [lot.lowEstimate, lot.highEstimate]
				.filter(Boolean)
				.map((n) => (n as number).toLocaleString("fr-FR"))
				.join(" – ")
				.concat(" €")
		: null;

	const salePriceText = lot.salePrice
		? `${lot.salePrice.toLocaleString("fr-FR")} €`
		: null;

	return (
		<div className="space-y-8">
			<div>
				<p className="text-[10px] uppercase tracking-widest text-muted mb-2">
					{tAuction("lot.number", { n: lot.lotNumber })}
				</p>
				<h1 className="font-serif italic text-3xl lg:text-4xl text-charcoal leading-snug">
					{lot.title}
				</h1>
			</div>

			{(hasEstimate || (lot.sold && salePriceText)) && (
				<div className="border-y border-sand py-5 space-y-3">
					{estimateText && (
						<div>
							<p className="text-[10px] uppercase tracking-widest text-muted mb-1">
								{t("estimate")}
							</p>
							<p className="font-serif italic text-2xl text-charcoal">
								{estimateText}
							</p>
						</div>
					)}
					{lot.sold && salePriceText && (
						<div>
							<p className="text-[10px] uppercase tracking-widest text-muted mb-1">
								{t("salePrice")}
							</p>
							<p className="font-serif italic text-2xl text-bordeaux">
								{salePriceText}
							</p>
						</div>
					)}
				</div>
			)}

			{lot.description && (
				<div>
					<p className="text-[10px] uppercase tracking-widest text-muted mb-3">
						{t("description")}
					</p>
					<p className="text-sm text-charcoal leading-relaxed whitespace-pre-line">
						{lot.description}
					</p>
				</div>
			)}

			{lot.characteristics && lot.characteristics.length > 0 && (
				<div>
					<p className="text-[10px] uppercase tracking-widest text-muted mb-3">
						{t("characteristics")}
					</p>
					<div className="flex flex-col gap-2">
						{lot.characteristics.map((char) => (
							<div key={char.id ?? char.key} className="flex items-start gap-4">
								<span className="text-xs text-muted w-32 shrink-0">
									{char.key}
								</span>
								<span className="text-xs text-charcoal">{char.value}</span>
							</div>
						))}
					</div>
				</div>
			)}

			<div className="flex justify-center pt-2">
				<Button
					href="/estimation"
					variant="outline"
					size="md"
					className="w-full justify-center"
				>
					{t("cta")}
				</Button>
			</div>
		</div>
	);
};

export { LotInfo };
