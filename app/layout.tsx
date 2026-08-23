import type { Metadata, Viewport } from "next";
import "./globals.css";
import Analytics from "./components/analytics";

export const metadata: Metadata = {
	title: "Soumly – Comparateur de prix en Tunisie",
	description:
		"Comparez les prix des smartphones, ordinateurs et produits du quotidien auprès des boutiques tunisiennes.",
	icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	themeColor: "#ffffff",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="fr" dir="ltr" suppressHydrationWarning>
			<head>
				<link rel="preconnect" href="https://cdn.primini.tn" crossOrigin="anonymous" />
			</head>
			<body suppressHydrationWarning>
				{children}
				<Analytics />
			</body>
		</html>
	);
}
