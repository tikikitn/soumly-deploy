import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryListingView, FamilyListingView } from "../../_components/ListingViews";
import { formatPrice, type PaginatedProducts } from "../../_data/content.shared";
import {
	getCategory,
	getCategoryInsights,
	getCategoryProducts,
	getFamilies,
	getFamilyInsights,
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

function listingJsonLd(slug: string, label: string, result: PaginatedProducts, page: number) {
	const BASE_URL = "https://soumly.online";
	const breadcrumb = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{ "@type": "ListItem", position: 1, name: "Accueil", item: `${BASE_URL}/` },
			{
				"@type": "ListItem",
				position: 2,
				name: label,
				item:
					page > 1
						? `${BASE_URL}/categories/${slug}?page=${page}`
						: `${BASE_URL}/categories/${slug}`,
			},
		],
	};
	const itemList = {
		"@context": "https://schema.org",
		"@type": "CollectionPage",
		name: label,
		url: page > 1 ? `${BASE_URL}/categories/${slug}?page=${page}` : `${BASE_URL}/categories/${slug}`,
		mainEntity: {
			"@type": "ItemList",
			itemListOrder: "https://schema.org/ItemListOrderDescending",
			numberOfItems: result.products.length,
			itemListElement: result.products.map((p, i) => ({
				"@type": "ListItem",
				position: i + 1,
				url: `${BASE_URL}/produit/${p.id}`,
				name: p.name,
			})),
		},
	};
	return { breadcrumb, itemList };
}

function JsonLd({ data }: { data: object }) {
	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
		/>
	);
}

function CategoryFacts({ label, insight }: { label: string; insight: ReturnType<typeof getCategoryInsights> }) {
	if (insight.productCount === 0) return null;
	return (
		<section className="sm-page-shell sm-category-facts" aria-label={`Données actuelles de la catégorie ${label}`}>
			<span className="sm-section-kicker">Données actuelles</span>
			<h2>{label} sur Soumly</h2>
			<p>
				Cette catégorie contient actuellement <strong>{insight.productCount} produits</strong> proposés par <strong>{insight.boutiqueCount} boutiques</strong>
				{insight.minPrice !== null && insight.maxPrice !== null
					? <> , avec des prix allant de <strong>{formatPrice(insight.minPrice)}</strong> à <strong>{formatPrice(insight.maxPrice)}</strong>.</>
					: "."}
			</p>
			{insight.topBrands.length > 0 ? <p>Marques les plus représentées : {insight.topBrands.join(", ")}.</p> : null}
		</section>
	);
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
			robots: page > 1 ? { index: false, follow: true } : { index: true, follow: true },
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
		robots: page > 1 ? { index: false, follow: true } : { index: true, follow: true },
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
		const { breadcrumb, itemList } = listingJsonLd(family.slug, family.label, result, page);
		const insight = getFamilyInsights(family.slug);
		return (
			<>
				<JsonLd data={breadcrumb} />
				<JsonLd data={itemList} />
				<CategoryFacts label={family.label} insight={insight} />
				<FamilyListingView family={family} result={result} slug={slug} />
			</>
		);
	}

	const category = getCategory(slug);
	if (!category) notFound();

	const result = getCategoryProducts({ slug, page, sort });
	if (page > result.totalPages) notFound();
	const { breadcrumb, itemList } = listingJsonLd(category.slug, category.label, result, page);
	const insight = getCategoryInsights(category.slug);
	return (
		<>
			<JsonLd data={breadcrumb} />
			<JsonLd data={itemList} />
			<CategoryFacts label={category.label} insight={insight} />
			<CategoryListingView category={category} result={result} slug={slug} />
		</>
	);
}
