// Soumly homepage — SERVER COMPONENT.
// Prepares all rails/offers/popular server-side and passes only the
// displayed products (ProductSummary) to the client shell.

import { getHomepageData } from "./(soumly-pages)/_data/products.server";
import HomeClient from "./HomeClient";

export default function HomePage() {
	const data = getHomepageData();
	return <HomeClient data={data} />;
}
