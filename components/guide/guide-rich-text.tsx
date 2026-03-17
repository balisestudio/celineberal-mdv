import {
	type JSXConvertersFunction,
	RichText,
} from "@payloadcms/richtext-lexical/react";
import { createElement } from "react";
import { GuideAuctionBlock } from "@/components/guide/guide-auction-block";
import { GuideLotBlock } from "@/components/guide/guide-lot-block";
import type { Auction, Guide, Lot } from "@/payload-types";

type BlockNode = {
	type: string;
	fields?: {
		lot?: number | Lot;
		auction?: number | Auction;
	};
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
				const lot = node.fields?.lot;
				if (!lot || typeof lot !== "object") return null;
				return <GuideLotBlock lot={lot} />;
			},
			auction: ({ node }: { node: BlockNode }) => {
				const auction = node.fields?.auction;
				if (!auction || typeof auction !== "object") return null;
				const firstLots = firstLotsByAuctionId[auction.id] ?? [];
				return <GuideAuctionBlock auction={auction} />;
			},
		},
	});

	return (
		<div className="guide-content [&_.lexical-block]:my-6">
			<RichText data={data} converters={converters} />
		</div>
	);
};
