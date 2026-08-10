import type { Metadata } from "next";
import { CategoryListingView, FamilyListingView } from "../../_components/ListingViews";
import {
	getCategory,
	getCategoryProducts,
	getFamilies,
	getFamilyProducts,
} from "../../_data/products.server";

type PageProps = {
	params: Promise<{ slug: string }>;
	searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function parsePage(value: unknown): number {
	if (typeof value === "string" && /^\d+$/.test(value)) {
		const page = Number.parseInt(value, 10);
		if (page > 0) return page;
	}
	return 1;
}

function parseSort(value: unknown): string {
	if (
		typeof value === "string" &&
		["price-asc", "price-desc", "discount", "name"].includes(value)
	) {
		return value;
	}
	return "name";
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { slug } = await params;
	const family = getFamilies().find((f) => f.slug === slug);
	if (family) {
		return {
			title: `${family.label} – Comparer les prix`,
			description: `${family.label} : ${family.categoryCount} catégories, ${family.productCount} produits.`,
		};
	}
	const category = getCategory(slug);
	return category
		? { title: `${category.label} – Comparer les prix`, description: category.note }
		: { title: "Catégorie introuvable" };
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
	const { slug } = await params;
	const sp = await searchParams;
	const page = parsePage(sp.page);
	const sort = parseSort(sp.sort);

	const families = getFamilies();
	const isFamily = families.some((f) => f.slug === slug);

	if (isFamily) {
		const family = families.find((f) => f.slug === slug)!;
		const result = getFamilyProducts({ slug, page, sort });
		return <FamilyListingView family={family} result={result} slug={slug} />;
	}

	const category = getCategory(slug);
	if (!category) {
		return (
			<div style={{ padding: "4rem 1.5rem", textAlign: "center" }}>
				<h1>Catégorie introuvable</h1>
				<p>Cette catégorie n&rsquo;existe pas.</p>
			</div>
		);
	}

	const result = getCategoryProducts({ slug, page, sort });
	return <CategoryListingView category={category} result={result} slug={slug} />;
}
