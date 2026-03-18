import { LegalRichText } from "@/components/legal/legal-rich-text";
import { Container } from "@/components/ui/container";
import type { Legal } from "@/payload-types";

const formatUpdatedAt = (updatedAt: string, locale: string) =>
	new Intl.DateTimeFormat(locale, {
		month: "long",
		year: "numeric",
	}).format(new Date(updatedAt));

export const LegalPageShell = ({
	title,
	siteName,
	locale,
	content,
	updatedAt,
}: {
	title: string;
	siteName: string;
	locale: string;
	content: Legal["legalNotice"] | Legal["privacyPolicy"] | null | undefined;
	updatedAt?: string | null;
}) => {
	return (
		<div className="bg-blanc-casse">
			<header className="border-b border-sand py-12">
				<Container className="max-w-5xl">
					<p className="text-sm uppercase tracking-[0.2em] text-muted">
						{title}
					</p>
					<h1 className="mt-3 font-serif text-4xl italic text-charcoal lg:text-5xl">
						{title}
					</h1>
					<p className="mt-3 max-w-3xl text-base leading-relaxed text-muted">
						{siteName}
					</p>
				</Container>
			</header>
			<Container className="max-w-5xl py-12">
				{content ? (
					<LegalRichText data={content} className="mx-auto max-w-5xl" />
				) : null}
				{updatedAt ? (
					<p className="mt-12 text-sm uppercase tracking-[0.2em] text-muted">
						Dernière mise à jour : {formatUpdatedAt(updatedAt, locale)}
					</p>
				) : null}
			</Container>
		</div>
	);
};
