import "@/styles/globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
	const locale = await getLocale();
	return (
		<html lang={locale}>
			<body>
				<NextIntlClientProvider>{children}</NextIntlClientProvider>
			</body>
		</html>
	);
};

export { RootLayout as default };
