import Image from "next/image";
import { Mark } from "@/components/logos";
import { Container } from "@/components/ui/container";

const paragraphs = (text: string) => text.trim().split(/\n\n+/).filter(Boolean);

export const ManifestoSection = ({
	manifesto,
	signature,
	imageSrc,
	imageAlt,
	manifestoLabel,
}: {
	manifesto: string;
	signature: string;
	imageSrc: string | null;
	imageAlt: string;
	manifestoLabel: string;
}) => {
	const blocks = paragraphs(manifesto);
	return (
		<section className="bg-white py-20 border-t border-sand/40">
			<Container>
				<div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_1fr]">
					<div className="space-y-6">
						<h2 className="font-serif italic text-3xl text-charcoal">
							{manifestoLabel}
						</h2>
						{blocks.length > 0 && (
							<>
								<div className="space-y-6">
									{blocks.map((p) => (
										<p
											key={p}
											className="font-serif italic text-lg text-charcoal leading-relaxed"
										>
											{p}
										</p>
									))}
								</div>
								<p className="text-sm uppercase tracking-[0.2em] text-muted font-sans pt-2">
									{signature}
								</p>
							</>
						)}
					</div>
					<div className="min-h-[400px] w-full overflow-hidden">
						{imageSrc ? (
							<Image
								src={imageSrc}
								alt={imageAlt}
								width={600}
								height={750}
								className="h-full max-h-[600px] w-full object-cover"
								unoptimized={imageSrc.startsWith("http")}
							/>
						) : (
							<div className="flex min-h-[400px] w-full items-center justify-center bg-sand/30">
								<Mark variant="dark" size={96} />
							</div>
						)}
					</div>
				</div>
			</Container>
		</section>
	);
};
