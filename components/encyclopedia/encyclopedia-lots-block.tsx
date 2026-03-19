import { useTranslations } from "next-intl";
import { MediaImage } from "@/components/ui/media-image";
import { Link } from "@/i18n/navigation";
import type { Auction, Lot, Media } from "@/payload-types";

export const EncyclopediaLotsBlock = ({
	lot,
	compact = false,
	fillImage = false,
}: {
	lot: Lot;
	compact?: boolean;
	fillImage?: boolean;
}) => {
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
			<div
				className={`relative shrink-0 bg-sand/20 p-4 ${
					compact
						? "w-full aspect-square"
						: "w-full lg:w-80 aspect-4/3 lg:aspect-square"
				}`}
			>
				<div className="relative h-full w-full overflow-hidden">
					<MediaImage
						media={image}
						size="md"
						className="h-full w-full"
						imageClassName={`transition-transform duration-500 group-hover:scale-[1.07] ${
							fillImage ? "object-cover" : "object-contain"
						}`}
						alt={image?.alt ?? lot.title}
						sizes={
							compact
								? "(min-width: 1024px) 25vw, 50vw"
								: "(min-width: 1024px) 320px, 100vw"
						}
					/>
				</div>
			</div>
			<div
				className={`flex flex-1 flex-col justify-center ${
					compact ? "p-4" : "p-6 lg:p-8"
				}`}
			>
				<p className="text-sm uppercase tracking-widest text-muted">
					{t("lot.number", { n: lot.lotNumber })}
				</p>
				<h3
					className={`font-serif italic text-charcoal mb-3 ${
						compact ? "text-lg" : "text-2xl lg:text-3xl"
					}`}
				>
					{lot.title}
				</h3>
				<div className="flex flex-wrap gap-x-6 gap-y-1 mb-4">
					{estimateText && (
						<p
							className={`font-serif italic text-charcoal ${
								compact ? "text-sm" : "text-lg"
							}`}
						>
							{estimateText}
						</p>
					)}
					{salePriceText && (
						<p
							className={`font-serif italic text-bordeaux ${
								compact ? "text-sm" : "text-lg"
							}`}
						>
							{salePriceText}
						</p>
					)}
					{lot.sold && (
						<span className="text-sm uppercase tracking-widest text-muted">
							{t("lot.sold")}
						</span>
					)}
				</div>
				{!compact && lot.description && (
					<p className="text-base text-charcoal leading-relaxed whitespace-pre-line">
						{lot.description}
					</p>
				)}
				{compact && lot.description && (
					<p className="text-sm text-charcoal leading-relaxed line-clamp-2">
						{lot.description}
					</p>
				)}
			</div>
		</>
	);

	const wrapperClass = compact
		? "border border-sand bg-blanc-casse/50 overflow-hidden h-full flex flex-col"
		: "my-12 border border-sand bg-blanc-casse/50 overflow-hidden";

	return (
		<div className={wrapperClass}>
			{auctionSlug ? (
				<Link
					href={`/auctions/${auctionSlug}/lots/${lot.lotNumber}`}
					className={`group flex ${
						compact ? "flex-col h-full" : "flex-col lg:flex-row"
					}`}
				>
					{content}
				</Link>
			) : (
				<div
					className={
						compact ? "flex flex-col h-full" : "flex flex-col lg:flex-row"
					}
				>
					{content}
				</div>
			)}
		</div>
	);
};
