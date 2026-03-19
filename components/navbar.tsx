"use client";

import { ListIcon } from "@phosphor-icons/react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { Wordmark } from "@/components/logos";
import { MobileNav } from "@/components/mobile-nav";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Link, usePathname } from "@/i18n/navigation";

const NAV_ROUTES = [
	{ href: "/auctions", key: "auctions" },
	{ href: "/results", key: "results" },
	{ href: "/encyclopedia", key: "encyclopedia" },
	{ href: "/about", key: "about" },
] as const;

export const NavBar = ({
	siteName,
	siteTagline,
}: {
	siteName: string;
	siteTagline: string;
}) => {
	const t = useTranslations("navbar");
	const pathname = usePathname();
	const [menuOpen, setMenuOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const [logoCompact, setLogoCompact] = useState(false);
	const lastScrollY = useRef(0);

	useEffect(() => {
		lastScrollY.current = window.scrollY;
		const onScroll = () => {
			const y = window.scrollY;
			setScrolled(y > 12);

			if (y < 24) {
				setLogoCompact(false);
			} else if (y > lastScrollY.current + 6) {
				setLogoCompact(true);
			} else if (y < lastScrollY.current - 6) {
				setLogoCompact(false);
			}
			lastScrollY.current = y;
		};
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	const links = NAV_ROUTES.map(({ href, key }) => ({
		href,
		label: t(`links.${key}`),
	}));

	return (
		<>
			<motion.header
				animate={
					scrolled
						? { boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.08)" }
						: { boxShadow: "0 0px 0px 0 rgb(0 0 0 / 0)" }
				}
				transition={{ duration: 0.2 }}
				className={`sticky top-0 z-30 border-b border-sand transition-[background-color,backdrop-filter] duration-200 ${
					scrolled ? "bg-blanc-casse/95 backdrop-blur-sm" : "bg-blanc-casse"
				}`}
			>
				<Container>
					<div
						className={`flex items-center justify-between transition-[min-height] duration-200 ease-out ${
							logoCompact ? "min-h-16 py-2" : "min-h-28 py-3"
						}`}
					>
						<Link
							href="/"
							className="flex items-center hover:opacity-75 transition-opacity"
						>
							<motion.span
								className="inline-block origin-left"
								initial={false}
								animate={{
									scale: logoCompact ? 1 : 2,
								}}
								transition={{ type: "tween", duration: 0.22, ease: "easeOut" }}
							>
								<Wordmark variant="dark" size={72} className="block" />
							</motion.span>
						</Link>

						<nav className="hidden lg:flex items-center gap-8">
							{links.map(({ href, label }) => {
								const isActive = pathname === href;
								return (
									<Link
										key={href}
										href={href}
										className={`font-sans text-sm uppercase tracking-widest transition-colors hover:text-bordeaux ${
											isActive ? "text-bordeaux" : "text-charcoal"
										}`}
									>
										{label}
									</Link>
								);
							})}
						</nav>

						<div className="flex items-center gap-4">
							<div className="hidden lg:block">
								<LocaleSwitcher />
							</div>

							<Button
								href="/estimate"
								variant="primary"
								size="sm"
								className="hidden sm:inline-flex"
							>
								{t("estimate")}
							</Button>

							<button
								type="button"
								onClick={() => setMenuOpen(true)}
								className="lg:hidden p-1 text-charcoal hover:text-bordeaux transition-colors cursor-pointer"
							>
								<ListIcon size={22} />
							</button>
						</div>
					</div>
				</Container>
			</motion.header>

			<MobileNav
				isOpen={menuOpen}
				onClose={() => setMenuOpen(false)}
				siteName={siteName}
				siteTagline={siteTagline}
				links={links}
			/>
		</>
	);
};
