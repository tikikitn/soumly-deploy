import type { Metadata } from "next";
import { ProductScreen } from "../../_components/DetailScreens";

export const metadata: Metadata = { title: "Comparer les prix du produit" };

export default function ProductPage() {
  return <ProductScreen />;
}
