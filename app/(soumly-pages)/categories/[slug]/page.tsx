import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryListingView, FamilyListingView } from "../../_components/ListingViews";
import {
	getCategory,
	getCategoryProducts,
	getFamilies,
	getFamilyProducts,
} from "../../_data/products.server";

const BASE = "https://soumly.online";

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
		["price-asc", "price-desc", "discount", "popular", "name"].includes(value)
	) {
		return value;
	}
	return "popular";
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
	const { slug } = await params;
	const sp = await searchParams;
	const family = getFamilies().find((f) => f.slug === slug);
	const page = parsePage(sp.page);

	if (family) {
		const url =
			page > 1
				? `${BASE}/categories/${family.slug}?page=${page}`
				: `${BASE}/categories/${family.slug}`;
		return {
			title: `${family.label} – Comparer les prix`,
			description: `${family.label} : ${family.categoryCount} catégories, ${family.productCount} produits.`,
			alternates: { canonical: url },
		};
	}
	const category = getCategory(slug);
	if (!category) return { title: "Catégorie introuvable" };
	const url =
		page > 1
			? `${BASE}/categories/${category.slug}?page=${page}`
			: `${BASE}/categories/${category.slug}`;
	return {
		title: `${category.label} – Comparer les prix`,
		description: category.note,
		alternates: { canonical: url },
	};
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
		// Out-of-range pages must not create duplicate crawlable URLs:
		// page > totalPages → real 404 (prevents ?page=999 clones).
		if (page > result.totalPages) notFound();
		return <FamilyListingView family={family} result={result} slug={slug} />;
	}

	const category = getCategory(slug);
	if (!category) notFound();

	const result = getCategoryProducts({ slug, page, sort });
	if (page > result.totalPages) notFound();
	return <CategoryListingView category={category} result={result} slug={slug} />;
}
