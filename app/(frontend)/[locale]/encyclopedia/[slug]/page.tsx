import { format } from "date-fns";
import { enUS, fr } from "date-fns/locale";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { CollaboratorCard } from "@/components/collaborator/collaborator-card";
import { EncyclopediaArticleCard } from "@/components/encyclopedia/encyclopedia-article-card";
import { EncyclopediaHero } from "@/components/encyclopedia/encyclopedia-hero";
import { EncyclopediaRichText } from "@/components/encyclopedia/encyclopedia-rich-text";
import { Container } from "@/components/ui/container";
import {
	getAuctionIdsFromEncyclopediaContent,
	getEncyclopediaBySlug,
	getEncyclopediaByThematique,
} from "@/lib/data/encyclopedia";
import { getLots } from "@/lib/data/lots";
import { getSiteSettings } from "@/lib/data/site-settings";
import type { Collaborator, Lot, Thematic } from "@/payload-types";

export const generateMetadata = async ({
	params,
}: {
	params: Promise<{ slug: string; locale: string }>;
}) => {
	const { slug, locale } = await params;
	const [article, settings] = await Promise.all([
		getEncyclopediaBySlug(slug, locale),
		getSiteSettings(locale),
	]);
	if (!article) return { title: settings.siteName };
	return { title: `${article.title} – ${settings.siteName}` };
};

const EncyclopediaArticlePage = async ({
	params,
}: {
	params: Promise<{ slug: string; locale: string }>;
}) => {
	const { slug, locale } = await params;

	const article = await getEncyclopediaBySlug(slug, locale);
	if (!article) notFound();

	const auctionIds = getAuctionIdsFromEncyclopediaContent(article.content);
	const firstLotsByAuctionId: Record<number, Lot[]> = {};
	if (auctionIds.length > 0) {
		const results = await Promise.all(
			auctionIds.map((id) =>
				getLots({ auctionId: id, limit: 4, locale, page: 1 }),
			),
		);
		auctionIds.forEach((id, i) => {
			firstLotsByAuctionId[id] = (results[i].docs ?? []) as Lot[];
		});
	}

	const thematique = article.thematique as Thematic | number | undefined;
	const thematiqueLabel =
		typeof thematique === "object" &&
		thematique !== null &&
		"intitule" in thematique
			? (thematique as Thematic).intitule
			: null;

	const author = article.author as Collaborator | number | undefined;
	const authorPopulated =
		typeof author === "object" && author !== null && "name" in author
			? (author as Collaborator)
			: null;

	const thematiqueId =
		typeof thematique === "object" && thematique !== null && "id" in thematique
			? (thematique as Thematic).id
			: typeof thematique === "number"
				? thematique
				: null;
	const relatedArticles =
		thematiqueId != null
			? await getEncyclopediaByThematique(thematiqueId, article.id, locale, 6)
			: [];

	const t = await getTranslations("encyclopedia");
	const dateLocale = locale === "fr" ? fr : enUS;
	const formattedDate = format(
		new Date(article.updatedAt ?? article.createdAt),
		"PPP",
		{ locale: dateLocale },
	);

	return (
		<>
			<EncyclopediaHero article={article} thematiqueLabel={thematiqueLabel} />

			<Container className="py-12">
				<div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 lg:gap-24">
					<div className="min-w-0">
						<div className="max-w-4xl">
							{authorPopulated && (
								<p className="text-sm text-muted mb-8">
									{t("writtenBy", {
										author: authorPopulated.name,
										date: formattedDate,
									})}
								</p>
							)}
							<EncyclopediaRichText
								data={article.content}
								firstLotsByAuctionId={firstLotsByAuctionId}
							/>
						</div>
					</div>
					{authorPopulated && (
						<aside className="lg:sticky lg:top-32 self-start pt-8 lg:pt-0">
							<CollaboratorCard
								collaborator={authorPopulated}
								variant="compact"
							/>
						</aside>
					)}
				</div>
			</Container>

			{relatedArticles.length > 0 && (
				<section className="bg-blanc-casse border-t border-sand py-20 pb-28">
					<Container>
						<p className="text-sm uppercase tracking-[0.2em] text-muted mb-8">
							{t("sameCategory")}
						</p>
						<ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
							{relatedArticles.map((related) => (
								<li key={related.id}>
									<EncyclopediaArticleCard article={related} locale={locale} />
								</li>
							))}
						</ul>
					</Container>
				</section>
			)}
		</>
	);
};

export default EncyclopediaArticlePage;
