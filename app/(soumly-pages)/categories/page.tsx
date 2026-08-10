import type { Metadata } from "next";
import { CategoriesListingView } from "../_components/CategoriesListingView";
import { getCategoryStats } from "../_data/products.server";

export const metadata: Metadata = { title: "Toutes les catégories" };

export default function CategoriesPage() {
	const stats = getCategoryStats();
	return <CategoriesListingView {...stats} />;
}
