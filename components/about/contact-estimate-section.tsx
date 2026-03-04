import { LinkSimpleIcon } from "@phosphor-icons/react/dist/ssr";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import type { Contact as ContactType } from "@/payload-types";

export const ContactEstimateSection = async ({
	contact,
}: {
	contact: ContactType | null;
}) => {
	const [t, tHome] = await Promise.all([
		getTranslations("about"),
		getTranslations("home"),
	]);

	return (
		<section className="border-t border-sand py-20">
			<Container>
				<div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_1fr]">
					<div className="space-y-8">
						<div>
							<h2 className="font-serif italic text-3xl text-charcoal mb-6">
								{t("contactTitle")}
							</h2>
							<p className="text-sm text-muted leading-relaxed">
								{t("contactDesc")}
							</p>
						</div>
						{contact && (
							<dl className="space-y-4 text-sm">
								<div className="flex gap-4">
									<dt className="w-24 shrink-0 text-[12px] uppercase tracking-[0.2em] text-muted">
										{t("address")}
									</dt>
									<dd className="text-charcoal whitespace-pre-line">
										{contact.address}
									</dd>
								</div>
								<div className="flex gap-4">
									<dt className="w-24 shrink-0 text-[12px] uppercase tracking-[0.2em] text-muted">
										{t("email")}
									</dt>
									<dd>
										<a
											href={`mailto:${contact.email}`}
											className="text-charcoal transition-colors hover:text-bordeaux"
										>
											{contact.email}
										</a>
									</dd>
								</div>
								<div className="flex gap-4">
									<dt className="w-24 shrink-0 text-[12px] uppercase tracking-[0.2em] text-muted">
										{t("phone")}
									</dt>
									<dd>
										<a
											href={`tel:${contact.phone.replace(/\s/g, "")}`}
											className="text-charcoal transition-colors hover:text-bordeaux"
										>
											{contact.phone}
										</a>
									</dd>
								</div>
								{contact.horaires && (
									<div className="flex gap-4">
										<dt className="w-24 shrink-0 text-[12px] uppercase tracking-[0.2em] text-muted">
											{t("horaires")}
										</dt>
										<dd className="text-charcoal whitespace-pre-line">
											{contact.horaires}
										</dd>
									</div>
								)}
							</dl>
						)}
						{contact?.socialLinks && contact.socialLinks.length > 0 && (
							<div className="flex gap-2 pt-2">
								{contact.socialLinks.map((link, i) => (
									<a
										key={link.id ?? i}
										href={link.url}
										target="_blank"
										rel="noopener noreferrer"
										className="flex h-9 w-9 shrink-0 items-center justify-center border border-sand text-muted transition-colors hover:border-bordeaux hover:text-bordeaux"
										aria-label={link.name}
									>
										<LinkSimpleIcon size={16} />
									</a>
								))}
							</div>
						)}
					</div>
					<div className="flex flex-col justify-center border border-sand p-8">
						<div className="flex flex-col items-center gap-6 text-center">
							<p className="text-[12px] uppercase tracking-[0.2em] text-bordeaux font-sans">
								{tHome("estimateTag")}
							</p>
							<h3 className="font-serif italic text-2xl text-charcoal">
								{tHome("estimateTitle")}
							</h3>
							<p className="text-sm text-muted leading-relaxed">
								{tHome("estimateDesc")}
							</p>
							<Button href="/estimate" variant="primary" size="md">
								{tHome("estimateCta")}
							</Button>
						</div>
					</div>
				</div>
			</Container>
		</section>
	);
};
