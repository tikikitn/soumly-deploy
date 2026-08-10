import type { Metadata } from "next";
import { ProductScreen } from "../../_components/DetailScreens";
import { getProduct } from "../../_data/content";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  return product
    ? { title: `${product.name} – Comparer les prix`, description: product.description }
    : { title: "Produit introuvable" };
}

export default function ProductPage() {
  return <ProductScreen />;
}
