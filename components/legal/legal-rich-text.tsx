import {
	type JSXConvertersFunction,
	RichText,
} from "@payloadcms/richtext-lexical/react";
import { createElement } from "react";
import type { Legal } from "@/payload-types";

export const LegalRichText = ({
	data,
	className,
}: {
	data: Legal["legalNotice"] | Legal["privacyPolicy"];
	className?: string;
}) => {
	const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
		...defaultConverters,
		heading: (args) => {
			const { node, nodesToJSX } = args;
			const tag = node.tag as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
			const renderedTag =
				tag === "h1" ? "h1" : tag === "h2" ? "h2" : tag === "h3" ? "h3" : "h4";
			const sizeClass =
				renderedTag === "h1"
					? "text-3xl lg:text-4xl"
					: renderedTag === "h2"
						? "text-2xl lg:text-3xl"
						: renderedTag === "h3"
							? "text-xl lg:text-2xl"
							: "text-lg lg:text-xl";
			const children = nodesToJSX({ nodes: node.children });
			return createElement(
				renderedTag,
				{
					className: `font-serif italic text-charcoal mt-8 mb-4 ${sizeClass}`,
				},
				...children,
			);
		},
	});

	return (
		<div className={`text-justify ${className ?? ""}`.trim()}>
			<RichText data={data} converters={converters} />
		</div>
	);
};
