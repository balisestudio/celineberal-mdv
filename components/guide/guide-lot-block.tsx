import { useTranslations } from "next-intl";
import { MediaImage } from "@/components/ui/media-image";
import { Link } from "@/i18n/navigation";
import type { Auction, Lot, Media } from "@/payload-types";

export const GuideLotBlock = ({ lot }: { lot: Lot }) => {
	const t = useTranslations("auction");
	const firstImage = lot.images?.[0];
	const image =
		typeof firstImage === "object" && firstImage !== null
			? (firstImage as Media)
			: null;
	const auction = lot.auction as Auction | number;
	const auctionSlug =
		typeof auction === "object" && auction !== null ? auction.slug : null;

	const hasEstimate = lot.lowEstimate || lot.highEstimate;
	const estimateText = hasEstimate
		? [lot.lowEstimate, lot.highEstimate]
				.filter(Boolean)
				.map((n) => (n as number).toLocaleString("fr-FR"))
				.join(" – ")
				.concat(" €")
		: null;
	const salePriceText =
		lot.sold && lot.salePrice
			? `${lot.salePrice.toLocaleString("fr-FR")} €`
			: null;

	const content = (
		<>
			<div className="relative w-full lg:w-80 shrink-0 aspect-4/3 lg:aspect-square bg-sand/20">
				<MediaImage
					media={image}
					size="md"
					className="h-full w-full"
					imageClassName="object-contain p-4"
					alt={image?.alt ?? lot.title}
					sizes="(min-width: 1024px) 320px, 100vw"
				/>
			</div>
			<div className="flex flex-1 flex-col justify-center p-6 lg:p-8">
				<p className="text-sm uppercase tracking-widest text-muted mb-1">
					{t("lot.number", { n: lot.lotNumber })}
				</p>
				<h3 className="font-serif italic text-2xl lg:text-3xl text-charcoal mb-3">
					{lot.title}
				</h3>
				<div className="flex flex-wrap gap-x-6 gap-y-1 mb-4">
					{estimateText && (
						<p className="font-serif italic text-lg text-charcoal">
							{estimateText}
						</p>
					)}
					{salePriceText && (
						<p className="font-serif italic text-lg text-bordeaux">
							{salePriceText}
						</p>
					)}
					{lot.sold && (
						<span className="text-sm uppercase tracking-widest text-muted">
							{t("lot.sold")}
						</span>
					)}
				</div>
				{lot.description && (
					<p className="text-base text-charcoal leading-relaxed whitespace-pre-line">
						{lot.description}
					</p>
				)}
			</div>
		</>
	);

	return (
		<div className="my-12 border border-sand bg-blanc-casse/50 overflow-hidden">
			{auctionSlug ? (
				<Link
					href={`/auctions/${auctionSlug}/lots/${lot.lotNumber}`}
					className="flex flex-col lg:flex-row hover:opacity-95 transition-opacity"
				>
					{content}
				</Link>
			) : (
				<div className="flex flex-col lg:flex-row">{content}</div>
			)}
		</div>
	);
};
