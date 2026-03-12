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
	<section className="bg-blanc-casse py-20 border-t border-sand/50">
		<Container>
			<h2 className="font-serif italic text-3xl text-charcoal mb-10">
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
							<p className="mt-2 text-base text-muted leading-relaxed">
								{item.description}
							</p>
						)}
					</div>
				))}
			</div>
		</Container>
	</section>
);
