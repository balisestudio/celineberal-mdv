"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import { fetchLotsAction } from "@/lib/actions/lots";
import type { Lot } from "@/payload-types";
import { LotGrid } from "./lot-grid";

const SORT_OPTIONS = [
	"lotNumber",
	"alpha",
	"estimateAsc",
	"estimateDesc",
] as const;

type PageItem =
	| { type: "page"; value: number }
	| { type: "ellipsis"; key: string };

const buildPaginationPages = (current: number, total: number): PageItem[] => {
	if (total <= 7) {
		return Array.from({ length: total }, (_, i) => ({
			type: "page",
			value: i + 1,
		}));
	}

	const items: PageItem[] = [{ type: "page", value: 1 }];
	const around = new Set(
		[current - 1, current, current + 1].filter((p) => p > 1 && p < total),
	);

	let prev = 1;
	for (const p of [...around].sort((a, b) => a - b)) {
		if (p - prev > 1)
			items.push({ type: "ellipsis", key: `ellipsis-${prev}-${p}` });
		items.push({ type: "page", value: p });
		prev = p;
	}
	if (total - prev > 1)
		items.push({ type: "ellipsis", key: `ellipsis-${prev}-${total}` });
	items.push({ type: "page", value: total });

	return items;
};

export const LotSection = ({
	slug,
	auctionId,
	initialLots,
	initialTotalDocs,
	initialTotalPages,
	currentPage,
	iconSrc,
	iconAlt,
}: {
	slug: string;
	auctionId: number;
	initialLots: Lot[];
	initialTotalDocs: number;
	initialTotalPages: number;
	currentPage: number;
	iconSrc: string;
	iconAlt: string;
}) => {
	const t = useTranslations("auction");
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	const [lots, setLots] = useState<Lot[]>(initialLots);
	const [totalPages, setTotalPages] = useState(initialTotalPages);
	const [totalDocs] = useState(initialTotalDocs);
	const [sort, setSort] = useState("lotNumber");

	const basePath = `/auctions/${slug}`;

	const handleSort = (newSort: string) => {
		if (newSort === sort) return;
		setSort(newSort);
		startTransition(async () => {
			const result = await fetchLotsAction({
				auctionId,
				page: 1,
				sort: newSort,
			});
			setLots(result.docs as Lot[]);
			setTotalPages(result.totalPages);
			if (currentPage !== 1) {
				router.replace(`${basePath}?page=1`);
			}
		});
	};

	const pages = buildPaginationPages(currentPage, totalPages);

	const sortBtnBase =
		"cursor-pointer px-3 py-1.5 text-[12px] uppercase tracking-widest border transition-colors";
	const sortBtnActive = "bg-bordeaux text-blanc-casse border-bordeaux";
	const sortBtnInactive =
		"border-sand text-muted hover:text-bordeaux hover:border-bordeaux";

	const navLinkBase =
		"flex items-center gap-1.5 px-3 py-2 text-[12px] uppercase tracking-widest transition-colors cursor-pointer";
	const navDisabledBase =
		"flex items-center gap-1.5 px-3 py-2 text-[12px] uppercase tracking-widest opacity-30 pointer-events-none";

	return (
		<div className="py-8">
			{totalDocs > 0 && (
				<div className="flex items-center justify-between pb-4 mb-6 border-b border-sand">
					<p className="text-xs text-muted">{totalDocs} lots</p>
					<div
						className={`flex items-center gap-2 transition-opacity ${isPending ? "opacity-50" : ""}`}
					>
						<span className="hidden sm:inline text-[12px] uppercase tracking-widest text-muted">
							{t("sort.label")}
						</span>
						{SORT_OPTIONS.map((opt) => (
							<button
								key={opt}
								type="button"
								onClick={() => handleSort(opt)}
								disabled={isPending}
								className={`${sortBtnBase} ${sort === opt ? sortBtnActive : sortBtnInactive}`}
							>
								{t(`sort.${opt}`)}
							</button>
						))}
					</div>
				</div>
			)}

			<div
				className={isPending ? "opacity-0 pointer-events-none" : "opacity-100"}
				style={{ transition: "opacity 300ms 100ms" }}
			>
				<LotGrid
					lots={lots}
					iconSrc={iconSrc}
					iconAlt={iconAlt}
					auctionSlug={slug}
				/>
			</div>

			{totalPages > 1 && (
				<div className="mt-12 flex flex-col items-center gap-4">
					<p className="text-xs text-muted">
						{t("pagination.page", { current: currentPage, total: totalPages })}
					</p>

					<div className="flex items-center gap-1">
						{currentPage <= 1 ? (
							<span className={`${navDisabledBase} text-muted`}>
								<ArrowLeftIcon size={12} />
								<span className="hidden sm:inline">{t("pagination.prev")}</span>
							</span>
						) : (
							<Link
								href={`${basePath}?page=${currentPage - 1}`}
								className={`${navLinkBase} text-muted hover:text-bordeaux`}
							>
								<ArrowLeftIcon size={12} />
								<span className="hidden sm:inline">{t("pagination.prev")}</span>
							</Link>
						)}

						{pages.map((item) =>
							item.type === "ellipsis" ? (
								<span
									key={item.key}
									className="w-9 h-9 flex items-center justify-center text-xs text-muted"
								>
									…
								</span>
							) : item.value === currentPage ? (
								<span
									key={item.value}
									className="w-9 h-9 flex items-center justify-center text-xs bg-bordeaux text-blanc-casse"
								>
									{item.value}
								</span>
							) : (
								<Link
									key={item.value}
									href={`${basePath}?page=${item.value}`}
									className="w-9 h-9 flex items-center justify-center text-xs border border-sand text-muted hover:text-bordeaux hover:border-bordeaux transition-colors cursor-pointer"
								>
									{item.value}
								</Link>
							),
						)}

						{currentPage >= totalPages ? (
							<span className={`${navDisabledBase} text-muted`}>
								<span className="hidden sm:inline">{t("pagination.next")}</span>
								<ArrowRightIcon size={12} />
							</span>
						) : (
							<Link
								href={`${basePath}?page=${currentPage + 1}`}
								className={`${navLinkBase} text-muted hover:text-bordeaux`}
							>
								<span className="hidden sm:inline">{t("pagination.next")}</span>
								<ArrowRightIcon size={12} />
							</Link>
						)}
					</div>
				</div>
			)}
		</div>
	);
};
