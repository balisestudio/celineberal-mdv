import Image from "next/image";
import { getTranslations } from "next-intl/server";

const AuctionsEmpty = async ({
	iconSrc,
	iconAlt,
}: {
	iconSrc: string;
	iconAlt: string;
}) => {
	const t = await getTranslations("ventes");

	return (
		<div className="py-24 flex flex-col items-center gap-4 text-center">
			{iconSrc && <Image src={iconSrc} alt={iconAlt} width={64} height={64} />}
			<p className="text-muted text-sm">{t("empty")}</p>
		</div>
	);
};

export { AuctionsEmpty };
