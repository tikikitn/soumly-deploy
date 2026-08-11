// Soumly search results view (client) — receives results as props.
// MUST NOT import products.ts / products.server.ts / the full catalog.
"use client";

import { ChevronDown, Search } from "lucide-react";
import { useState } from "react";
import Link from "../../components/NativeLink";
import type { Product, ProductSummary } from "../_data/content.shared";
import { EmptyState, ProductCard } from "./ui";

function Breadcrumbs({ current }: { current: string }) {
	return (
		<nav className="sm-breadcrumbs" aria-label="Fil d’Ariane">
			<Link href="/">Accueil</Link>
			<span className="sm-crumb">
				<i>/</i>
				<strong>{current}</strong>
			</span>
		</nav>
	);
}

function SummaryCard({ product }: { product: ProductSummary }) {
	const full: Product = {
		id: product.id,
		name: product.name,
		brand: "",
		category: product.category,
		categorySlug: product.categorySlug,
		image: product.image,
		price: product.price,
		oldPrice: product.oldPrice,
		rating: 0,
		reviews: 0,
		stores: product.stores,
		discount: product.discount,
		badge: product.badge,
		tag: product.tag,
		description: "",
		specs: [],
		offers: [],
	};
	return <ProductCard product={full} />;
}

function SearchPagination({
	page,
	totalPages,
	query,
	sort,
}: {
	page: number;
	totalPages: number;
	query: string;
	sort: string;
}) {
	if (totalPages <= 1) return null;
	const pages: number[] = [];
	const start = Math.max(1, page - 2);
	const end = Math.min(totalPages, page + 2);
	for (let i = start; i <= end; i += 1) pages.push(i);
	const sortPart = sort !== "relevance" ? `&sort=${sort}` : "";
	const base = `/recherche?q=${encodeURIComponent(query)}`;
	return (
		<nav className="sm-pagination" aria-label="Pagination">
			{page > 1 ? (
				<Link href={`${base}&page=${page - 1}${sortPart}`} className="sm-page-link">
					← Précédent
				</Link>
			) : null}
			{pages.map((p) => (
				<Link
					key={p}
					href={`${base}&page=${p}${sortPart}`}
					className={`sm-page-link${p === page ? " is-current" : ""}`}
					aria-current={p === page ? "page" : undefined}
				>
					{p}
				</Link>
			))}
			{page < totalPages ? (
				<Link href={`${base}&page=${page + 1}${sortPart}`} className="sm-page-link">
					Suivant →
				</Link>
			) : null}
		</nav>
	);
}

export function SearchResultsView({
	query,
	results,
	total,
	page,
	totalPages,
	merchant,
}: {
	query: string;
	results: ProductSummary[];
	total: number;
	page: number;
	totalPages: number;
	merchant: string;
}) {
	const [sort, setSort] = useState("relevance");
	const title = merchant
		? `Produits chez ${merchant}`
		: query
			? `Résultats pour « ${query} »`
			: "Tout le catalogue";

	const sorted = [...results];
	if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
	else if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
	else if (sort === "discount") sorted.sort((a, b) => b.discount - a.discount);

	return (
		<>
			<section className="sm-search-hero">
				<div className="sm-page-shell">
					<Breadcrumbs current="Résultats de recherche" />
					<h1>{title}</h1>
					<p>
						{total} produit{total > 1 ? "s" : ""} correspondant{total > 1 ? "s" : ""}.
					</p>
					<form className="sm-big-search" action="/recherche" method="get">
						<Search size={22} />
						<input
							defaultValue={query}
							name="q"
							placeholder="Ex. Lenovo V15, écran MSI…"
							aria-label="Rechercher"
						/>
						<button type="submit">Rechercher</button>
					</form>
					<div className="sm-quick-search">
						<span>Recherches suggérées :</span>
						{["Lenovo V15", "iPhone", "écran MSI", "climatiseur"].map((item) => (
							<Link key={item} href={`/recherche?q=${encodeURIComponent(item)}`}>
								{item}
							</Link>
						))}
					</div>
				</div>
			</section>
			{results.length ? (
				<section className="sm-page-shell sm-catalog-layout">
					<div className="sm-catalog-results">
						<div className="sm-results-toolbar">
							<span>
								{total} résultat{total > 1 ? "s" : ""}
							</span>
							<label>
								Trier par{" "}
								<select value={sort} onChange={(event) => setSort(event.target.value)}>
									<option value="relevance">Pertinence</option>
									<option value="price-asc">Prix croissant</option>
									<option value="price-desc">Prix décroissant</option>
									<option value="discount">Réduction</option>
								</select>
								<ChevronDown size={15} />
							</label>
						</div>
						<div className="sm-product-grid sm-grid-three">
							{sorted.map((product) => (
								<SummaryCard product={product} key={product.id} />
							))}
						</div>
						<SearchPagination page={page} totalPages={totalPages} query={query} sort={sort} />
					</div>
				</section>
			) : (
				<EmptyState
					title="Aucun résultat"
					text="Essayez une référence plus courte ou parcourez les catégories."
					action="Voir les catégories"
					href="/categories"
				/>
			)}
		</>
	);
}
