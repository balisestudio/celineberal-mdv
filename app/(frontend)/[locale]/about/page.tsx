import { getLocale, getTranslations } from "next-intl/server";
import { AboutTextSection } from "@/components/about/about-text-section";
import { ContactEstimateSection } from "@/components/about/contact-estimate-section";
import { AboutHero } from "@/components/about/hero";
import { LegalMentions } from "@/components/about/legal-mentions";
import { ManifestoSection } from "@/components/about/manifesto-section";
import { PressMarquee } from "@/components/about/press-marquee";
import { ValuesSection } from "@/components/about/values-section";
import { getAbout } from "@/lib/data/about";
import { getContact } from "@/lib/data/contact";
import { getGraphicsDark, getSiteSettings } from "@/lib/data/site-settings";
import { getMediaSrc } from "@/lib/media-src";
import type { About as AboutType } from "@/payload-types";

export const generateMetadata = async () => {
	const locale = await getLocale();
	const [settings, t] = await Promise.all([
		getSiteSettings(locale),
		getTranslations({ locale, namespace: "about" }),
	]);
	return { title: `${t("aboutTitle")} – ${settings.siteName}` };
};

const resolveAboutImage = (
	about: AboutType,
): { src: string; alt: string } | null => {
	const img = about.aboutImage;
	if (!img || typeof img === "number") return null;
	return { src: getMediaSrc(img), alt: img.alt ?? "" };
};

const AboutPage = async () => {
	const locale = await getLocale();
	const t = await getTranslations("about");

	const [settings, about, contact] = await Promise.all([
		getSiteSettings(locale),
		getAbout(locale),
		getContact(),
	]);

	const { icon } = getGraphicsDark(settings);
	const aboutImage = resolveAboutImage(about);
	const values = about.values ?? [];
	const press = about.press ?? [];

	return (
		<>
			<AboutHero tagline={settings.tagline} heroTitle={t("aboutTitle")} />

			<ManifestoSection
				manifesto={about.manifesto}
				signature={about.signature}
				imageSrc={aboutImage?.src ?? null}
				imageAlt={aboutImage?.alt ?? ""}
				iconSrc={icon.src}
				iconAlt={icon.alt}
				manifestoLabel={t("manifestoLabel")}
			/>

			{values.length > 0 && (
				<ValuesSection values={values} titleLabel={t("valuesTitle")} />
			)}

			{about.aboutText && (
				<AboutTextSection
					aboutText={about.aboutText}
					titleLabel={t("aboutTitle")}
				/>
			)}

			{press.length > 0 && (
				<PressMarquee press={press} label={t("pressLabel")} />
			)}

			<ContactEstimateSection contact={contact} />

			<LegalMentions contact={contact} />
		</>
	);
};

export default AboutPage;
