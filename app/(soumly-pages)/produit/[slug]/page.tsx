import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetailView } from "../../_components/ProductDetailView";
import {
	APPROVED_BRANDS,
	detectBrand,
	getProduct,
	relatedProducts,
} from "../../_data/products.server";
import { getTreatmentContent } from "../../_data/indexation-experiment";

const BASE = "https://soumly.online";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;
	const product = getProduct(slug);
	if (!product) return { title: "Produit introuvable" };

	const url = `${BASE}/produit/${slug}`;
	const treatment = getTreatmentContent(product);
	const description = treatment?.metaDescription ||
		product.description ||
		`${product.name} — Comparez les prix chez ${product.stores} boutiques tunisiennes.`;

	return {
		title: treatment ? `${product.name} – ${product.category}` : `${product.name} – Comparer les prix`,
		description,
		robots: treatment ? { index: true, follow: true } : undefined,
		alternates: { canonical: url },
		openGraph: {
			title: `${product.name} à partir de ${product.price} DT`,
			description,
			url,
			type: "website",
			images: product.image ? [{ url: product.image, width: 250, height: 250 }] : [],
			siteName: "Soumly",
			locale: "fr_TN",
		},
		twitter: {
			card: "summary_large_image",
			title: `${product.name}`,
			description,
			images: product.image ? [product.image] : [],
		},
	};
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const product = getProduct(slug);
	if (!product) notFound();
	const related = relatedProducts(product, 4);
	const brandSlug = detectBrand(product.name);
	const brandLabel = brandSlug ? APPROVED_BRANDS[brandSlug].label : null;
	const treatment = getTreatmentContent(product);
	return (
		<ProductDetailView
			product={product}
			related={related}
			brandSlug={brandSlug}
			brandLabel={brandLabel}
			treatment={treatment}
		/>
	);
}
