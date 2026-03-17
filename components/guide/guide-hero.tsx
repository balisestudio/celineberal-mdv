import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { Link } from "@/i18n/navigation";
import { getMediaSrc } from "@/lib/media-src";
import type { Guide, Media } from "@/payload-types";

export const GuideHero = async ({
	guide,
	thematiqueLabel,
}: {
	guide: Guide;
	thematiqueLabel?: string | null;
}) => {
	const t = await getTranslations("guide");
	const poster = guide.poster as Media;
	const src = poster ? getMediaSrc(poster, "xl") : null;

	return (
		<>
			<section className="bg-bordeaux pt-[5vh] pb-[35vh] selection:bg-blanc-casse/35">
				<Container className="relative">
					<div className="flex items-center gap-1.5 text-sm uppercase tracking-widest text-blanc-casse/70 mb-8 min-w-0">
						<Link
							href="/guides"
							className="hover:text-blanc-casse transition-colors shrink-0"
						>
							{t("breadcrumbGuides")}
						</Link>
						<span className="shrink-0">›</span>
						<span className="text-blanc-casse truncate">{guide.title}</span>
					</div>
					<div className="max-w-3xl">
						{thematiqueLabel && (
							<p className="text-sm uppercase tracking-[0.2em] text-blanc-casse/60 mb-3">
								{thematiqueLabel}
							</p>
						)}
						<h1 className="font-serif italic text-4xl sm:text-5xl lg:text-6xl text-blanc-casse leading-tight">
							{guide.title}
						</h1>
					</div>
				</Container>
			</section>
			{src && (
				<section className="relative -mt-[30vh] z-10">
					<Container>
						<div className="relative w-full aspect-16/10 overflow-hidden bg-sand/20">
							<Image
								src={src}
								alt={poster?.alt ?? guide.title}
								fill
								className="object-cover"
								priority
								sizes="(min-width: 1280px) 1280px, 100vw"
							/>
						</div>
					</Container>
				</section>
			)}
		</>
	);
};
