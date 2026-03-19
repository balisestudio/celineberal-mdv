import { convertLexicalToPlaintext } from "@payloadcms/richtext-lexical/plaintext";
import { format } from "date-fns";
import { enUS, fr } from "date-fns/locale";
import { MediaImage } from "@/components/ui/media-image";
import { Link } from "@/i18n/navigation";
import type { Encyclopedia, Media } from "@/payload-types";

const EXCERPT_LENGTH = 180;

export const EncyclopediaArticleCard = ({
	article,
	locale,
}: {
	article: Encyclopedia;
	locale: string;
}) => {
	const dateLocale = locale === "fr" ? fr : enUS;
	const formattedDate = format(
		new Date(article.updatedAt ?? article.createdAt),
		"PPP",
		{
			locale: dateLocale,
		},
	);

	const poster = article.poster as Media | null;

	const plaintext = convertLexicalToPlaintext({ data: article.content }) ?? "";
	const excerpt = (() => {
		const cleaned = plaintext.replace(/\s+/g, " ").trim();
		if (!cleaned) return "";
		if (cleaned.length <= EXCERPT_LENGTH) return cleaned;
		return `${cleaned.slice(0, EXCERPT_LENGTH).trimEnd()}…`;
	})();

	return (
		<Link
			href={`/encyclopedia/${article.slug}`}
			className="group flex h-full flex-col border border-sand bg-white transition-colors hover:border-bordeaux/30"
		>
			<MediaImage
				media={poster}
				size="md"
				className="h-52"
				imageClassName="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
				alt={poster?.alt ?? article.title}
				sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, 100vw"
			/>

			<div className="flex flex-1 flex-col border-t border-sand p-5 min-w-0">
				<p className="text-sm uppercase tracking-widest text-muted mb-2">
					{formattedDate}
				</p>

				<p className="font-serif italic text-lg text-charcoal line-clamp-2 group-hover:text-bordeaux transition-colors">
					{article.title}
				</p>

				<p className="mt-3 text-base text-muted leading-relaxed line-clamp-3">
					{excerpt}
				</p>
			</div>
		</Link>
	);
};
