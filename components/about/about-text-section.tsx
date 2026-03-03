import { Container } from "@/components/ui/container";

export const AboutTextSection = ({
	aboutText,
	titleLabel,
}: {
	aboutText: string;
	titleLabel: string;
}) => (
	<section className="bg-white py-20">
		<Container narrow>
			<h2 className="text-[12px] uppercase tracking-[0.2em] text-muted font-sans mb-6">
				{titleLabel}
			</h2>
			<p className="font-sans text-base text-charcoal leading-relaxed whitespace-pre-line">
				{aboutText}
			</p>
		</Container>
	</section>
);
