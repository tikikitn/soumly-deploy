// Soumly listing views (client) — receive data as props from Server Components.
// MUST NOT import products.ts / products.server.ts / the full catalog.
"use client";

import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import Link from "../../components/NativeLink";
import type {
	Category,
	Family,
	PaginatedProducts,
	Product,
	ProductSummary,
} from "../_data/content.shared";
import { ProductCard, SoumlyIcon } from "./ui";

function Breadcrumbs({ current, parent }: { current: string; parent?: string }) {
	return (
		<nav className="sm-breadcrumbs" aria-label="Fil d’Ariane">
			<Link href="/">Accueil</Link>
			<span className="sm-crumb">
				<i>/</i>
				{parent ? <Link href="/categories">{parent}</Link> : <strong>{current}</strong>}
			</span>
			{parent ? (
				<span className="sm-crumb">
					<i>/</i>
					<strong>{current}</strong>
				</span>
			) : null}
		</nav>
	);
}

function sortProducts(items: ProductSummary[], sort: string) {
	const result = [...items];
	if (sort === "price-asc") return result.sort((a, b) => a.price - b.price);
	if (sort === "price-desc") return result.sort((a, b) => b.price - a.price);
	if (sort === "discount") return result.sort((a, b) => b.discount - a.discount);
	if (sort === "popular") {
		return result.sort(
			(a, b) => b.stores - a.stores || b.discount - a.discount || a.price - b.price,
		);
	}
	return result.sort((a, b) => a.name.localeCompare(b.name, "fr"));
}

// Renders ProductSummary cards — ProductCard expects a Product, so adapt.
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

function Pagination({
	page,
	totalPages,
	slug,
	sort,
}: {
	page: number;
	totalPages: number;
	slug: string;
	sort: string;
}) {
	if (totalPages <= 1) return null;
	const pages: number[] = [];
	const start = Math.max(1, page - 2);
	const end = Math.min(totalPages, page + 2);
	for (let i = start; i <= end; i += 1) pages.push(i);
	const sortPart = sort !== "name" ? `&sort=${sort}` : "";
	return (
		<nav className="sm-pagination" aria-label="Pagination">
			{page > 1 ? (
				<Link href={`/categories/${slug}?page=${page - 1}${sortPart}`} className="sm-page-link">
					← Précédent
				</Link>
			) : null}
			{pages.map((p) => (
				<Link
					key={p}
					href={`/categories/${slug}?page=${p}${sortPart}`}
					className={`sm-page-link${p === page ? " is-current" : ""}`}
					aria-current={p === page ? "page" : undefined}
				>
					{p}
				</Link>
			))}
			{page < totalPages ? (
				<Link href={`/categories/${slug}?page=${page + 1}${sortPart}`} className="sm-page-link">
					Suivant →
				</Link>
			) : null}
		</nav>
	);
}

export function CategoryListingView({
	category,
	result,
	slug,
}: {
	category: Category;
	result: PaginatedProducts;
	slug: string;
}) {
	return (
		<>
			<section className="sm-page-shell sm-listing-intro">
				<Breadcrumbs current={category.label} parent="Catégories" />
				<div className="sm-listing-title-row">
					<div>
						<span className="sm-category-icon is-large">
							<SoumlyIcon name={category.icon} size={35} />
						</span>
						<div>
							<h1>{category.label}</h1>
							<p>{category.note}. Comparez uniquement des références équivalentes.</p>
						</div>
					</div>
					<span className="sm-result-pill">{result.total} produits</span>
				</div>
			</section>
			<Catalog
				baseProducts={result.products}
				page={result.page}
				totalPages={result.totalPages}
				slug={slug}
			/>
		</>
	);
}

export function FamilyListingView({
	family,
	result,
	slug,
}: {
	family: Family & { categoryCount: number; productCount: number };
	result: PaginatedProducts;
	slug: string;
}) {
	return (
		<>
			<section className="sm-page-shell sm-listing-intro">
				<Breadcrumbs current={family.label} parent="Catégories" />
				<div className="sm-listing-title-row">
					<div>
						<span className="sm-category-icon is-large">
							<SoumlyIcon name={family.icon} size={35} />
						</span>
						<div>
							<h1>{family.label}</h1>
							<p>
								{family.categoryCount} catégories,{" "}
								{new Intl.NumberFormat("fr-FR").format(family.productCount)} produits.
							</p>
						</div>
					</div>
					<span className="sm-result-pill">{result.total} produits</span>
				</div>
			</section>
			<Catalog
				baseProducts={result.products}
				page={result.page}
				totalPages={result.totalPages}
				slug={slug}
			/>
		</>
	);
}

function Catalog({
	baseProducts,
	page,
	totalPages,
	slug,
}: {
	baseProducts: ProductSummary[];
	page: number;
	totalPages: number;
	slug: string;
}) {
	const [sort, setSort] = useState("name");
	const sorted = sortProducts(baseProducts, sort);
	return (
		<section className="sm-page-shell sm-catalog-layout">
			<div className="sm-catalog-results">
				<div className="sm-results-toolbar">
					<span>
						{sorted.length} résultat{sorted.length > 1 ? "s" : ""}
					</span>
					<label>
						Trier par{" "}
						<select value={sort} onChange={(event) => setSort(event.target.value)}>
							<option value="popular">Pertinence</option>
							<option value="price-asc">Prix croissant</option>
							<option value="price-desc">Prix décroissant</option>
							<option value="discount">Réduction</option>
						</select>
						<ChevronDown size={15} />
					</label>
				</div>
				{sorted.length ? (
					<div className="sm-product-grid sm-grid-three">
						{sorted.map((product) => (
							<SummaryCard product={product} key={product.id} />
						))}
					</div>
				) : (
					<div className="sm-no-results">
						<SlidersHorizontal size={32} />
						<h2>Aucun produit trouvé</h2>
						<p>Modifiez vos filtres pour afficher plus de résultats.</p>
					</div>
				)}
				<Pagination page={page} totalPages={totalPages} slug={slug} sort={sort} />
			</div>
		</section>
	);
}
