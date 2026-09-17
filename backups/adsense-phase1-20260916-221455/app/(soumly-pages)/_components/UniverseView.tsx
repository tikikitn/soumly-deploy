// Universe page view — client. Receives server-computed sub-universe data
// (labels, category chips, small product samples). No catalog import.
"use client";

import { ArrowRight, ChevronRight, Sparkles } from "lucide-react";
import Link from "../../components/NativeLink";
import type { Product, ProductSummary } from "../_data/content.shared";
import { ProductCard } from "./ui";

export type UniverseSubGroup = {
	slug: string;
	label: string;
	categories: Array<{ slug: string; label: string }>;
	categoryCount: number;
	productCount: number;
	sampleProducts: ProductSummary[];
};

export function UniverseView({
	universe,
	subUniverses,
	totalCategories,
	totalProducts,
}: {
	universe: { slug: string; label: string; tagline: string };
	subUniverses: UniverseSubGroup[];
	totalCategories: number;
	totalProducts: number;
}) {
	const sampleFull: Product[][] = subUniverses.map((group) =>
		group.sampleProducts.map((product) => ({
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
		})),
	);

	return (
		<>
			<section className="sm-page-shell sm-inner-hero sm-categories-hero">
				<div>
					<nav className="sm-breadcrumbs" aria-label="Fil d’Ariane">
						<Link href="/">Accueil</Link>
						<span className="sm-crumb">
							<i>/</i>
							<Link href="/categories">Catégories</Link>
						</span>
						<span className="sm-crumb">
							<i>/</i>
							<strong>{universe.label}</strong>
						</span>
					</nav>
					<span className="sm-eyebrow">
						<Sparkles size={15} /> Univers
					</span>
					<h1>{universe.label}</h1>
					<p>{universe.tagline}</p>
				</div>
				<div className="sm-hero-stat-grid">
					<div>
						<strong>{totalProducts.toLocaleString("fr-FR")}</strong>
						<span>produits</span>
					</div>
					<div>
						<strong>{totalCategories}</strong>
						<span>catégories</span>
					</div>
					<div>
						<strong>{subUniverses.length}</strong>
						<span>groupes</span>
					</div>
				</div>
			</section>

			{subUniverses.map((group, index) => (
				<section
					className={`sm-page-shell sm-section-block${index % 2 === 1 ? " sm-soft-section" : ""}`}
					key={group.slug}
				>
					<div className="sm-section-heading">
						<div>
							<span className="sm-section-kicker">
								{group.categoryCount} catégories · {group.productCount} produits
							</span>
							<h2>{group.label}</h2>
						</div>
						{group.categories.length ? (
							<Link className="sm-text-link" href={`/categories/${group.categories[0].slug}`}>
								Voir tout <ChevronRight size={15} />
							</Link>
						) : null}
					</div>
					{group.categories.length ? (
						<div className="sm-chip-row">
							{group.categories.map((category) => (
								<Link className="sm-chip" href={`/categories/${category.slug}`} key={category.slug}>
									{category.label}
									<ArrowRight size={13} />
								</Link>
							))}
						</div>
					) : null}
					{sampleFull[index].length ? (
						<div className="sm-product-grid sm-grid-four" style={{ marginTop: 18 }}>
							{sampleFull[index].map((product) => (
								<ProductCard product={product} key={product.id} />
							))}
						</div>
					) : null}
				</section>
			))}
		</>
	);
}
