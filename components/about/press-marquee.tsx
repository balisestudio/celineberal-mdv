import Image from "next/image";
import { Container } from "@/components/ui/container";
import { getMediaSrc } from "@/lib/media-src";
import type { Media } from "@/payload-types";

type PressItem = {
	label: string;
	id?: string | null;
	logo: Media | number | null;
};

const MarqueeContent = ({ items }: { items: PressItem[] }) => (
	<>
		{items.map((item, i) => {
			const logo = item.logo as Media;
			return (
				<span key={item.id ?? i} className="shrink-0 flex items-center">
					<Image
						src={getMediaSrc(logo)}
						alt={item.label}
						width={logo.width ?? 200}
						height={logo.height ?? 80}
						className="h-8 w-auto object-contain"
					/>
				</span>
			);
		})}
	</>
);

export const PressMarquee = ({
	press,
	label,
}: {
	press: PressItem[];
	label: string;
}) => (
	<section className="bg-blanc-casse py-16">
		<Container>
			<p className="text-sm uppercase tracking-[0.2em] text-muted font-sans mb-8">
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
