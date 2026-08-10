// Add CategoriesListingView (index page) to ListingViews.tsx
// Receives family stats from server — no catalog import.
"use client";

import { Sparkles } from "lucide-react";
import Link from "../../components/NativeLink";
import type { Family, Product, ProductSummary } from "../_data/content.shared";
import { ProductCard, SoumlyIcon } from "./ui";

export function CategoriesListingView({
	families,
	totalProducts,
	totalCategories,
	multiStore,
}: {
	families: Array<Family & { categoryCount: number; productCount: number }>;
	totalProducts: number;
	totalCategories: number;
	multiStore: ProductSummary[];
}) {
	const multiFull: Product[] = multiStore.map((product) => ({
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
	}));

	return (
		<>
			<section className="sm-page-shell sm-inner-hero sm-categories-hero">
				<div>
					<span className="sm-eyebrow">
						<Sparkles size={15} /> Le catalogue Soumly
					</span>
					<h1>Explorez les catégories</h1>
					<p>
						{totalProducts.toLocaleString("fr-FR")} produits classés en {families.length} familles.
					</p>
				</div>
				<div className="sm-hero-stat-grid">
					<div>
						<strong>{totalProducts.toLocaleString("fr-FR")}</strong>
						<span>produits référencés</span>
					</div>
					<div>
						<strong>{totalCategories}</strong>
						<span>catégories</span>
					</div>
					<div>
						<strong>{families.length}</strong>
						<span>familles</span>
					</div>
				</div>
			</section>
			<section className="sm-page-shell sm-section-block">
				<div className="sm-section-heading">
					<div>
						<span className="sm-section-kicker">Familles</span>
						<h2>Que recherchez-vous ?</h2>
					</div>
				</div>
				<div className="sm-category-grid">
					{families.map((family, index) => (
						<Link
							className={`sm-category-card tone-${(index % 4) + 1}`}
							href={`/categories/${family.slug}`}
							key={family.slug}
						>
							<span className="sm-category-icon">
								<SoumlyIcon name={family.icon} size={30} />
							</span>
							<div>
								<h3>{family.label}</h3>
								<p>{family.categoryCount} catégories</p>
								<strong>
									{new Intl.NumberFormat("fr-FR").format(family.productCount)} produits
								</strong>
							</div>
							<span className="sm-round-arrow">→</span>
						</Link>
					))}
				</div>
			</section>
			{multiFull.length ? (
				<section className="sm-page-shell sm-section-block sm-soft-section">
					<div className="sm-section-heading">
						<div>
							<span className="sm-section-kicker">Prix comparés</span>
							<h2>Produits présents dans plusieurs boutiques</h2>
						</div>
						<Link href="/recherche">Voir le catalogue →</Link>
					</div>
					<div className="sm-product-grid sm-grid-four">
						{multiFull.map((product) => (
							<ProductCard product={product} key={product.id} />
						))}
					</div>
				</section>
			) : null}
			<div className="sm-page-shell">
				<div className="sm-trust-strip">
					<span>
						<Sparkles size={15} /> Prix actualisés
					</span>
					<span>
						<Sparkles size={15} /> Comparaison réelle
					</span>
					<span>
						<Sparkles size={15} /> Boutiques tunisiennes
					</span>
				</div>
			</div>
		</>
	);
}
