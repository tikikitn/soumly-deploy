// Soumly brand views (client) — receive data as props from Server Components.
// MUST NOT import products.ts / products.server.ts / the full catalog.
"use client";

import { Sparkles } from "lucide-react";
import Link from "../../components/NativeLink";
import type { Category } from "../_data/content.shared";
import { formatPrice, type Product, type ProductSummary } from "../_data/content.shared";
import { ProductCard, SoumlyIcon } from "./ui";

function Breadcrumbs({ items }: { items: Array<{ label: string; href?: string }> }) {
	return (
		<nav className="sm-breadcrumbs" aria-label="Fil d’Ariane">
			<Link href="/">Accueil</Link>
			{items.map((item) => (
				<span className="sm-crumb" key={item.label}>
					<i>/</i>
					{item.href ? <Link href={item.href}>{item.label}</Link> : <strong>{item.label}</strong>}
				</span>
			))}
		</nav>
	);
}

function summaryToProduct(summary: ProductSummary): Product {
	return {
		id: summary.id,
		name: summary.name,
		brand: "",
		category: summary.category,
		categorySlug: summary.categorySlug,
		image: summary.image,
		price: summary.price,
		oldPrice: summary.oldPrice,
		rating: 0,
		reviews: 0,
		stores: summary.stores,
		discount: summary.discount,
		badge: summary.badge,
		tag: summary.tag,
		description: "",
		specs: [],
		offers: [],
	};
}

function Pagination({
	page,
	totalPages,
	base,
}: {
	page: number;
	totalPages: number;
	base: string;
}) {
	if (totalPages <= 1) return null;
	const pages: number[] = [];
	const start = Math.max(1, page - 2);
	const end = Math.min(totalPages, page + 2);
	for (let i = start; i <= end; i += 1) pages.push(i);
	return (
		<nav className="sm-pagination" aria-label="Pagination">
			{page > 1 ? (
				<Link href={`${base}?page=${page - 1}`} className="sm-page-link">
					← Précédent
				</Link>
			) : null}
			{pages.map((p) => (
				<Link
					key={p}
					href={`${base}?page=${p}`}
					className={`sm-page-link${p === page ? " is-current" : ""}`}
					aria-current={p === page ? "page" : undefined}
				>
					{p}
				</Link>
			))}
			{page < totalPages ? (
				<Link href={`${base}?page=${page + 1}`} className="sm-page-link">
					Suivant →
				</Link>
			) : null}
		</nav>
	);
}

export function BrandIndexView({
	brands,
}: {
	brands: Array<{
		slug: string;
		label: string;
		productCount: number;
		offerCount: number;
		storeCount: number;
	}>;
}) {
	return (
		<>
			<section className="sm-page-shell sm-inner-hero sm-categories-hero">
				<div>
					<Breadcrumbs items={[{ label: "Marques" }]} />
					<span className="sm-eyebrow">
						<Sparkles size={15} /> Catalogue par marque
					</span>
					<h1>Marques disponibles sur Soumly</h1>
					<p>
						Comparez les prix des grandes marques en Tunisie : {brands.length} marques référencées.
					</p>
				</div>
			</section>
			<section className="sm-page-shell sm-section-block">
				<div className="sm-category-grid">
					{brands.map((brand, index) => (
						<Link
							className={`sm-category-card tone-${(index % 4) + 1}`}
							href={`/marques/${brand.slug}`}
							key={brand.slug}
						>
							<span className="sm-category-icon">
								<SoumlyIcon name="Tag" size={30} />
							</span>
							<div>
								<h3>{brand.label}</h3>
								<p>{brand.productCount} produits</p>
								<strong>{brand.storeCount} boutiques</strong>
							</div>
							<span className="sm-round-arrow">→</span>
						</Link>
					))}
				</div>
			</section>
		</>
	);
}

