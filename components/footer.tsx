"use client";

import { useTranslations } from "next-intl";
import { Mark } from "@/components/logos";
import { Container } from "@/components/ui/container";
import { Link } from "@/i18n/navigation";
import type {
	Contact as ContactType,
	Legal as LegalType,
} from "@/payload-types";

const FOOTER_NAV = [
	{ href: "/auctions", navKey: "links.auctions" as const },
	{ href: "/results", navKey: "links.results" as const },
	{ href: "/encyclopedia", navKey: "links.encyclopedia" as const },
	{ href: "/estimate", navKey: "estimate" as const },
	{ href: "/about", navKey: "links.about" as const },
] as const;

export const Footer = ({
	siteName,
	tagline,
	contact,
	legal,
}: {
	siteName: string;
	tagline: string;
	contact: ContactType | null;
	legal: LegalType | null;
}) => {
	const tFooter = useTranslations("footer");
	const tNav = useTranslations("navbar");
	const year = new Date().getFullYear();

	return (
		<footer className="w-full bg-bordeaux">
			<Container>
				<div className="grid gap-12 py-16 md:grid-cols-3 md:gap-8">
					<div className="space-y-2">
						<Link
							href="/"
							className="inline-block hover:opacity-75 transition-opacity"
						>
							<Mark variant="light" size={36} />
						</Link>
						<p className="text-sm uppercase tracking-[0.18em] text-blanc-casse/60">
							{tagline}
						</p>
					</div>

					<div>
						<p className="mb-4 text-sm uppercase tracking-widest text-blanc-casse/40">
							{tFooter("navLabel")}
						</p>
						<nav>
							<ul className="flex flex-col gap-3">
								{FOOTER_NAV.map(({ href, navKey }) => (
									<li key={href}>
										<Link
											href={href}
											className="font-sans text-base text-blanc-casse/80 transition-colors hover:text-blanc-casse"
										>
											{tNav(navKey)}
										</Link>
									</li>
								))}
							</ul>
						</nav>
					</div>

					<div>
						<p className="mb-4 text-sm uppercase tracking-widest text-blanc-casse/40">
							{tFooter("contactLabel")}
						</p>
						{contact ? (
							<div className="space-y-3 font-sans text-base text-blanc-casse/80">
								<address className="not-italic whitespace-pre-line leading-4">
									{contact.address}
								</address>
								<a
									href={`mailto:${contact.email}`}
									className="block transition-colors hover:text-blanc-casse"
								>
									{contact.email}
								</a>
								{contact.socialLinks && contact.socialLinks.length > 0 && (
									<div className="flex flex-wrap gap-3 pt-1">
										{contact.socialLinks.map((link, i) => (
											<a
												key={link.id ?? i}
												href={link.url}
												target="_blank"
												rel="noopener noreferrer"
												className="transition-colors hover:text-blanc-casse text-blanc-casse/80"
											>
												{link.name}
											</a>
										))}
									</div>
								)}
								<div className="pt-2">
									<Link
										href="/terms/legal"
										className="block transition-colors hover:text-blanc-casse"
									>
										{tNav("links.legal")}
									</Link>
									<Link
										href="/terms/privacy"
										className="block transition-colors hover:text-blanc-casse"
									>
										{tNav("links.privacy")}
									</Link>
								</div>
							</div>
						) : null}
					</div>
				</div>

				<div className="border-t border-white/20 py-6">
					<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						{legal ? (
							<p className="text-sm text-blanc-casse/40">
								{tFooter("legal", {
									siret: legal.siret,
									rcs: legal.rcs,
									capitalSocial: legal.capitalSocial,
									agrement: legal.agrement,
								})}
							</p>
						) : (
							<span />
						)}
						<p className="text-sm text-blanc-casse/40">
							© {year} {siteName}
						</p>
					</div>
				</div>
			</Container>
		</footer>
	);
};
