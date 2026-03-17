import { format } from "date-fns";
import { enUS, fr } from "date-fns/locale";
import { useLocale } from "next-intl";
import { MediaImage } from "@/components/ui/media-image";
import { Link } from "@/i18n/navigation";
import type { Auction, Media } from "@/payload-types";

export const GuideAuctionBlock = ({ auction }: { auction: Auction }) => {
	const locale = useLocale();
	const poster = auction.poster as Media;
	const dateLocale = locale === "fr" ? fr : enUS;
	const formattedDate = format(new Date(auction.auctionDate), "PPP", {
		locale: dateLocale,
	});

	return (
		<div className="my-12 border border-sand bg-blanc-casse/50 overflow-hidden">
			<Link
				href={`/auctions/${auction.slug}`}
				className="flex flex-col md:flex-row md:items-center gap-0"
			>
				<div className="relative w-full md:w-2/5 shrink-0 aspect-16/10 md:aspect-auto md:h-36 bg-sand/20">
					<MediaImage
						media={poster}
						size="md"
						className="h-full w-full"
						imageClassName="object-cover"
						alt={poster?.alt ?? auction.title}
						sizes="(min-width: 768px) 40vw, 100vw"
					/>
				</div>
				<div className="flex flex-1 flex-col gap-1 p-4 md:py-4 md:px-6">
					<span className="font-serif italic text-xl md:text-2xl text-charcoal block md:inline md:mr-4">
						{auction.title}
					</span>
					<p className="text-sm uppercase tracking-widest text-muted mt-1 md:inline md:mt-0">
						{formattedDate}
					</p>
					<p className="text-sm uppercase tracking-widest text-muted mt-1 md:inline md:mt-0">
						{auction.location}
					</p>
				</div>
			</Link>
		</div>
	);
};
