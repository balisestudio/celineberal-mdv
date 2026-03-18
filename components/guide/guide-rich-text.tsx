import {
	type JSXConvertersFunction,
	RichText,
} from "@payloadcms/richtext-lexical/react";
import { createElement } from "react";
import { GuideAuctionsBlock } from "@/components/guide/guide-auctions-block";
import { GuideLotsBlock } from "@/components/guide/guide-lots-block";
import type { Auction, Guide, Lot } from "@/payload-types";

type BlockNode = {
	type: string;
	fields?: {
		lot?: number | Lot;
		lots?: (number | Lot)[];
		auction?: number | Auction;
		auctions?: (number | Auction)[];
	};
};

const getGridClass = (count: number): string => {
	const base = "my-12 gap-4";
	if (count <= 1) return "";
	return `grid grid-cols-1 sm:grid-cols-2 ${base}`;
};

export const GuideRichText = ({
	data,
	firstLotsByAuctionId = {},
}: {
	data: Guide["content"];
	firstLotsByAuctionId?: Record<number, Lot[]>;
}) => {
	const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
		...defaultConverters,
		heading: (args) => {
			const { node, nodesToJSX } = args;
			const tag = node.tag as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
			const nextTag =
				tag === "h1" ? "h2" : tag === "h2" ? "h3" : tag === "h3" ? "h4" : "h4";
			const sizeClass =
				nextTag === "h2"
					? "text-3xl lg:text-4xl"
					: nextTag === "h3"
						? "text-2xl lg:text-3xl"
						: "text-xl lg:text-2xl";
			const children = nodesToJSX({ nodes: node.children });
			return createElement(
				nextTag,
				{
					className: `font-serif font-light italic tracking-tight mt-8 mb-3 first:mt-0 text-black leading-tight ${sizeClass}`,
				},
				...children,
			);
		},
		blockquote: (args) => {
			const { node, nodesToJSX } = args;
			const children = nodesToJSX({ nodes: node.children });
			return createElement(
				"blockquote",
				{ className: "border-l-4 border-bordeaux pl-4 italic text-black my-6" },
				...children,
			);
		},
		blocks: {
			...defaultConverters.blocks,
			lot: ({ node }: { node: BlockNode }) => {
				const raw =
					node.fields?.lots ?? (node.fields?.lot ? [node.fields.lot] : []);
				const lots = (Array.isArray(raw) ? raw : []).filter(
					(l): l is Lot => l != null && typeof l === "object" && "id" in l,
				);
				if (lots.length === 0) return null;
				const gridClass = getGridClass(lots.length);
				const content = lots.map((lot) => (
					<GuideLotsBlock
						key={lot.id}
						lot={lot}
						compact={lots.length > 1}
						fillImage={lots.length === 1}
					/>
				));
				return gridClass ? (
					<div className={gridClass}>{content}</div>
				) : (
					content[0]
				);
			},
			auction: ({ node }: { node: BlockNode }) => {
				const raw =
					node.fields?.auctions ??
					(node.fields?.auction ? [node.fields.auction] : []);
				const auctions = (Array.isArray(raw) ? raw : []).filter(
					(a): a is Auction => a != null && typeof a === "object" && "id" in a,
				);
				if (auctions.length === 0) return null;
				const gridClass = getGridClass(auctions.length);
				const content = auctions.map((auction) => (
					<GuideAuctionsBlock
						key={auction.id}
						auction={auction}
						compact={auctions.length > 1}
						fillImage={auctions.length === 1}
					/>
				));
				return gridClass ? (
					<div className={gridClass}>{content}</div>
				) : (
					content[0]
				);
			},
		},
	});

	return (
		<div className="guide-content [&_.lexical-block]:my-6">
			<RichText data={data} converters={converters} />
		</div>
	);
};
