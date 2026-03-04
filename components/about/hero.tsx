import { Container } from "@/components/ui/container";

export const AboutHero = ({
	tagline,
	heroTitle,
}: {
	tagline: string;
	heroTitle: string;
}) => (
	<section className="bg-bordeaux py-20 selection:bg-blanc-casse/35">
		<Container>
			<div className="max-w-2xl">
				<p className="text-sm uppercase tracking-[0.2em] text-blanc-casse/50 mb-3">
					{tagline}
				</p>
				<h1 className="font-serif italic text-5xl lg:text-7xl text-blanc-casse leading-none">
					{heroTitle}
				</h1>
			</div>
		</Container>
	</section>
);
