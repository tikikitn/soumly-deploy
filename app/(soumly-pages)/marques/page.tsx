import type { Metadata } from "next";
import { BrandIndexView } from "../_components/BrandViews";
import { getApprovedBrands } from "../_data/products.server";

export const metadata: Metadata = {
	title: "Marques – Comparateur de prix | Soumly",
	description:
		"Découvrez toutes les marques comparées par Soumly : Samsung, Apple, Xiaomi, HP, Lenovo et plus. Comparez les prix en Tunisie.",
	alternates: { canonical: "https://soumly.online/marques" },
};

export default function BrandsIndexPage() {
	const brands = getApprovedBrands();
	return <BrandIndexView brands={brands} />;
}
