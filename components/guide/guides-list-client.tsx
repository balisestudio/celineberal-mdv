"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { GuideRelatedArticleCard } from "@/components/guide/guide-related-article-card";
import { Mark } from "@/components/logos";
import { PageHeader } from "@/components/page-header";
import { Container } from "@/components/ui/container";
import { usePathname, useRouter } from "@/i18n/navigation";
import { fetchGuidesListAction } from "@/lib/actions/guides";
import type { Guide, Thematic } from "@/payload-types";

export function GuidesListClient({
	locale,
	tagline,
	pageTitle,
	thematics,
}: {
	locale: string;
	tagline: string;
	pageTitle: string;
	thematics: Thematic[];
}) {
	const t = useTranslations("guidesList");
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const router = useRouter();

	const thematiqueParam = searchParams.get("thematique") ?? "";
	const sortParam = searchParams.get("sort") ?? "date-desc";
	const sort =
		sortParam === "date-asc" || sortParam === "date-desc"
			? sortParam
			: "date-desc";

	const [guides, setGuides] = useState<Guide[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const thematiqueId =
		thematiqueParam !== "" && /^\d+$/.test(thematiqueParam)
			? Number(thematiqueParam)
			: undefined;

	useEffect(() => {
		let cancelled = false;
		setLoading(true);
		setError(null);
		fetchGuidesListAction({
			thematiqueId,
			sort,
		})
			.then(({ docs }) => {
				if (!cancelled) {
					setGuides(docs);
				}
			})
			.catch(() => {
				if (!cancelled) {
					setError(t("empty"));
				}
			})
			.finally(() => {
				if (!cancelled) {
					setLoading(false);
				}
			});
		return () => {
			cancelled = true;
		};
	}, [thematiqueId, sort, t]);

	const updateUrl = useCallback(
		(updates: { thematique?: string; sort?: string }) => {
			const next = new URLSearchParams(searchParams.toString());
			if (updates.thematique !== undefined) {
				if (updates.thematique === "") next.delete("thematique");
				else next.set("thematique", updates.thematique);
			}
			if (updates.sort !== undefined) next.set("sort", updates.sort);
			const query = next.toString();
			router.push(query ? `${pathname}?${query}` : pathname);
		},
		[searchParams, pathname, router],
	);

	return (
		<>
			<PageHeader tagline={tagline} title={pageTitle} />

			<section className="py-12">
				<Container>
					<div className="flex flex-wrap items-end gap-4 border-b border-sand pb-8 mb-10">
						<div className="flex flex-col gap-1.5">
							<label
								htmlFor="guides-thematique"
								className="text-sm uppercase tracking-widest text-muted"
							>
								{t("filterThematic")}
							</label>
							<select
								id="guides-thematique"
								value={thematiqueParam}
								onChange={(e) => updateUrl({ thematique: e.target.value })}
								className="min-w-[200px] border border-sand bg-white px-3 py-2 font-sans text-sm text-charcoal focus:border-bordeaux focus:outline-none focus:ring-1 focus:ring-bordeaux"
							>
								<option value="">{t("filterThematicAll")}</option>
								{thematics.map((th) => (
									<option key={th.id} value={th.id}>
										{th.intitule}
									</option>
								))}
							</select>
						</div>

						<div className="flex flex-col gap-1.5">
							<label
								htmlFor="guides-sort"
								className="text-sm uppercase tracking-widest text-muted"
							>
								{t("sortLabel")}
							</label>
							<select
								id="guides-sort"
								value={sort}
								onChange={(e) =>
									updateUrl({
										sort: e.target.value as "date-asc" | "date-desc",
									})
								}
								className="min-w-[180px] border border-sand bg-white px-3 py-2 font-sans text-sm text-charcoal focus:border-bordeaux focus:outline-none focus:ring-1 focus:ring-bordeaux"
							>
								<option value="date-desc">{t("sortDateDesc")}</option>
								<option value="date-asc">{t("sortDateAsc")}</option>
							</select>
						</div>
					</div>

					{loading ? (
						<div className="min-h-[50vh] flex items-center justify-center py-12">
							<Mark variant="dark" size={48} className="animate-pulse" />
						</div>
					) : error ? (
						<p className="font-sans text-muted py-12">{error}</p>
					) : guides.length > 0 ? (
						<ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
							{guides.map((guide) => (
								<li key={guide.id}>
									<GuideRelatedArticleCard guide={guide} locale={locale} />
								</li>
							))}
						</ul>
					) : (
						<p className="font-sans text-muted py-12">{t("empty")}</p>
					)}
				</Container>
			</section>
		</>
	);
}
