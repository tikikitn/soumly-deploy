// Universe page — server component. Shows sub-universes + popular categories
// + a few representative products per sub-universe (server-side, lightweight).
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CATALOG_UNIVERSES, getUniverse } from "../../../../lib/catalog-navigation";
import { UniverseView } from "../../_components/UniverseView";
import {
	getCategory,
	getCategoryProducts,
	getProductsByCategories,
} from "../../_data/products.server";

export function generateStaticParams() {
	return CATALOG_UNIVERSES.map((universe) => ({ slug: universe.slug }));
}

export async function generateMetadata({
	params,
}: {
	params: { slug: string };
}): Promise<Metadata> {
	const universe = getUniverse(params.slug);
	if (!universe) return { title: "Univers introuvable" };
	return {
		title: `${universe.label} — Comparer les prix`,
		description: `Retrouvez les produits ${universe.label} des boutiques tunisiennes : ${universe.tagline}.`,
		alternates: { canonical: `https://soumly.online/univers/${universe.slug}` },
	};
}

export default function UniversePage({ params }: { params: { slug: string } }) {
	const universe = getUniverse(params.slug);
	if (!universe) notFound();

	// For each sub-universe: label + first few category labels + a small
	// product sample (server-side, keeps client payload light).
	const subUniverses = universe.subUniverses.map((sub) => {
		const categories = sub.categorySlugs
			.map((slug) => getCategory(slug))
			.filter((c): c is NonNullable<ReturnType<typeof getCategory>> => Boolean(c));
		const categoryCount = sub.categorySlugs.length;
		const productCount = sub.categorySlugs.reduce(
			(total, slug) => total + (getCategoryProducts({ slug, pageSize: 1 }).total || 0),
			0,
		);
		const sampleProducts = getProductsByCategories(sub.categorySlugs, 4);
		return {
			slug: sub.slug,
			label: sub.label,
			categories: categories.slice(0, 8).map((c) => ({ slug: c.slug, label: c.label })),
			categoryCount,
			productCount,
			sampleProducts,
		};
	});

	const totalCategories = universe.subUniverses.reduce(
		(total, sub) => total + sub.categorySlugs.length,
		0,
	);
	const totalProducts = subUniverses.reduce((total, sub) => total + sub.productCount, 0);

	return (
		<UniverseView
			universe={{
				slug: universe.slug,
				label: universe.label,
				tagline: universe.tagline,
			}}
			subUniverses={subUniverses}
			totalCategories={totalCategories}
			totalProducts={totalProducts}
		/>
	);
}
