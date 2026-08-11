import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BrandCategoryView } from "../../../_components/BrandViews";
import { getBrandCategoryData, getCategory, isApprovedBrand } from "../../../_data/products.server";

const BASE = "https://soumly.online";

type PageProps = {
	params: Promise<{ brand: string; category: string }>;
	searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function parsePage(value: unknown): number {
	if (typeof value === "string" && /^\d+$/.test(value)) {
		const page = Number.parseInt(value, 10);
		if (page > 0) return page;
	}
	return 1;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
	const { brand, category } = await params;
	const sp = await searchParams;
	const page = parsePage(sp.page);
	if (!isApprovedBrand(brand)) return { title: "Marque introuvable" };
	const categoryDef = getCategory(category);
	if (!categoryDef) return { title: "Catégorie introuvable" };
	const data = getBrandCategoryData({ brand, category, page: 1 });
	if (!data) return { title: "Page introuvable" };
	const url =
		page > 1
			? `${BASE}/marques/${brand}/${category}?page=${page}`
			: `${BASE}/marques/${brand}/${category}`;
	return {
		title: `Prix des ${data.categoryLabel.toLowerCase()} ${data.brandLabel} en Tunisie – Soumly`,
		description: `Comparez les prix des ${data.categoryLabel.toLowerCase()} ${data.brandLabel} en Tunisie sur Soumly. Découvrez les meilleures offres et trouvez le meilleur prix.`,
		alternates: { canonical: url },
	};
}

export default async function BrandCategoryPage({ params, searchParams }: PageProps) {
	const { brand, category } = await params;
	const sp = await searchParams;
	const page = parsePage(sp.page);
	if (!isApprovedBrand(brand)) notFound();
	const categoryDef = getCategory(category);
	if (!categoryDef) notFound();
	const data = getBrandCategoryData({ brand, category, page });
	if (!data) notFound();
	if (page > data.data.totalPages) notFound();
	return (
		<BrandCategoryView
			brandSlug={brand}
			brandLabel={data.brandLabel}
			category={categoryDef}
			categoryLabel={data.categoryLabel}
			result={data.data}
		/>
	);
}
