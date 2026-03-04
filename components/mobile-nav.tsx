"use client";

import { XIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef } from "react";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { Button } from "@/components/ui/button";
import { Link, usePathname } from "@/i18n/navigation";

const FOCUSABLE_SELECTOR =
	'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

export const MobileNav = ({
	isOpen,
	onClose,
	siteName,
	siteTagline,
	links,
}: {
	isOpen: boolean;
	onClose: () => void;
	siteName: string;
	siteTagline: string;
	links: { href: string; label: string }[];
}) => {
	const t = useTranslations("navbar");
	const pathname = usePathname();
	const closeButtonRef = useRef<HTMLButtonElement>(null);
	const drawerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
			closeButtonRef.current?.focus();
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [isOpen]);

	const handleKeyDown = useCallback(
		(e: KeyboardEvent) => {
			if (!isOpen) return;

			if (e.key === "Escape") {
				onClose();
				return;
			}

			if (e.key === "Tab" && drawerRef.current) {
				const focusable = Array.from(
					drawerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
				);
				if (focusable.length === 0) return;

				const first = focusable[0];
				const last = focusable[focusable.length - 1];

				if (e.shiftKey) {
					if (document.activeElement === first) {
						e.preventDefault();
						last.focus();
					}
				} else {
					if (document.activeElement === last) {
						e.preventDefault();
						first.focus();
					}
				}
			}
		},
		[isOpen, onClose],
	);

	useEffect(() => {
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [handleKeyDown]);

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					<motion.div
						key="overlay"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.25 }}
						className="fixed inset-0 z-40 bg-charcoal/40 backdrop-blur-sm"
						onClick={onClose}
					/>

					<motion.div
						key="drawer"
						ref={drawerRef}
						role="dialog"
						initial={{ x: "100%" }}
						animate={{ x: 0 }}
						exit={{ x: "100%" }}
						transition={{ type: "tween", duration: 0.3 }}
						className="fixed inset-y-0 right-0 z-50 flex max-w-sm w-full flex-col bg-blanc-casse"
					>
						<div className="flex items-center justify-between px-6 py-5 border-b border-sand">
							<span className="font-serif italic text-base text-muted">
								{siteName}
							</span>
							<button
								ref={closeButtonRef}
								type="button"
								onClick={onClose}
								className="p-1 text-charcoal hover:text-bordeaux transition-colors cursor-pointer"
							>
								<XIcon size={20} />
							</button>
						</div>

						<nav className="flex flex-col flex-1 overflow-y-auto px-6 py-8">
							<ul className="flex flex-col gap-6">
								{links.map(({ href, label }) => {
									const isActive = pathname === href;
									return (
										<li key={href}>
											<Link
												href={href}
												onClick={onClose}
												className={`font-serif text-2xl italic transition-colors hover:text-bordeaux ${
													isActive ? "text-bordeaux" : "text-charcoal"
												}`}
											>
												{label}
											</Link>
										</li>
									);
								})}
							</ul>

							<div className="mt-auto pt-10 flex flex-col items-center gap-4">
								<Button
									href="/estimate"
									variant="primary"
									size="lg"
									className="w-full justify-center"
								>
									{t("estimate")}
								</Button>
								<LocaleSwitcher />
							</div>
						</nav>

						<div className="px-6 py-5 border-t border-sand">
							<p className="font-sans text-sm uppercase tracking-widest text-muted text-center">
								{siteTagline}
							</p>
						</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
};
