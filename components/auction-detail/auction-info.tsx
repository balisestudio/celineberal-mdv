import { getTranslations } from "next-intl/server";
import { CollaboratorCard } from "@/components/collaborator/collaborator-card";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import type { Auction, Collaborator } from "@/payload-types";

export const AuctionInfo = async ({ auction }: { auction: Auction }) => {
	const t = await getTranslations("auction");

	return (
		<Container narrow className="py-12">
			<div className="space-y-12">
				{auction.description && (
					<section>
						<p className="text-sm uppercase tracking-widest text-muted mb-4">
							{t("info.about")}
						</p>
						<p className="text-base text-charcoal leading-relaxed whitespace-pre-line">
							{auction.description}
						</p>
					</section>
				)}

				{auction.collaborators && auction.collaborators.length > 0 ? (
					<section>
						<p className="text-sm uppercase tracking-widest text-muted mb-10">
							{t("info.experts")}
						</p>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-16">
							{auction.collaborators.map((item) => {
								const collaborator = item.collaborator;
								if (!collaborator || typeof collaborator !== "object") {
									return null;
								}
								return (
									<CollaboratorCard
										key={item.id ?? collaborator.id}
										collaborator={collaborator as Collaborator}
										variant="compact"
									/>
								);
							})}
						</div>
					</section>
				) : null}

				<section>
					<div className="border border-sand bg-sand/20 p-6 text-center flex flex-col items-center gap-4">
						<p className="font-serif italic text-lg text-charcoal">
							{t("info.contact")}
						</p>
						<Button href="/about" variant="outline" size="sm">
							{t("info.contactBtn")}
						</Button>
					</div>
				</section>
			</div>
		</Container>
	);
};
