import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BrandView } from "../../_components/BrandViews";
import { getBrandPageData, getBrandProducts, isApprovedBrand } from "../../_data/products.server";

const BASE = "https://soumly.online";

type PageProps = {
	params: Promise<{ brand: string }>;
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
	const { brand } = await params;
	const sp = await searchParams;
	const page = parsePage(sp.page);
	if (!isApprovedBrand(brand)) return { title: "Marque introuvable" };
	const data = getBrandPageData(brand);
	if (!data) return { title: "Marque introuvable" };
	const url = page > 1 ? `${BASE}/marques/${brand}?page=${page}` : `${BASE}/marques/${brand}`;
	return {
		title: `Prix ${data.label} en Tunisie – Comparateur de prix | Soumly`,
		description: `Comparez les prix ${data.label} en Tunisie sur Soumly. Découvrez les offres disponibles auprès de ${data.storeCount} boutiques et trouvez le meilleur prix.`,
		alternates: { canonical: url },
	};
}

export default async function BrandPage({ params, searchParams }: PageProps) {
	const { brand } = await params;
	const sp = await searchParams;
	const page = parsePage(sp.page);
	if (!isApprovedBrand(brand)) notFound();
	const data = getBrandPageData(brand);
	if (!data) notFound();
	const result = getBrandProducts({ slug: brand, page });
	if (!result) notFound();
	if (page > result.totalPages) notFound();
	return <BrandView brand={data} result={result} />;
}
