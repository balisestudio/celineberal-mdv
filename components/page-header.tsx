import { Container } from "@/components/ui/container";

const PageHeader = ({ tagline, title }: { tagline: string; title: string }) => {
	return (
		<section className="border-b border-sand py-12">
			<Container>
				<p className="text-xs uppercase tracking-widest text-muted mb-2">
					{tagline}
				</p>
				<h1 className="font-serif italic text-4xl text-charcoal">{title}</h1>
			</Container>
		</section>
	);
};

export { PageHeader };
