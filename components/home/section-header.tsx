"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { Link } from "@/i18n/navigation";

export const SectionHeader = ({
	title,
	linkHref,
	linkLabel,
}: {
	title: string;
	linkHref?: string;
	linkLabel?: string;
}) => {
	const ref = useRef<HTMLDivElement>(null);
	const inView = useInView(ref, { once: true, margin: "0px 0px -40px 0px" });

	return (
		<motion.div
			ref={ref}
			initial={{ opacity: 0, y: 8 }}
			animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
			transition={{ duration: 0.4, ease: "easeOut" }}
			className="flex items-center justify-between gap-4 border-b border-sand pb-4"
		>
			<h2 className="font-sans text-sm font-semibold uppercase text-charcoal shrink-0">
				{title}
			</h2>
			{linkHref != null && linkLabel != null && (
				<Link
					href={linkHref}
					className="font-sans text-sm uppercase text-charcoal hover:text-bordeaux transition-colors shrink-0"
				>
					{linkLabel}
				</Link>
			)}
		</motion.div>
	);
};