export function BrandView({
	brand,
	result,
}: {
	brand: {
		slug: string;
		label: string;
		productCount: number;
		offerCount: number;
		storeCount: number;
		minPrice: number;
		maxPrice: number;
		categories: Array<{ slug: string; label: string; count: number }>;
		deals: ProductSummary[];
	};
	result: {
		products: ProductSummary[];
		total: number;
		page: number;
		totalPages: number;
	};
}) {
	return (
		<>
			<section className="sm-page-shell sm-listing-intro">
				<Breadcrumbs items={[{ label: "Marques", href: "/marques" }, { label: brand.label }]} />
				<div className="sm-listing-title-row">
					<div>
						<span className="sm-category-icon is-large">
							<SoumlyIcon name="Tag" size={35} />
						</span>
						<div>
							<h1>Prix {brand.label} en Tunisie</h1>
							<p>
								Comparez les prix des produits {brand.label} en Tunisie sur Soumly. Retrouvez
								actuellement {brand.productCount} produits proposés par {brand.storeCount}{" "}
								boutiques, avec des prix à partir de {formatPrice(brand.minPrice)}.
							</p>
						</div>
					</div>
					<span className="sm-result-pill">{brand.productCount} produits</span>
				</div>
			</section>

			{brand.categories.length ? (
				<section className="sm-page-shell sm-section-block">
					<div className="sm-section-heading">
						<div>
							<span className="sm-section-kicker">Catégories</span>
							<h2>Catégories {brand.label}</h2>
						</div>
					</div>
					<div className="sm-family-chips">
						{brand.categories.map((cat) => (
							<Link key={cat.slug} href={`/marques/${brand.slug}/${cat.slug}`} className="sm-chip">
								{cat.label} <span>{cat.count}</span>
							</Link>
						))}
					</div>
				</section>
			) : null}

			<section className="sm-page-shell sm-section-block">
				<div className="sm-section-heading">
					<div>
						<span className="sm-section-kicker">Sélection</span>
						<h2>Les meilleures offres {brand.label}</h2>
					</div>
				</div>
				<div className="sm-product-grid sm-grid-four">
					{brand.deals.map((summary) => (
						<ProductCard product={summaryToProduct(summary)} key={summary.id} />
					))}
				</div>
			</section>

			<section className="sm-page-shell sm-section-block">
				<div className="sm-section-heading">
					<div>
						<span className="sm-section-kicker">Catalogue</span>
						<h2>Tous les produits {brand.label}</h2>
					</div>
				</div>
				<div className="sm-product-grid sm-grid-three">
					{result.products.map((summary) => (
						<ProductCard product={summaryToProduct(summary)} key={summary.id} />
					))}
				</div>
				<Pagination
					page={result.page}
					totalPages={result.totalPages}
					base={`/marques/${brand.slug}`}
				/>
			</section>
		</>
	);
}

export function BrandCategoryView({
	brandSlug,
	brandLabel,
	category,
	categoryLabel,
	result,
}: {
	brandSlug: string;
	brandLabel: string;
	category: Category;
	categoryLabel: string;
	result: {
		products: ProductSummary[];
		total: number;
		page: number;
		totalPages: number;
	};
}) {
	return (
		<>
			<section className="sm-page-shell sm-listing-intro">
				<Breadcrumbs
					items={[
						{ label: "Marques", href: "/marques" },
						{ label: brandLabel, href: `/marques/${brandSlug}` },
						{ label: categoryLabel },
					]}
				/>
				<div className="sm-listing-title-row">
					<div>
						<span className="sm-category-icon is-large">
							<SoumlyIcon name={category.icon} size={35} />
						</span>
						<div>
							<h1>
								Prix des {categoryLabel.toLowerCase()} {brandLabel} en Tunisie
							</h1>
							<p>
								Comparez les prix des {categoryLabel.toLowerCase()} {brandLabel} en Tunisie sur
								Soumly. Retrouvez actuellement {result.total} produits chez les boutiques
								partenaires.
							</p>
						</div>
					</div>
					<span className="sm-result-pill">{result.total} produits</span>
				</div>
			</section>
			<section className="sm-page-shell sm-section-block">
				<div className="sm-product-grid sm-grid-three">
					{result.products.map((summary) => (
						<ProductCard product={summaryToProduct(summary)} key={summary.id} />
					))}
				</div>
				<Pagination
					page={result.page}
					totalPages={result.totalPages}
					base={`/marques/${brandSlug}/${categorySlugSafe(brandSlug, category)}`}
				/>
			</section>
		</>
	);
}

function categorySlugSafe(_brand: string, category: Category): string {
	return category.slug;
}
