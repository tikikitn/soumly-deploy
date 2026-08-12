// Categories index — NEW: 9 navigation universes above the taxonomy.
// Non-destructive: existing families still reachable via "Voir toutes les familles".
"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import { CATALOG_UNIVERSES } from "../../../lib/catalog-navigation";
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

	// icon per universe (reuse Soumly icon set)
	const universeIcon: Record<string, string> = {
		"high-tech": "Laptop",
		electromenager: "Refrigerator",
		"maison-cuisine": "Home",
		"beaute-bien-etre": "Sparkles",
		"mode-accessoires": "Shirt",
		"bebe-enfants": "ToyBrick",
		"sport-fitness": "Dumbbell",
		"bureau-papeterie": "FolderOpen",
		animaux: "PawPrint",
	};

	return (
		<>
			<section className="sm-page-shell sm-inner-hero sm-categories-hero">
				<div>
					<span className="sm-eyebrow">
						<Sparkles size={15} /> Le catalogue Soumly
					</span>
					<h1>Explorez nos univers</h1>
					<p>
						{totalProducts.toLocaleString("fr-FR")} produits classés en 9 univers — des catégories
						pratiques pour trouver rapidement la bonne affaire.
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
						<strong>9</strong>
						<span>univers</span>
					</div>
				</div>
			</section>

			<section className="sm-page-shell sm-section-block">
				<div className="sm-section-heading">
					<div>
						<span className="sm-section-kicker">Univers</span>
						<h2>Que recherchez-vous ?</h2>
					</div>
				</div>
				<div className="sm-category-grid">
					{CATALOG_UNIVERSES.map((universe, index) => (
						<Link
							className={`sm-category-card tone-${(index % 4) + 1}`}
							href={`/univers/${universe.slug}`}
							key={universe.slug}
						>
							<span className="sm-category-icon">
								<SoumlyIcon name={universeIcon[universe.slug] ?? "Sparkles"} size={30} />
							</span>
							<div>
								<h3>{universe.label}</h3>
								<p className="sm-universe-tagline">{universe.tagline}</p>
								<strong>
									{universe.subUniverses.reduce(
										(total, sub) => total + sub.categorySlugs.length,
										0,
									)}{" "}
									catégories
								</strong>
							</div>
							<span className="sm-round-arrow">→</span>
						</Link>
					))}
				</div>
			</section>

			<section className="sm-page-shell sm-section-block">
				<div className="sm-section-heading">
					<div>
						<span className="sm-section-kicker">Familles classiques</span>
						<h2>Voir les familles existantes</h2>
					</div>
				</div>
				<div className="sm-chip-row">
					{families.map((family) => (
						<Link className="sm-chip" href={`/categories/${family.slug}`} key={family.slug}>
							{family.label}
							<ArrowRight size={13} />
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
