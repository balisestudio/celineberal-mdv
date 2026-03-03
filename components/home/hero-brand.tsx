import Image from "next/image";
import { Container } from "@/components/ui/container";

export const HeroBrand = ({
	siteName,
	tagline,
	iconSrc,
	iconAlt,
}: {
	siteName: string;
	tagline: string;
	iconSrc: string;
	iconAlt: string;
}) => (
	<section className="bg-blanc-casse py-10 lg:py-14">
		<Container>
			<div className="min-h-[300px] lg:min-h-[500px] grid grid-cols-1 lg:grid-cols-[55%_45%]">
				<div className="min-h-[300px] lg:min-h-[500px] bg-sand/30 flex items-center justify-center">
					<Image
						src={iconSrc}
						alt={iconAlt}
						width={120}
						height={120}
						className="opacity-10 object-contain"
					/>
				</div>
				<div className="flex flex-col justify-center border-l-0 lg:border-l border-sand px-6 py-10 lg:px-8 lg:py-12">
					<p className="text-[10px] uppercase tracking-[0.2em] text-bordeaux font-sans">
						{tagline}
					</p>
					<h1 className="font-serif italic text-5xl lg:text-7xl text-charcoal leading-none mt-2">
						{siteName}
					</h1>
				</div>
			</div>
		</Container>
	</section>
);
