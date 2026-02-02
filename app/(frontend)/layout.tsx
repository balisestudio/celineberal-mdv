import type React from "react";
import "@/styles/globals.css";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	);
};

export { RootLayout as default };
