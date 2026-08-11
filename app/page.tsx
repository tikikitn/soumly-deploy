// Soumly homepage — SERVER COMPONENT.
// Prepares all rails/offers/popular server-side and passes only the
// displayed products (ProductSummary) to the client shell.
import type { Metadata } from "next";
import { getHomepageData } from "./(soumly-pages)/_data/products.server";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
	title: "Soumly – Comparateur de prix en Tunisie",
	description:
		"Comparez les prix des smartphones, ordinateurs et produits du quotidien auprès des boutiques tunisiennes.",
	alternates: { canonical: "https://soumly.online/" },
};

export default function HomePage() {
	const data = getHomepageData();
	return <HomeClient data={data} />;
}
