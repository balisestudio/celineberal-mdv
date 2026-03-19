import { format } from "date-fns";
import { enUS, fr } from "date-fns/locale";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { CollaboratorCard } from "@/components/collaborator/collaborator-card";
import { EncyclopediaArticleCard } from "@/components/encyclopedia/encyclopedia-article-card";
import { EncyclopediaHero } from "@/components/encyclopedia/encyclopedia-hero";
import { EncyclopediaRichText } from "@/components/encyclopedia/encyclopedia-rich-text";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import {
	getEncyclopediaBySlug,
	getEncyclopediaByThematique,
} from "@/lib/data/encyclopedia";
import { getSiteSettings } from "@/lib/data/site-settings";
import type { Collaborator, Thematic } from "@/payload-types";

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

	const [article, siteSettings] = await Promise.all([
		getEncyclopediaBySlug(slug, locale),
		getSiteSettings(locale),
	]);
	if (!article) notFound();

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

	const stickyEstimateText =
		siteSettings.encyclopediaStickyEstimateText?.trim() ?? "";

	return (
		<>
			<EncyclopediaHero article={article} thematiqueLabel={thematiqueLabel} />

			<Container className="py-12">
				<div
					className={`grid grid-cols-1 gap-12 lg:gap-24 ${authorPopulated || stickyEstimateText ? "lg:grid-cols-[1fr_320px]" : ""}`}
				>
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
							<EncyclopediaRichText data={article.content} />
						</div>
					</div>
					{(authorPopulated || stickyEstimateText) && (
						<aside className="lg:sticky lg:top-32 self-start pt-8 lg:pt-0 flex flex-col gap-8 items-center lg:items-stretch">
							{authorPopulated ? (
								<CollaboratorCard
									collaborator={authorPopulated}
									variant="compact"
								/>
							) : null}
							{stickyEstimateText ? (
								<div className="w-full flex flex-col items-center gap-4">
									<p className="text-sm text-muted leading-relaxed whitespace-pre-line text-justify w-full">
										{stickyEstimateText}
									</p>
									<Button href="/estimate" variant="outline" size="sm">
										{t("stickyEstimateCta")}
									</Button>
								</div>
							) : null}
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
