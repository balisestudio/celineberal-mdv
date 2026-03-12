import { Container } from "@/components/ui/container";

export const AboutTextSection = ({
	aboutText,
	titleLabel,
}: {
	aboutText: string;
	titleLabel: string;
}) => (
	<section className="bg-white py-20 border-t border-sand/50">
		<Container narrow>
			<h2 className="font-serif italic text-3xl text-charcoal mb-6">
				{titleLabel}
			</h2>
			<p className="font-sans text-base text-charcoal leading-relaxed whitespace-pre-line">
				{aboutText}
			</p>
		</Container>
	</section>
);
