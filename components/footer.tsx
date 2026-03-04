"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { Link } from "@/i18n/navigation";
import type { Contact as ContactType } from "@/payload-types";

const FOOTER_NAV = [
	{ href: "/auctions", navKey: "links.auctions" as const },
	{ href: "/results", navKey: "links.results" as const },
	{ href: "/estimate", navKey: "estimate" as const },
	{ href: "/about", navKey: "links.about" as const },
] as const;

export const Footer = ({
	siteName,
	tagline,
	iconLightSrc,
	iconLightAlt,
	contact,
}: {
	siteName: string;
	tagline: string;
	iconLightSrc: string;
	iconLightAlt: string;
	contact: ContactType | null;
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
							<Image
								src={iconLightSrc}
								alt={iconLightAlt}
								width={48}
								height={48}
								unoptimized={iconLightSrc.startsWith("http")}
							/>
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
							</div>
						) : null}
					</div>
				</div>

				<div className="border-t border-white/20 py-6">
					<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						{contact ? (
							<p className="text-sm text-blanc-casse/40">
								{tFooter("legal", {
									siret: contact.siret,
									rcs: contact.rcs,
									capitalSocial: contact.capitalSocial,
									agrement: contact.agrement,
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
