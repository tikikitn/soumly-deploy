import type { Metadata } from "next";
import { CategoryScreen } from "../../_components/ListingScreens";

export const metadata: Metadata = { title: "Produits par catégorie" };

export default function CategoryPage() {
  return <CategoryScreen />;
}
