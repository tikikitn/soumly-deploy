"use client";

import {
	BadgeCheck,
	BadgePercent,
	ChevronDown,
	Filter,
	Search,
	ShieldCheck,
	SlidersHorizontal,
	Sparkles,
	Tag,
	Truck,
	X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { categories, getCategory, products } from "../_data/content";
import { ProductCard, SoumlyIcon } from "./ui";

function Breadcrumbs({ current, parent }: { current: string; parent?: string }) {
	return (
		<nav className="sm-breadcrumbs" aria-label="Fil d’Ariane">
			<Link href="/">Accueil</Link>
			<span>/</span>
			{parent ? (
				<>
					<Link href="/categories">{parent}</Link>
					<span>/</span>
				</>
			) : null}
			<strong>{current}</strong>
		</nav>
	);
}

function TrustStrip() {
	return (
		<div className="sm-trust-strip">
			<span>
				<BadgeCheck size={20} /> Prix mis à jour
			</span>
			<span>
				<ShieldCheck size={20} /> Boutiques vérifiées
			</span>
			<span>
				<Tag size={20} /> Comparaison gratuite
			</span>
		</div>
	);
}

const brands = ["Samsung", "Apple", "Lenovo", "Moulinex", "Tefal", "JBL"];

function FilterPanel({
	selectedBrands,
	setSelectedBrands,
	onlyDeals,
	setOnlyDeals,
	close,
}: {
	selectedBrands: string[];
	setSelectedBrands: (brands: string[]) => void;
	onlyDeals: boolean;
	setOnlyDeals: (value: boolean) => void;
	close?: () => void;
}) {
	const toggleBrand = (brand: string) => {
		setSelectedBrands(
			selectedBrands.includes(brand)
				? selectedBrands.filter((item) => item !== brand)
				: [...selectedBrands, brand],
		);
	};
	return (
		<aside className="sm-filter-panel">
			<div className="sm-filter-heading">
				<h2>Filtres</h2>
				{close ? (
					<button type="button" onClick={close} aria-label="Fermer les filtres">
						<X size={21} />
					</button>
				) : null}
			</div>
			<div className="sm-filter-group">
				<h3>Prix</h3>
				<div className="sm-price-inputs">
					<label>
						Min.
						<input defaultValue="0" inputMode="numeric" />
					</label>
					<span>—</span>
					<label>
						Max.
						<input defaultValue="4000" inputMode="numeric" />
					</label>
				</div>
				<input
					className="sm-range"
					type="range"
					min="0"
					max="5000"
					defaultValue="4000"
					aria-label="Prix maximum"
				/>
			</div>
			<div className="sm-filter-group">
				<h3>Marques</h3>
				{brands.map((brand) => (
					<label className="sm-check-row" key={brand}>
						<input
							type="checkbox"
							checked={selectedBrands.includes(brand)}
							onChange={() => toggleBrand(brand)}
						/>
						<span>{brand}</span>
						<small>{products.filter((product) => product.brand === brand).length}</small>
					</label>
				))}
			</div>
			<div className="sm-filter-group">
				<h3>Disponibilité</h3>
				<label className="sm-check-row">
					<input type="checkbox" defaultChecked />
					<span>En stock</span>
				</label>
				<label className="sm-check-row">
					<input
						type="checkbox"
						checked={onlyDeals}
						onChange={(event) => setOnlyDeals(event.target.checked)}
					/>
					<span>En promotion</span>
				</label>
			</div>
			<div className="sm-filter-group">
				<h3>Note minimum</h3>
				<div className="sm-rating-filter">
					<button type="button">4★ et plus</button>
					<button type="button">3★ et plus</button>
				</div>
			</div>
			<button
				className="sm-secondary-button sm-full-button"
				type="button"
				onClick={() => {
					setSelectedBrands([]);
					setOnlyDeals(false);
				}}
			>
				Réinitialiser
			</button>
		</aside>
	);
}

export function CategoriesScreen() {
	return (
		<>
			<section className="sm-page-shell sm-inner-hero sm-categories-hero">
				<div>
					<Breadcrumbs current="Catégories" />
					<span className="sm-eyebrow">
						<Sparkles size={15} /> Tout l’univers Soumly
					</span>
					<h1>Explorez nos catégories</h1>
					<p>
						Trouvez le produit idéal et comparez les prix proposés par les meilleures boutiques
						tunisiennes.
					</p>
				</div>
				<div className="sm-hero-stat-grid">
					<div>
						<strong>5 784</strong>
						<span>produits comparés</span>
					</div>
					<div>
						<strong>42</strong>
						<span>boutiques partenaires</span>
					</div>
					<div>
						<strong>8</strong>
						<span>univers shopping</span>
					</div>
				</div>
			</section>

			<section className="sm-page-shell sm-section-block">
				<div className="sm-section-heading">
					<div>
						<span className="sm-section-kicker">Toutes les catégories</span>
						<h2>Que recherchez-vous ?</h2>
					</div>
				</div>
				<div className="sm-category-grid">
					{categories.map((category, index) => (
						<Link
							className={`sm-category-card tone-${(index % 4) + 1}`}
							href={`/categories/${category.slug}`}
							key={category.slug}
						>
							<span className="sm-category-icon">
								<SoumlyIcon name={category.icon} size={30} />
							</span>
							<div>
								<h3>{category.label}</h3>
								<p>{category.note}</p>
								<strong>{new Intl.NumberFormat("fr-FR").format(category.count)} produits</strong>
							</div>
							<span className="sm-round-arrow">→</span>
						</Link>
					))}
				</div>
			</section>

			<section className="sm-page-shell sm-section-block sm-soft-section">
				<div className="sm-section-heading">
					<div>
						<span className="sm-section-kicker">Les plus consultés</span>
						<h2>Produits populaires</h2>
					</div>
					<Link href="/promotions">Voir les promotions →</Link>
				</div>
				<div className="sm-product-grid sm-grid-four">
					{products.slice(0, 4).map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
				</div>
			</section>
			<div className="sm-page-shell">
				<TrustStrip />
			</div>
		</>
	);
}

function sortProducts(items: typeof products, sort: string) {
	const result = [...items];
	if (sort === "price-asc") return result.sort((a, b) => a.price - b.price);
	if (sort === "price-desc") return result.sort((a, b) => b.price - a.price);
	if (sort === "rating") return result.sort((a, b) => b.rating - a.rating);
	return result.sort((a, b) => b.reviews - a.reviews);
}

export function CategoryScreen() {
	const pathname = usePathname();
	const slug = pathname.split("/").filter(Boolean).at(-1);
	const category = getCategory(slug);
	const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
	const [onlyDeals, setOnlyDeals] = useState(false);
	const [sort, setSort] = useState("popular");
	const [filtersOpen, setFiltersOpen] = useState(false);

	const categoryProducts = products.filter((product) => product.categorySlug === category.slug);
	const baseProducts =
		categoryProducts.length >= 3
			? categoryProducts
			: [
					...categoryProducts,
					...products.filter((product) => product.categorySlug !== category.slug),
				];
	const visibleProducts = sortProducts(
		baseProducts.filter(
			(product) =>
				(!selectedBrands.length || selectedBrands.includes(product.brand)) &&
				(!onlyDeals || product.discount >= 15),
		),
		sort,
	);

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
							<p>{category.note}. Comparez les prix et économisez sur votre prochain achat.</p>
						</div>
					</div>
					<span className="sm-result-pill">{visibleProducts.length} produits</span>
				</div>
				<div className="sm-subcategory-row">
					{[
						"Tous",
						"Nouveautés",
						"Meilleures ventes",
						"Moins de 1 500 DT",
						"Livraison gratuite",
					].map((item, index) => (
						<button className={index === 0 ? "is-active" : ""} type="button" key={item}>
							{item}
						</button>
					))}
				</div>
			</section>

			<section className="sm-page-shell sm-catalog-layout">
				<div className="sm-desktop-filters">
					<FilterPanel
						selectedBrands={selectedBrands}
						setSelectedBrands={setSelectedBrands}
						onlyDeals={onlyDeals}
						setOnlyDeals={setOnlyDeals}
					/>
				</div>
				{filtersOpen ? (
					<div className="sm-filter-overlay" onClick={() => setFiltersOpen(false)}>
						<div onClick={(event) => event.stopPropagation()}>
							<FilterPanel
								selectedBrands={selectedBrands}
								setSelectedBrands={setSelectedBrands}
								onlyDeals={onlyDeals}
								setOnlyDeals={setOnlyDeals}
								close={() => setFiltersOpen(false)}
							/>
						</div>
					</div>
				) : null}
				<div className="sm-catalog-results">
					<div className="sm-results-toolbar">
						<button
							className="sm-mobile-filter-button"
							type="button"
							onClick={() => setFiltersOpen(true)}
						>
							<Filter size={18} /> Filtres
							{selectedBrands.length ? ` (${selectedBrands.length})` : ""}
						</button>
						<span>{visibleProducts.length} résultats</span>
						<label>
							Trier par{" "}
							<select value={sort} onChange={(event) => setSort(event.target.value)}>
								<option value="popular">Popularité</option>
								<option value="price-asc">Prix croissant</option>
								<option value="price-desc">Prix décroissant</option>
								<option value="rating">Meilleures notes</option>
							</select>
							<ChevronDown size={15} />
						</label>
					</div>
					{visibleProducts.length ? (
						<div className="sm-product-grid sm-grid-three">
							{visibleProducts.map((product) => (
								<ProductCard product={product} key={product.id} />
							))}
						</div>
					) : (
						<div className="sm-no-results">
							<SlidersHorizontal size={32} />
							<h2>Aucun produit trouvé</h2>
							<p>Essayez de modifier vos filtres pour afficher plus de résultats.</p>
						</div>
					)}
				</div>
			</section>
		</>
	);
}

export function SearchScreen() {
	const searchParams = useSearchParams();
	const initialQ = searchParams.get("q") ?? "";
	const [query, setQuery] = useState(initialQ);
	const [input, setInput] = useState(initialQ);
	const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
	const [onlyDeals, setOnlyDeals] = useState(false);
	const [sort, setSort] = useState("popular");
	const [filtersOpen, setFiltersOpen] = useState(false);

	const matches = useMemo(() => {
		const normalized = query.trim().toLocaleLowerCase("fr");
		const words = normalized.split(/\s+/).filter(Boolean);
		const base = normalized
			? products.filter((product) => {
					const hay = `${product.name} ${product.brand} ${product.category}`.toLocaleLowerCase(
						"fr",
					);
					return words.every((w) => hay.includes(w));
				})
			: products;
		const broadened = base.length ? base : products.slice(0, 8);
		return sortProducts(
			broadened.filter(
				(product) =>
					(!selectedBrands.length || selectedBrands.includes(product.brand)) &&
					(!onlyDeals || product.discount >= 15),
			),
			sort,
		);
	}, [query, selectedBrands, onlyDeals, sort]);

	return (
		<>
			<section className="sm-search-hero">
				<div className="sm-page-shell">
					<Breadcrumbs current="Résultats de recherche" />
					<h1>{query ? <>Résultats pour « {query} »</> : "Trouvez votre prochain produit"}</h1>
					<p>
						{query &&
						!products.some((product) => product.name.toLowerCase().includes(query.toLowerCase()))
							? "Aucune correspondance exacte. Voici des produits populaires qui pourraient vous intéresser."
							: "Comparez les offres, les avis et les prix en quelques secondes."}
					</p>
					<form
						className="sm-big-search"
						onSubmit={(event) => {
							event.preventDefault();
							setQuery(input.trim());
							window.history.replaceState(
								{},
								"",
								`/recherche${input.trim() ? `?q=${encodeURIComponent(input.trim())}` : ""}`,
							);
						}}
					>
						<Search size={22} />
						<input
							value={input}
							onChange={(event) => setInput(event.target.value)}
							placeholder="Ex. Samsung Galaxy, PC portable…"
							aria-label="Rechercher"
						/>
						<button type="submit">Rechercher</button>
					</form>
					<div className="sm-quick-search">
						<span>Recherches populaires :</span>
						{["Galaxy S24", "Air Fryer", "PC portable", "AirPods"].map((item) => (
							<button
								key={item}
								type="button"
								onClick={() => {
									setInput(item);
									setQuery(item);
								}}
							>
								{item}
							</button>
						))}
					</div>
				</div>
			</section>
			<section className="sm-page-shell sm-catalog-layout sm-search-results-layout">
				<div className="sm-desktop-filters">
					<FilterPanel
						selectedBrands={selectedBrands}
						setSelectedBrands={setSelectedBrands}
						onlyDeals={onlyDeals}
						setOnlyDeals={setOnlyDeals}
					/>
				</div>
				{filtersOpen ? (
					<div className="sm-filter-overlay" onClick={() => setFiltersOpen(false)}>
						<div onClick={(event) => event.stopPropagation()}>
							<FilterPanel
								selectedBrands={selectedBrands}
								setSelectedBrands={setSelectedBrands}
								onlyDeals={onlyDeals}
								setOnlyDeals={setOnlyDeals}
								close={() => setFiltersOpen(false)}
							/>
						</div>
					</div>
				) : null}
				<div className="sm-catalog-results">
					<div className="sm-results-toolbar">
						<button
							className="sm-mobile-filter-button"
							type="button"
							onClick={() => setFiltersOpen(true)}
						>
							<Filter size={18} /> Filtres
						</button>
						<span>{matches.length} produits</span>
						<label>
							Trier par{" "}
							<select value={sort} onChange={(event) => setSort(event.target.value)}>
								<option value="popular">Pertinence</option>
								<option value="price-asc">Prix croissant</option>
								<option value="price-desc">Prix décroissant</option>
								<option value="rating">Meilleures notes</option>
							</select>
							<ChevronDown size={15} />
						</label>
					</div>
					<div className="sm-product-grid sm-grid-three">
						{matches.map((product) => (
							<ProductCard product={product} key={product.id} />
						))}
					</div>
				</div>
			</section>
		</>
	);
}

export function PromotionsScreen() {
	const [active, setActive] = useState("Toutes");
	const filters = ["Toutes", "Smartphones", "Informatique", "Électroménager", "TV & Audio"];
	const visible =
		active === "Toutes" ? products : products.filter((product) => product.category === active);
	return (
		<>
			<section className="sm-page-shell sm-promo-hero">
				<div>
					<Breadcrumbs current="Promotions" />
					<span className="sm-eyebrow">
						<BadgePercent size={15} /> Bons plans du moment
					</span>
					<h1>
						Les prix baissent.
						<br />
						Vous en profitez.
					</h1>
					<p>
						Une sélection d’offres vérifiées auprès de boutiques tunisiennes, mise à jour
						régulièrement.
					</p>
					<div className="sm-promo-benefits">
						<span>
							<BadgeCheck size={17} /> Offres vérifiées
						</span>
						<span>
							<Truck size={17} /> Livraison affichée
						</span>
					</div>
				</div>
				<div className="sm-deal-card">
					<span>OFFRE DU JOUR</span>
					<strong>−23%</strong>
					<p>sur la friteuse sans huile 6L</p>
					<div className="sm-countdown">
						<b>
							08<small>h</small>
						</b>
						<i>:</i>
						<b>
							42<small>min</small>
						</b>
						<i>:</i>
						<b>
							17<small>sec</small>
						</b>
					</div>
					<Link href="/produit/air-fryer-6l">Voir l’offre →</Link>
				</div>
			</section>
			<section className="sm-page-shell sm-section-block">
				<div className="sm-section-heading">
					<div>
						<span className="sm-section-kicker">Sélection Soumly</span>
						<h2>Promotions à ne pas manquer</h2>
					</div>
					<span className="sm-update-note">Mise à jour il y a 12 min</span>
				</div>
				<div className="sm-filter-chips">
					{filters.map((filter) => (
						<button
							type="button"
							key={filter}
							className={active === filter ? "is-active" : ""}
							onClick={() => setActive(filter)}
						>
							{filter}
						</button>
					))}
				</div>
				<div className="sm-product-grid sm-grid-four">
					{visible.map((product) => (
						<ProductCard product={product} key={product.id} />
					))}
				</div>
			</section>
			<section className="sm-page-shell sm-newsletter-card">
				<div>
					<span>
						<BadgePercent size={24} />
					</span>
					<div>
						<h2>Ne ratez plus une baisse de prix</h2>
						<p>Ajoutez un produit à vos favoris et activez une alerte personnalisée.</p>
					</div>
				</div>
				<Link className="sm-primary-button" href="/favoris">
					Créer une alerte
				</Link>
			</section>
		</>
	);
}
