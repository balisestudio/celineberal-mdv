import { Container } from "@/components/ui/container";

type ValueItem = {
	title?: string | null;
	description?: string | null;
	id?: string | null;
};

export const ValuesSection = ({
	values,
	titleLabel,
}: {
	values: ValueItem[];
	titleLabel: string;
}) => (
	<section className="bg-sand/30 py-20">
		<Container>
			<h2 className="text-[12px] uppercase tracking-[0.2em] text-muted font-sans mb-10">
				{titleLabel}
			</h2>
			<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
				{values.map((item, i) => (
					<div key={item.id ?? i}>
						{item.title && (
							<h3 className="font-serif italic text-2xl text-bordeaux">
								{item.title}
							</h3>
						)}
						{item.description && (
							<p className="mt-2 text-xs text-muted leading-relaxed">
								{item.description}
							</p>
						)}
					</div>
				))}
			</div>
		</Container>
	</section>
);
