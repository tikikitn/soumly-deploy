import type { Metadata } from "next";
import { SearchResultsView } from "../_components/SearchResultsView";
import { searchProductsPaginated } from "../_data/products.server";

// Search results are internal query surfaces with near-infinite URL
// combinations — tell crawlers to index nothing but keep following links
// to product pages (which carry their own canonical + index directives).
export const metadata: Metadata = {
	title: "Recherche",
	robots: { index: false, follow: true },
};

type PageProps = {
	searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function parsePage(value: unknown): number {
	if (typeof value === "string" && /^\d+$/.test(value)) {
		const page = Number.parseInt(value, 10);
		if (page > 0) return page;
	}
	return 1;
}

export default async function SearchPage({ searchParams }: PageProps) {
	const sp = await searchParams;
	const rawQuery = typeof sp.q === "string" ? sp.q : "";
	const merchant = typeof sp.boutique === "string" ? sp.boutique : "";
	const page = parsePage(sp.page);
	const result = searchProductsPaginated({ query: rawQuery, page, pageSize: 36 });

	return (
		<SearchResultsView
			query={rawQuery}
			results={result.products}
			total={result.total}
			page={result.page}
			totalPages={result.totalPages}
			merchant={merchant}
		/>
	);
}
