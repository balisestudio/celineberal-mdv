import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { getMediaSrc } from "@/lib/media-src";
import type { Auction, Collaborator, Media } from "@/payload-types";

const getInitials = (name: string) => {
	const trimmed = name.trim();
	return `${trimmed[0] ?? ""}${trimmed[trimmed.length - 1] ?? ""}`.toUpperCase();
};

export const AuctionInfo = async ({ auction }: { auction: Auction }) => {
	const t = await getTranslations("auction");

	const collaborators = (auction.collaborators ?? []).map((item) => ({
		collaborator: item.collaborator as Collaborator,
		role: item.role,
	}));

	return (
		<Container narrow className="py-12">
			<div className="space-y-12">
				{auction.description && (
					<section>
						<p className="text-[12px] uppercase tracking-widest text-muted mb-4">
							{t("info.about")}
						</p>
						<p className="text-base text-charcoal leading-relaxed whitespace-pre-line">
							{auction.description}
						</p>
					</section>
				)}

				{collaborators.length > 0 && (
					<section>
						<p className="text-[12px] uppercase tracking-widest text-muted mb-10">
							{t("info.experts")}
						</p>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-16">
							{collaborators.map(({ collaborator, role }) => {
								const photo =
									typeof collaborator.photo === "object" &&
									collaborator.photo !== null
										? (collaborator.photo as Media)
										: null;

								return (
									<div
										key={collaborator.id}
										className="flex flex-col items-center text-center gap-3"
									>
										<div className="relative w-32 h-32 rounded-full border border-sand overflow-hidden shrink-0">
											{getMediaSrc(photo) ? (
												<Image
													src={getMediaSrc(photo, "thumbnail")}
													alt={photo?.alt ?? collaborator.name}
													fill
													className="object-cover"
												/>
											) : (
												<div className="w-full h-full bg-sand flex items-center justify-center">
													<span className="font-serif italic text-2xl text-bordeaux/50">
														{getInitials(collaborator.name)}
													</span>
												</div>
											)}
										</div>

										{role && (
											<p className="text-[12px] uppercase tracking-[0.2em] text-bordeaux">
												{role}
											</p>
										)}
										<p className="font-serif italic text-2xl text-charcoal">
											{collaborator.name}
										</p>

										{(collaborator.email || collaborator.phone) && (
											<div className="border-t border-sand pt-3 mt-1 flex flex-col gap-1 w-full">
												{collaborator.email && (
													<a
														href={`mailto:${collaborator.email}`}
														className="text-xs text-muted hover:text-bordeaux transition-colors"
													>
														{collaborator.email}
													</a>
												)}
												{collaborator.phone && (
													<a
														href={`tel:${collaborator.phone}`}
														className="text-xs text-muted hover:text-bordeaux transition-colors"
													>
														{collaborator.phone}
													</a>
												)}
											</div>
										)}
									</div>
								);
							})}
						</div>
					</section>
				)}

				<section>
					<div className="border border-sand bg-sand/20 p-6 text-center flex flex-col items-center gap-4">
						<p className="font-serif italic text-lg text-charcoal">
							{t("info.contact")}
						</p>
						<Button href="/contact" variant="outline" size="sm">
							{t("info.contactBtn")}
						</Button>
					</div>
				</section>
			</div>
		</Container>
	);
};
