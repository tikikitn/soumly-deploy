import type { Metadata } from "next";
import { CategoryScreen, FamilyScreen } from "../../_components/ListingScreens";
import { getCategory, getFamilies } from "../../_data/products.server";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;
	const family = getFamilies().find((f) => f.slug === slug);
	if (family)
		return {
			title: `${family.label} – Comparer les prix`,
			description: `${family.label} : ${family.categoryCount} catégories, ${family.productCount} produits.`,
		};
	const category = getCategory(slug);
	return category
		? { title: `${category.label} – Comparer les prix`, description: category.note }
		: { title: "Catégorie introuvable" };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const isFamily = getFamilies().some((f) => f.slug === slug);
	return isFamily ? <FamilyScreen /> : <CategoryScreen />;
}
