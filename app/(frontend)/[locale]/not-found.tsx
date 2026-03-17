import { getLocale, getTranslations } from "next-intl/server";
import { Mark } from "@/components/logos";
import { Container } from "@/components/ui/container";
import { Link } from "@/i18n/navigation";
import { getSiteSettings } from "@/lib/data/site-settings";

const NotFound = async () => {
	const [t, locale] = await Promise.all([
		getTranslations("errors"),
		getLocale(),
	]);
	await getSiteSettings(locale);

	return (
		<section className="flex flex-1 flex-col items-center justify-center py-24">
			<Container className="text-center">
				<Mark variant="dark" size={32} className="mx-auto mb-4" />
				<div
					className="font-serif italic text-bordeaux mx-auto mb-4"
					style={{ fontSize: "48px", lineHeight: 1 }}
					aria-hidden
				>
					404
				</div>
				<h1 className="font-serif text-xl lg:text-2xl text-charcoal tracking-tight mb-3">
					{t("notFoundTitle")}
				</h1>
				<p className="text-muted text-sm mb-8 max-w-md mx-auto">
					{t("notFoundDesc")}
				</p>
				<Link
					href="/"
					className="inline-block font-sans text-sm uppercase tracking-widest text-bordeaux hover:underline"
				>
					{t("backHome")}
				</Link>
			</Container>
		</section>
	);
};

export default NotFound;
