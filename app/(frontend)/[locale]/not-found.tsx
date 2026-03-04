import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { Link } from "@/i18n/navigation";
import { getGraphicsDark, getSiteSettings } from "@/lib/data/site-settings";

const NotFound = async () => {
	const [t, locale] = await Promise.all([
		getTranslations("errors"),
		getLocale(),
	]);
	const settings = await getSiteSettings(locale);
	const { icon } = getGraphicsDark(settings);

	return (
		<section className="flex flex-1 flex-col items-center justify-center py-24">
			<Container className="text-center">
				<Image
					src={icon.src}
					alt={icon.alt}
					width={64}
					height={64}
					className="mx-auto mb-6 opacity-20 object-contain"
				/>
				<div
					className="font-serif italic text-bordeaux mx-auto mb-6"
					style={{ fontSize: "64px", lineHeight: 1 }}
					aria-hidden
				>
					404
				</div>
				<h1 className="font-serif text-2xl lg:text-3xl text-charcoal tracking-tight mb-4">
					{t("notFoundTitle")}
				</h1>
				<p className="text-muted text-sm mb-10 max-w-md mx-auto">
					{t("notFoundDesc")}
				</p>
				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<Link
						href="/"
						className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-sans uppercase tracking-widest border border-bordeaux text-bordeaux hover:bg-bordeaux hover:text-blanc-casse transition-colors"
					>
						{t("backHome")}
					</Link>
					<Link
						href="/auctions"
						className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-sans uppercase tracking-widest border border-sand text-charcoal hover:bg-charcoal hover:text-blanc-casse transition-colors"
					>
						{t("viewSales")}
					</Link>
				</div>
			</Container>
		</section>
	);
};

export default NotFound;
