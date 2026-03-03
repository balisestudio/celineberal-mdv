import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import type { Contact as ContactType } from "@/payload-types";

export const LegalMentions = ({ contact }: { contact: ContactType | null }) => {
	const t = useTranslations("footer");
	if (!contact) return null;
	return (
		<section className="border-t border-sand py-8">
			<Container>
				<p className="text-xs text-muted">
					{t("legal", {
						siret: contact?.siret,
						rcs: contact?.rcs,
						capitalSocial: contact?.capitalSocial,
						agrement: contact?.agrement,
					})}
				</p>
			</Container>
		</section>
	);
};
