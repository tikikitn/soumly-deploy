// Soumly homepage — SERVER COMPONENT.
// Prepares all rails/offers/popular server-side and passes only the
// displayed products (ProductSummary) to the client shell.
import type { Metadata } from "next";
import { getHomepageData } from "./(soumly-pages)/_data/products.server";
import HomeClient from "./HomeClient";

const BASE_URL = "https://soumly.online";
const OG_IMAGE = `${BASE_URL}/og-image-v3.png`;

export const metadata: Metadata = {
	title: "Soumly – Comparateur de prix en Tunisie",
	description:
		"Comparez les prix des smartphones, ordinateurs, électroménager et produits du quotidien auprès des boutiques tunisiennes.",
	alternates: { canonical: `${BASE_URL}/` },
	openGraph: {
		title: "Soumly – Comparateur de prix en Tunisie",
		description:
			"Comparez les prix des smartphones, ordinateurs, électroménager et produits du quotidien auprès des boutiques tunisiennes.",
		url: `${BASE_URL}/`,
		siteName: "Soumly",
		locale: "fr_TN",
		type: "website",
		images: [
			{
				url: OG_IMAGE,
				secureUrl: OG_IMAGE,
				width: 1200,
				height: 630,
				alt: "Soumly – Comparateur de prix en Tunisie",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Soumly – Comparateur de prix en Tunisie",
		description:
			"Comparez les prix des smartphones, ordinateurs, électroménager et produits du quotidien auprès des boutiques tunisiennes.",
		images: [OG_IMAGE],
	},
};

export default function HomePage() {
	const data = getHomepageData();
	return <HomeClient data={data} />;
}
