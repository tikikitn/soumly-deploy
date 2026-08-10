import type { Metadata } from "next";
import { ProductScreen } from "../../_components/DetailScreens";
import { getProduct } from "../../_data/products.server";

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
	const description =
		product.description ||
		`${product.name} — Comparez les prix chez ${product.stores} boutiques tunisiennes.`;

	return {
		title: `${product.name} – Comparer les prix | Soumly`,
		description,
		alternates: { canonical: url },
		openGraph: {
			title: `${product.name} à partir de ${product.price} DT | Soumly`,
			description,
			url,
			type: "website",
			images: product.image ? [{ url: product.image, width: 250, height: 250 }] : [],
			siteName: "Soumly",
			locale: "fr_TN",
		},
		twitter: {
			card: "summary_large_image",
			title: `${product.name} | Soumly`,
			description,
			images: product.image ? [product.image] : [],
		},
	};
}

export default function ProductPage() {
	return <ProductScreen />;
}
