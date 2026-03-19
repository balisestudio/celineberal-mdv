import { format } from "date-fns";
import { enUS, fr } from "date-fns/locale";
import { useLocale } from "next-intl";
import { MediaImage } from "@/components/ui/media-image";
import { Link } from "@/i18n/navigation";
import type { Auction, Media } from "@/payload-types";

export const EncyclopediaAuctionsBlock = ({
	auction,
	compact = false,
	fillImage = false,
}: {
	auction: Auction;
	compact?: boolean;
	fillImage?: boolean;
}) => {
	const locale = useLocale();
	const poster = auction.poster as Media;
	const dateLocale = locale === "fr" ? fr : enUS;
	const formattedDate = format(new Date(auction.auctionDate), "PPP", {
		locale: dateLocale,
	});

	const wrapperClass = compact
		? "border border-sand bg-blanc-casse/50 overflow-hidden h-full flex flex-col"
		: "my-12 border border-sand bg-blanc-casse/50 overflow-hidden";

	return (
		<div className={wrapperClass}>
			<Link
				href={`/auctions/${auction.slug}`}
				className={`group flex ${
					compact
						? "flex-col h-full"
						: "flex-col md:flex-row md:items-center gap-0"
				}`}
			>
				<div
					className={`relative shrink-0 bg-sand/20 ${
						compact
							? "w-full aspect-16/10"
							: "w-full md:w-2/5 aspect-16/10 md:aspect-auto md:h-52"
					}`}
				>
					<MediaImage
						media={poster}
						size="md"
						className="h-full w-full"
						imageClassName={`transition-transform duration-500 group-hover:scale-[1.04] ${
							fillImage ? "object-cover" : "object-cover"
						}`}
						alt={poster?.alt ?? auction.title}
						sizes={
							compact
								? "(min-width: 1024px) 25vw, 50vw"
								: "(min-width: 768px) 40vw, 100vw"
						}
					/>
				</div>
				<div
					className={`flex flex-1 flex-col gap-1 ${
						compact ? "p-4" : "p-4 md:py-4 md:px-6"
					}`}
				>
					<span
						className={`font-serif italic text-charcoal block ${
							compact ? "text-base" : "text-xl md:text-2xl md:inline md:mr-4"
						}`}
					>
						{auction.title}
					</span>
					<p className="text-sm uppercase tracking-widest text-muted mt-1 md:inline md:mt-0">
						{formattedDate}
					</p>
					{auction.location && (
						<p className="text-sm uppercase tracking-widest text-muted mt-1 md:inline md:mt-0">
							{auction.location}
						</p>
					)}
				</div>
			</Link>
		</div>
	);
};
