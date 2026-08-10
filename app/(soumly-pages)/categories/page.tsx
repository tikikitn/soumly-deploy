import type { Metadata } from "next";
import { CategoriesScreen } from "../_components/ListingScreens";

export const metadata: Metadata = { title: "Toutes les catégories" };

export default function CategoriesPage() {
	return <CategoriesScreen />;
}
