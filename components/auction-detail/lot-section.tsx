"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { useRouter } from "@/i18n/navigation";
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
	auctionId,
	initialLots,
	initialTotalDocs,
	initialTotalPages,
	currentPage,
	iconSrc,
	iconAlt,
}: {
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
	const pathname = usePathname();
	const [isPending, startTransition] = useTransition();

	const [lots, setLots] = useState<Lot[]>(initialLots);
	const [totalPages, setTotalPages] = useState(initialTotalPages);
	const [totalDocs] = useState(initialTotalDocs);
	const [sort, setSort] = useState("lotNumber");

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
				router.replace(`${pathname}?page=1`);
			}
		});
	};

	const handlePage = (page: number) => {
		router.push(`${pathname}?page=${page}`);
	};

	const pages = buildPaginationPages(currentPage, totalPages);

	const sortBtnBase =
		"px-3 py-1.5 text-[10px] uppercase tracking-widest border transition-colors";
	const sortBtnActive = "bg-bordeaux text-blanc-casse border-bordeaux";
	const sortBtnInactive =
		"border-sand text-muted hover:text-bordeaux hover:border-bordeaux";

	return (
		<div className="py-8">
			{totalDocs > 0 && (
				<div className="flex items-center justify-between pb-4 mb-6 border-b border-sand">
					<p className="text-xs text-muted">{totalDocs} lots</p>
					<div
						className={`flex items-center gap-2 transition-opacity ${isPending ? "opacity-50" : ""}`}
					>
						<span className="hidden sm:inline text-[10px] uppercase tracking-widest text-muted">
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
				<LotGrid lots={lots} iconSrc={iconSrc} iconAlt={iconAlt} />
			</div>

			{totalPages > 1 && (
				<div className="mt-12 flex flex-col items-center gap-4">
					<p className="text-xs text-muted">
						{t("pagination.page", { current: currentPage, total: totalPages })}
					</p>

					<div className="flex items-center gap-1">
						<button
							type="button"
							onClick={() => handlePage(currentPage - 1)}
							disabled={currentPage <= 1 || isPending}
							className={`flex items-center gap-1.5 px-3 py-2 text-[10px] uppercase tracking-widest text-muted hover:text-bordeaux transition-colors ${currentPage <= 1 ? "opacity-30 pointer-events-none" : ""}`}
						>
							<ArrowLeftIcon size={12} />
							<span className="hidden sm:inline">{t("pagination.prev")}</span>
						</button>

						{pages.map((item) =>
							item.type === "ellipsis" ? (
								<span
									key={item.key}
									className="w-9 h-9 flex items-center justify-center text-xs text-muted"
								>
									…
								</span>
							) : (
								<button
									key={item.value}
									type="button"
									onClick={() => handlePage(item.value)}
									disabled={isPending}
									className={`w-9 h-9 flex items-center justify-center text-xs transition-colors ${
										item.value === currentPage
											? "bg-bordeaux text-blanc-casse"
											: "border border-sand text-muted hover:text-bordeaux hover:border-bordeaux"
									}`}
								>
									{item.value}
								</button>
							),
						)}

						<button
							type="button"
							onClick={() => handlePage(currentPage + 1)}
							disabled={currentPage >= totalPages || isPending}
							className={`flex items-center gap-1.5 px-3 py-2 text-[10px] uppercase tracking-widest text-muted hover:text-bordeaux transition-colors ${currentPage >= totalPages ? "opacity-30 pointer-events-none" : ""}`}
						>
							<span className="hidden sm:inline">{t("pagination.next")}</span>
							<ArrowRightIcon size={12} />
						</button>
					</div>
				</div>
			)}
		</div>
	);
};
