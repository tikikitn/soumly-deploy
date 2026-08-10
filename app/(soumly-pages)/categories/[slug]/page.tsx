import type { Metadata } from "next";
import { CategoryScreen } from "../../_components/ListingScreens";
import { getCategory } from "../../_data/content";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  return category ? { title: `${category.label} – Comparer les prix`, description: category.note } : { title: "Catégorie introuvable" };
}

export default function CategoryPage() {
  return <CategoryScreen />;
}
