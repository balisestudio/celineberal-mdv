import { Container } from "@/components/ui/container";

type PressItem = {
	label: string;
	url?: string | null;
	id?: string | null;
};

const MarqueeContent = ({ items }: { items: PressItem[] }) => (
	<>
		{items.map((item, i) =>
			item.url ? (
				<a
					key={item.id ?? i}
					href={item.url}
					target="_blank"
					rel="noopener noreferrer"
					className="shrink-0 font-serif italic text-lg text-charcoal/30 transition-colors hover:text-charcoal/60 whitespace-nowrap"
				>
					{item.label}
				</a>
			) : (
				<span
					key={item.id ?? i}
					className="shrink-0 font-serif italic text-lg text-charcoal/30 whitespace-nowrap"
				>
					{item.label}
				</span>
			),
		)}
	</>
);

export const PressMarquee = ({
	press,
	label,
}: {
	press: PressItem[];
	label: string;
}) => (
	<section className="border-y border-sand bg-blanc-casse py-16">
		<Container>
			<p className="text-[12px] uppercase tracking-[0.2em] text-muted font-sans mb-8">
				{label}
			</p>
		</Container>
		<div className="overflow-hidden">
			<div className="about-marquee flex w-max gap-16 py-2">
				{[1, 2, 3, 4, 5, 6].map((n) => (
					<div key={n} className="flex shrink-0 gap-16">
						<MarqueeContent items={press} />
					</div>
				))}
			</div>
		</div>
	</section>
);
