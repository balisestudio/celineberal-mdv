import { getTranslations } from "next-intl/server";
import { EstimateForm } from "@/components/estimate/estimate-form";
import { Container } from "@/components/ui/container";
import { getSiteSettings } from "@/lib/data/site-settings";

export const generateMetadata = async () => {
	const t = await getTranslations("estimate");
	const settings = await getSiteSettings();
	return { title: `${t("title")} – ${settings.siteName}` };
};

const EstimatePage = async () => {
	const [t, settings] = await Promise.all([
		getTranslations("estimate"),
		getSiteSettings(),
	]);

	return (
		<div className="bg-blanc-casse">
			<header className="border-b border-sand py-12">
				<Container size="hero">
					<p className="text-sm uppercase tracking-[0.2em] text-muted">
						{t("surtitle")}
					</p>
					<h1 className="mt-3 font-serif text-4xl italic text-charcoal">
						{t("title")}
					</h1>
					<p className="mt-3 max-w-[512px] text-base leading-relaxed text-muted">
						{t("description", { siteName: settings.siteName })}
					</p>
				</Container>
			</header>
			<EstimateForm siteName={settings.siteName} />
		</div>
	);
};

export default EstimatePage;
