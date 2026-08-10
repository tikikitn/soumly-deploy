"use client";
/* eslint-disable @next/next/no-html-link-for-pages, @next/next/no-location-assign-relative-destination */

import {
	ArrowRight,
	Bell,
	BookOpen,
	CheckCircle2,
	ChevronLeft,
	ChevronRight,
	CookingPot,
	Grid3X3,
	Heart,
	Home,
	Laptop,
	Menu,
	Microwave,
	RefreshCw,
	Refrigerator,
	Search,
	ShieldCheck,
	ShoppingBag,
	Smartphone,
	Sparkles,
	Star,
	Store,
	Tag,
	ToyBrick,
	UserRound,
	X,
} from "lucide-react";
import type * as React from "react";
import { type FormEvent, type RefObject, useEffect, useMemo, useRef, useState } from "react";
import {
	categories as catalogCategories,
	FAMILY_GROUPS,
	formatPrice,
	type Product,
	products,
} from "./(soumly-pages)/_data/content";

// 8 featured families shown on the homepage (from primini structure)
const FAMILY_IMAGES: Record<string, string> = {
	informatique: "/assets/families/informatique-v2.jpg",
	telephonie: "/assets/families/telephonie-v2.jpg",
	"sante-beaute": "/assets/families/sante-beaute-v2.jpg",
	electromenager: "/assets/families/electromenager-v2.jpg",
	"petit-electromenager": "/assets/families/petit-electromenager-v2.jpg",
	cuisine: "/assets/families/cuisine-v2.jpg",
	"maison-jardin": "/assets/families/maison-jardin-v2.jpg",
	"bebe-enfants": "/assets/families/bebe-enfants-v2.jpg",
};

const FEATURED_FAMILIES = [
	{ slug: "informatique", label: "Informatique", icon: Laptop },
	{ slug: "telephonie", label: "Téléphonie", icon: Smartphone },
	{ slug: "electromenager", label: "Gros électroménager", icon: Refrigerator },
	{ slug: "petit-electromenager", label: "Petit électroménager", icon: Microwave },
	{ slug: "cuisine", label: "Cuisine", icon: CookingPot },
	{ slug: "sante-beaute", label: "Beauté & Santé", icon: Sparkles },
	{ slug: "maison-jardin", label: "Maison & Jardin", icon: Home },
	{ slug: "bebe-enfants", label: "Bébé & Enfants", icon: ToyBrick },
];

const categories = FEATURED_FAMILIES;

const storeNames = ["Tunisianet", "Spacenet"];
const offerFilters = ["Tout", ...new Set(catalogCategories.map((category) => category.label))];

function readFavorites() {
	if (typeof window === "undefined") return new Set<string>();
	try {
		const value = window.localStorage.getItem("soumly-favorites");
		return new Set<string>(value ? JSON.parse(value) : []);
	} catch {
		return new Set<string>();
	}
}

function writeFavorites(favorites: Set<string>) {
	try {
		window.localStorage.setItem("soumly-favorites", JSON.stringify([...favorites]));
		document.cookie = `soumly-favorites=${encodeURIComponent(JSON.stringify([...favorites]))}; path=/; max-age=31536000; SameSite=Lax`;
	} catch {
		document.cookie = `soumly-favorites=${encodeURIComponent(JSON.stringify([...favorites]))}; path=/; max-age=31536000; SameSite=Lax`;
	}
	window.dispatchEvent(new CustomEvent("soumly:favorites"));
}

function Logo() {
	return (
		<a className="logo" href="/" aria-label="Soumly, accueil">
			Soumly<span aria-hidden="true">.</span>
		</a>
	);
}

function Stars({ rating }: { rating: number }) {
	if (!rating || rating <= 0) return null;
	return (
		<span className="stars" role="img" aria-label={`${rating} sur 5`}>
			{[0, 1, 2, 3, 4].map((index) => (
				<Star
					key={index}
					size={15}
					strokeWidth={2}
					fill={index < Math.round(rating) ? "currentColor" : "none"}
				/>
			))}
		</span>
	);
}

function ProductArtwork({ src, alt, className }: { src: string; alt: string; className?: string }) {
	return (
		// Product cut-outs are local reference assets and intentionally bypass optimization.
		// eslint-disable-next-line @next/next/no-img-element
		<img className={className} src={src} alt={alt} loading="lazy" />
	);
}

function ProductCard({
	product,
	isFavorite,
	onFavorite,
	onCompare,
}: {
	product: Product;
	isFavorite: boolean;
	onFavorite: () => void;
	onCompare: () => void;
}) {
	return (
		<article className="product-card">
			<div className="product-card__top">
				{product.discount > 0 ? <span className="discount-badge">−{product.discount}%</span> : null}
				<button
					className={`icon-button favorite-button ${isFavorite ? "is-active" : ""}`}
					onClick={onFavorite}
					aria-label={
						isFavorite
							? `Retirer ${product.name} des favoris`
							: `Ajouter ${product.name} aux favoris`
					}
					type="button"
				>
					<Heart size={21} fill={isFavorite ? "currentColor" : "none"} />
				</button>
			</div>

			<a className="product-card__content" href={`/produit/${product.id}`}>
				<div className="product-card__image">
					<ProductArtwork src={product.image} alt={product.name} />
				</div>
				<div className="product-card__details">
					{product.badge ? <span className="micro-badge">{product.badge}</span> : null}
					<span className="product-category">{product.category}</span>
					<h3>{product.name}</h3>
					<div className="rating-row">
						<Stars rating={product.rating} />
						<span>
							{product.rating > 0
								? `${product.rating.toFixed(1).replace(".", ",")}${product.reviews > 0 ? ` (${product.reviews})` : ""}`
								: null}
						</span>
					</div>
					<strong className="current-price">{formatPrice(product.price)}</strong>
					{product.oldPrice > product.price ? (
						<span className="old-price">{formatPrice(product.oldPrice)}</span>
					) : null}
					<span className="store-count">
						<Store size={16} /> {product.stores} boutique{product.stores > 1 ? "s" : ""}
					</span>
				</div>
			</a>

			<button className="compare-button" type="button" onClick={onCompare}>
				Comparer les prix <ArrowRight size={16} />
			</button>
		</article>
	);
}

function RailControls({
	railRef,
	label,
}: {
	railRef: RefObject<HTMLDivElement | null>;
	label: string;
}) {
	const scroll = (direction: number) => {
		railRef.current?.scrollBy({ left: direction * 620, behavior: "smooth" });
	};

	return (
		<div className="rail-controls" role="toolbar" aria-label={label}>
			<button type="button" onClick={() => scroll(-1)} aria-label="Voir les produits précédents">
				<ChevronLeft size={19} />
			</button>
			<button type="button" onClick={() => scroll(1)} aria-label="Voir les produits suivants">
				<ChevronRight size={19} />
			</button>
		</div>
	);
}

export default function HomePage() {
	const [query, setQuery] = useState("");
	const [debouncedQuery, setDebouncedQuery] = useState("");
	const [activeFilter, setActiveFilter] = useState("Tout");
	const [favorites, setFavorites] = useState<Set<string>>(new Set());
	const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [toast, setToast] = useState("");
	const offersRail = useRef<HTMLDivElement>(null);
	const familyRails = useRef<Record<string, HTMLDivElement | null>>({});
	const popularRail = useRef<HTMLDivElement>(null);
	const maximumDiscount = Math.max(0, ...products.map((product) => product.discount));

	useEffect(() => {
		const frame = window.requestAnimationFrame(() => setFavorites(readFavorites()));
		return () => window.cancelAnimationFrame(frame);
	}, []);

	const suggestions = useMemo(() => {
		const normalized = debouncedQuery.trim().toLowerCase();
		if (normalized.length < 2) return [];
		const starts = products.filter((product) => product.name.toLowerCase().startsWith(normalized));
		const contains = products.filter(
			(product) =>
				!product.name.toLowerCase().startsWith(normalized) &&
				(product.name.toLowerCase().includes(normalized) ||
					product.category.toLowerCase().includes(normalized)),
		);
		return starts.concat(contains).slice(0, 30);
	}, [debouncedQuery]);

	useEffect(() => {
		const t = window.setTimeout(() => setDebouncedQuery(query), 200);
		return () => window.clearTimeout(t);
	}, [query]);

	const filteredOffers = useMemo(() => {
		// Real discounts first (backed by price data), then best multi-store offers
		const promoted = [...products]
			.sort((first, second) => {
				if (second.discount > 0 !== first.discount > 0) return second.discount > 0 ? 1 : -1;
				return (second.discount || 0) - (first.discount || 0);
			})
			.sort((first, second) => (second.discount || 0) - (first.discount || 0));
		if (activeFilter === "Tout") return promoted.slice(0, 12);
		return promoted.filter((product) => product.category === activeFilter).slice(0, 12);
	}, [activeFilter]);

	const showToast = (message: string) => {
		setToast(message);
		window.setTimeout(() => setToast(""), 2300);
	};

	const handleSearch = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const term = query.trim();
		if (!term) {
			showToast("Saisissez le produit que vous recherchez");
			return;
		}
		window.location.assign(`/recherche?q=${encodeURIComponent(term)}`);
	};

	const toggleFavorite = (product: Product) => {
		const next = new Set(favorites);
		if (next.has(product.id)) {
			next.delete(product.id);
			showToast(`${product.name} retiré des favoris`);
		} else {
			next.add(product.id);
			showToast(`${product.name} ajouté aux favoris`);
		}
		writeFavorites(next);
		setFavorites(next);
	};

	const chooseSuggestion = (product: Product) => {
		window.location.assign(`/produit/${product.id}`);
	};

	return (
		<main id="accueil">
			<header className="site-header">
				<div className="header-main page-shell">
					<Logo />

					<nav className="desktop-nav" aria-label="Navigation principale">
						<a href="/categories">Catégories</a>

						<a href="/guides">Guides d’achat</a>
					</nav>

					<form className="header-search" onSubmit={handleSearch}>
						<Search size={19} />
						<input
							value={query}
							onChange={(event) => setQuery(event.target.value)}
							placeholder="Quel produit recherchez-vous ?"
							aria-label="Rechercher un produit"
						/>
					</form>

					<div className="header-actions">
						<button
							className="icon-button favorite-header"
							type="button"
							aria-label={`${favorites.size} produits favoris`}
							onClick={() => window.location.assign("/favoris")}
						>
							<Heart size={22} />
							{favorites.size > 0 ? <span>{favorites.size}</span> : null}
						</button>
						<button
							className="login-button"
							type="button"
							onClick={() => window.location.assign("/compte")}
						>
							<UserRound size={19} /> <span>Mon espace</span>
						</button>
						<button
							className="mobile-menu-button icon-button"
							type="button"
							aria-label="Ouvrir le menu"
							onClick={() => setMobileMenuOpen(true)}
						>
							<Menu size={26} />
						</button>
					</div>
				</div>

				<form className="mobile-search page-shell" onSubmit={handleSearch}>
					<Search size={20} />
					<input
						value={query}
						onChange={(event) => setQuery(event.target.value)}
						placeholder="Quel produit recherchez-vous ?"
						aria-label="Rechercher un produit"
					/>
					<button type="submit" aria-label="Lancer la recherche">
						<ArrowRight size={19} />
					</button>
				</form>
			</header>

			<section className="hero page-shell" aria-labelledby="hero-title">
				<div className="hero-copy">
					<span className="eyebrow">
						<Sparkles size={16} /> Le comparateur malin en Tunisie
					</span>
					<h1 id="hero-title">
						Comparez les prix.
						<br />
						Achetez mieux.
					</h1>
					<p>Retrouvez les meilleures offres des boutiques tunisiennes, au même endroit.</p>

					<div className="hero-search-wrap">
						<form className="hero-search" onSubmit={handleSearch}>
							<Search size={21} />
							<input
								value={query}
								onChange={(event) => setQuery(event.target.value)}
								placeholder="Smartphone, PC, électroménager…"
								aria-label="Rechercher dans Soumly"
							/>
							<button type="submit">Rechercher</button>
						</form>
						{suggestions.length > 0 ? (
							<div
								className="search-suggestions"
								role="listbox"
								aria-label="Suggestions"
								style={{ maxHeight: 380, overflowY: "auto" }}
							>
								{suggestions.map((product) => (
									<button type="button" key={product.id} onClick={() => chooseSuggestion(product)}>
										<ProductArtwork src={product.image} alt="" />
										<span>
											<strong>{product.name}</strong>
											<small>À partir de {formatPrice(product.price)}</small>
										</span>
										<ChevronRight size={17} />
									</button>
								))}
							</div>
						) : null}
					</div>

					<section className="popular-searches" aria-label="Recherches populaires">
						<span>Populaire :</span>
						{["Galaxy S24", "AirPods Pro", "PC portable"].map((term) => (
							<button type="button" key={term} onClick={() => setQuery(term)}>
								{term}
							</button>
						))}
					</section>
				</div>

				<div className="hero-visual" role="img" aria-label="Produits populaires sur Soumly">
					{/* Local approved Soumly visual reference. */}
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img src="/assets/hero-products.png" alt="Téléphone, casque, ordinateur et air fryer" />
					<div className="hero-price-note">
						<TrendingPriceIcon />
						<span>
							<strong>
								{maximumDiscount > 0 ? `Jusqu’à −${maximumDiscount}%` : "Comparez les offres"}
							</strong>
							sur les offres du jour
						</span>
					</div>
				</div>
			</section>

			<section
				className="category-section page-shell"
				id="categories"
				aria-labelledby="categories-title"
			>
				<div className="section-heading compact-heading">
					<div>
						<span className="section-kicker">Explorez facilement</span>
						<h2 id="categories-title">Nos univers</h2>
					</div>
				</div>
				<div className="family-grid">
					{categories.map(({ slug, label, icon: Icon }) => (
						<a
							className="family-card"
							key={slug}
							href={`/categories/${slug}`}
							style={{ "--family-img": `url(${FAMILY_IMAGES[slug] ?? ""})` } as React.CSSProperties}
						>
							<span className="family-card-arrow">→</span>
							<span className="family-card-label">
								<span className="family-card-label-icon">
									<Icon size={16} strokeWidth={2} />
								</span>
								{label}
							</span>
						</a>
					))}
				</div>
				<div className="family-pills">
					{categories.map(({ slug, label, icon: Icon }, index) => (
						<a
							className={`family-pill${index === 0 ? " is-active" : ""}`}
							key={`pill-${slug}`}
							href={`/categories/${slug}`}
						>
							<Icon size={15} strokeWidth={2} />
							{label}
						</a>
					))}
				</div>
			</section>

			<section className="family-rails-section" aria-label="Produits par famille">
				{categories.map(({ slug, label }) => {
					const groupSlugs = new Set(
						(FAMILY_GROUPS[slug] ?? []).flatMap((group) =>
							group.categories.map((category) => category.slug),
						),
					);
					if (groupSlugs.size === 0) {
						for (const category of catalogCategories) {
							if (category.family === slug) groupSlugs.add(category.slug);
						}
					}
					const familyProducts = products
						.filter((product) => groupSlugs.has(product.categorySlug))
						.sort((a, b) => {
							// Smartphones category first, then other phones, then accessories
							const rank = (p: (typeof products)[number]) => {
								if (p.categorySlug === "smartphones" || p.categorySlug === "telephone-portables")
									return 0;
								if (
									p.categorySlug === "ordinateurs-portables" ||
									p.categorySlug === "ordinateurs-de-bureau"
								)
									return 1;
								if (p.categorySlug === "tablettes" || p.categorySlug === "moniteurs") return 2;
								if (
									[
										"peluches",
										"jouets-pour-bebes",
										"jouets-d-apprentissage",
										"hochets",
										"biberons",
										"tires-lait",
										"couches-jetables-pour-bebe",
										"poussettes-pour-bebe",
									].includes(p.categorySlug)
								)
									return 1;
								return 3;
							};
							const diff = rank(a) - rank(b);
							if (diff !== 0) return diff;
							// Within same category: higher price first (more premium devices)
							return b.price - a.price;
						})
						.slice(0, 12);
					if (familyProducts.length === 0) return null;
					return (
						<div className="page-shell family-rail-block" key={`rail-${slug}`}>
							<div className="section-heading compact-heading">
								<div>
									<span className="section-kicker">Famille</span>
									<h2>{label}</h2>
								</div>
								<div className="heading-actions">
									<a href={`/categories/${slug}`}>Voir tout</a>
									<RailControls
										railRef={{ current: familyRails.current[slug] ?? null }}
										label={`Faire défiler les produits ${label}`}
									/>
								</div>
							</div>
							<div
								className="product-rail"
								ref={(node) => {
									familyRails.current[slug] = node;
								}}
							>
								{familyProducts.map((product) => (
									<ProductCard
										key={product.id}
										product={product}
										isFavorite={favorites.has(product.id)}
										onFavorite={() => toggleFavorite(product)}
										onCompare={() => setSelectedProduct(product)}
									/>
								))}
							</div>
						</div>
					);
				})}
			</section>

			<section className="trust-strip page-shell" aria-label="Avantages Soumly">
				<div>
					<RefreshCw size={21} />
					<span>
						<strong>Prix importés</strong>
						Date du relevé indiquée
					</span>
				</div>
				<div>
					<ShieldCheck size={22} />
					<span>
						<strong>Boutiques référencées</strong>
						Liens directs vers les marchands
					</span>
				</div>
				<div>
					<Tag size={21} />
					<span>
						<strong>Comparaison gratuite</strong>
						Sans frais cachés
					</span>
				</div>
			</section>

			<section className="products-section page-shell" id="offres" aria-labelledby="offres-title">
				<div className="section-heading">
					<div>
						<span className="section-kicker">Sélection</span>
						<h2 id="offres-title">Les meilleurs prix du catalogue</h2>
						<p>Des produits référencés chez plusieurs boutiques, au meilleur prix trouvé.</p>
					</div>
					<div className="heading-actions">
						<a href="/categories">Voir tout</a>
						<RailControls railRef={offersRail} label="Faire défiler les offres" />
					</div>
				</div>

				<section className="filter-row" aria-label="Filtrer les offres">
					{offerFilters.map((filter) => (
						<button
							type="button"
							key={filter}
							className={activeFilter === filter ? "is-active" : ""}
							onClick={() => setActiveFilter(filter)}
						>
							{filter}
						</button>
					))}
				</section>

				<div className="product-rail" ref={offersRail}>
					{filteredOffers.map((product) => (
						<ProductCard
							key={product.id}
							product={product}
							isFavorite={favorites.has(product.id)}
							onFavorite={() => toggleFavorite(product)}
							onCompare={() => setSelectedProduct(product)}
						/>
					))}
				</div>
			</section>

			<section className="confidence-banner page-shell">
				<div className="confidence-icon">
					<ShoppingBag size={28} />
				</div>
				<div>
					<span className="section-kicker">Votre achat, plus simple</span>
					<h2>Un seul produit, plusieurs prix.</h2>
					<p>
						Soumly rassemble les offres disponibles pour vous aider à choisir la boutique adaptée à
						votre budget.
					</p>
				</div>
			</section>

			<section
				className="products-section page-shell"
				id="populaires"
				aria-labelledby="populaires-title"
			>
				<div className="section-heading">
					<div>
						<span className="section-kicker">Les plus recherchés</span>
						<h2 id="populaires-title">Produits populaires en Tunisie</h2>
						<p>Découvrez ce que les acheteurs comparent le plus en ce moment.</p>
					</div>
					<div className="heading-actions">
						<a href="/categories">Explorer</a>
						<RailControls railRef={popularRail} label="Faire défiler les produits populaires" />
					</div>
				</div>

				<div className="product-rail" ref={popularRail}>
					{products
						.filter((product) => product.stores > 1)
						.slice(0, 12)
						.map((product) => (
							<ProductCard
								key={product.id}
								product={product}
								isFavorite={favorites.has(product.id)}
								onFavorite={() => toggleFavorite(product)}
								onCompare={() => setSelectedProduct(product)}
							/>
						))}
				</div>
			</section>

			<section className="benefits-section">
				<div className="page-shell">
					<div className="section-heading centered-heading">
						<div>
							<span className="section-kicker">Pourquoi Soumly ?</span>
							<h2>Le bon prix, sans perdre votre temps.</h2>
							<p>Une expérience pensée pour acheter plus sereinement en Tunisie.</p>
						</div>
					</div>
					<div className="benefit-grid">
						<article>
							<span className="benefit-number">01</span>
							<Search size={25} />
							<h3>Trouvez rapidement</h3>
							<p>Recherchez un produit et consultez les offres réunies en un seul endroit.</p>
						</article>
						<article>
							<span className="benefit-number">02</span>
							<Tag size={25} />
							<h3>Comparez clairement</h3>
							<p>Prix, disponibilité et boutiques : les informations utiles sont faciles à lire.</p>
						</article>
						<article>
							<span className="benefit-number">03</span>
							<CheckCircle2 size={25} />
							<h3>Choisissez sereinement</h3>
							<p>Accédez aux marchands vérifiés et sélectionnez l&apos;offre qui vous convient.</p>
						</article>
					</div>
				</div>
			</section>

			<section className="stores-section page-shell" aria-labelledby="stores-title">
				<div className="section-heading">
					<div>
						<span className="section-kicker">Sources référencées</span>
						<h2 id="stores-title">Boutiques comparées par Soumly</h2>
						<p>Les offres disponibles proviennent actuellement de ces deux marchands tunisiens.</p>
					</div>
				</div>
				<div className="store-grid">
					{storeNames.map((store) => (
						<div className="store-logo" key={store}>
							<span>{store.slice(0, 1)}</span>
							<strong>{store}</strong>
							<small>Référencée</small>
						</div>
					))}
				</div>
			</section>

			<section className="guides-section page-shell" id="guides" aria-labelledby="guides-title">
				<div className="section-heading">
					<div>
						<span className="section-kicker">Conseils pratiques</span>
						<h2 id="guides-title">Guides pour mieux acheter</h2>
						<p>Des repères simples avant de choisir votre prochain produit.</p>
					</div>
					<a className="text-link" href="/guides">
						Tous les guides <ChevronRight size={17} />
					</a>
				</div>
				<div className="guide-grid">
					<article className="guide-card guide-card--violet">
						<span>
							<Smartphone size={24} />
						</span>
						<small>Smartphones · 6 min</small>
						<h3>Comment choisir un smartphone en 2026 ?</h3>
						<p>Écran, autonomie, photo et stockage : les critères vraiment utiles.</p>
						<a href="/guides/choisir-smartphone-2026">
							Lire le guide <ArrowRight size={17} />
						</a>
					</article>
					<article className="guide-card guide-card--coral">
						<span>
							<Laptop size={24} />
						</span>
						<small>Informatique · 5 min</small>
						<h3>Quel PC portable pour vos besoins ?</h3>
						<p>Études, travail ou création : trouvez la configuration la plus cohérente.</p>
						<a href="/guides/choisir-pc-portable">
							Lire le guide <ArrowRight size={17} />
						</a>
					</article>
					<article className="guide-card guide-card--navy">
						<span>
							<BookOpen size={24} />
						</span>
						<small>Conseils · 4 min</small>
						<h3>Reconnaître une vraie bonne affaire</h3>
						<p>Comparez le prix, le vendeur et les conditions avant de décider.</p>
						<a href="/guides/comparer-prix-en-ligne">
							Lire le guide <ArrowRight size={17} />
						</a>
					</article>
				</div>
			</section>

			<section className="alert-section page-shell">
				<div>
					<span className="alert-icon">
						<Bell size={24} />
					</span>
					<div>
						<span className="section-kicker">Ne manquez aucune baisse</span>
						<h2>Créez votre alerte de prix.</h2>
						<p>Choisissez un produit et soyez informé lorsque son prix devient plus intéressant.</p>
					</div>
				</div>
				<a href="/compte">
					Créer une alerte <ArrowRight size={18} />
				</a>
			</section>

			<footer className="site-footer">
				<div className="page-shell footer-grid">
					<div className="footer-brand">
						<Logo />
						<p>Comparez les prix des boutiques tunisiennes et prenez une décision plus éclairée.</p>
						<span className="demo-note">
							Vérifiez toujours le prix final et la disponibilité chez le marchand.
						</span>
					</div>
					<div>
						<h3>Soumly</h3>
						<a href="/categories">Catégories</a>

						<a href="/guides">Guides d’achat</a>
					</div>
					<div>
						<h3>Aide</h3>
						<a href="/a-propos">Comment ça marche ?</a>
						<a href="/boutiques">Boutiques référencées</a>
						<a href="/contact">Nous contacter</a>
					</div>
					<div>
						<h3>Légal</h3>
						<a href="/confidentialite">Confidentialité</a>
						<a href="/conditions">Conditions d&apos;utilisation</a>
						<a href="/mentions-legales">Mentions légales</a>
					</div>
				</div>
				<div className="page-shell footer-bottom">
					<span>© 2026 Soumly. Tous droits réservés.</span>
					<span>Fait pour comparer en Tunisie 🇹🇳</span>
				</div>
			</footer>

			<nav className="mobile-bottom-nav" aria-label="Navigation mobile">
				<a className="is-active" href="#accueil">
					<Home size={22} /> <span>Accueil</span>
				</a>
				<a href="/categories">
					<Grid3X3 size={22} /> <span>Catégories</span>
				</a>
				<a href="/favoris">
					<Heart size={22} fill={favorites.size ? "currentColor" : "none"} />
					<span>Favoris</span>
					{favorites.size ? <small>{favorites.size}</small> : null}
				</a>
				<a href="/compte">
					<UserRound size={22} /> <span>Compte</span>
				</a>
			</nav>

			{mobileMenuOpen ? (
				<div
					className="mobile-menu-overlay"
					aria-hidden={!mobileMenuOpen}
					onClickCapture={() => setMobileMenuOpen(false)}
				>
					<aside
						className="mobile-menu"
						role="dialog"
						aria-modal="true"
						aria-label="Menu Soumly"
						onClick={(event) => event.stopPropagation()}
						onKeyDown={(event) => {
							if (event.key === "Escape") setMobileMenuOpen(false);
						}}
					>
						<div className="mobile-menu__top">
							<Logo />
							<button
								className="icon-button"
								type="button"
								onClick={() => setMobileMenuOpen(false)}
							>
								<X size={24} />
							</button>
						</div>
						<nav>
							<a href="/categories" onClick={() => setMobileMenuOpen(false)}>
								<Grid3X3 size={20} /> Catégories <ChevronRight size={18} />
							</a>

							<a href="/guides" onClick={() => setMobileMenuOpen(false)}>
								<BookOpen size={20} /> Guides d&apos;achat <ChevronRight size={18} />
							</a>
						</nav>
						<a className="menu-login" href="/compte">
							<UserRound size={20} /> Mon espace
						</a>
					</aside>
				</div>
			) : null}

			{selectedProduct ? (
				<div className="modal-overlay" onClickCapture={() => setSelectedProduct(null)}>
					<section
						className="comparison-modal"
						role="dialog"
						aria-modal="true"
						aria-labelledby="comparison-title"
						onClick={(event) => event.stopPropagation()}
						onKeyDown={(event) => {
							if (event.key === "Escape") setSelectedProduct(null);
						}}
					>
						<div className="modal-handle" />
						<div className="modal-top">
							<div>
								<span className="section-kicker">Comparaison rapide</span>
								<h2 id="comparison-title">{selectedProduct.name}</h2>
							</div>
							<button
								className="icon-button"
								type="button"
								onClick={() => setSelectedProduct(null)}
								aria-label="Fermer"
							>
								<X size={22} />
							</button>
						</div>
						<div className="modal-product">
							<ProductArtwork src={selectedProduct.image} alt={selectedProduct.name} />
							<div>
								<span>Meilleur prix actuel</span>
								<strong>{formatPrice(selectedProduct.price)}</strong>
								<small>
									{selectedProduct.stores} boutique{selectedProduct.stores > 1 ? "s" : ""}{" "}
									référencée{selectedProduct.stores > 1 ? "s" : ""}
								</small>
							</div>
						</div>
						<div className="merchant-list">
							{selectedProduct.offers.map((offer, index) => (
								<article key={offer.store}>
									<span className="merchant-logo">{offer.store.slice(0, 1)}</span>
									<span>
										<strong>{offer.store}</strong>
										<small>{offer.availability}</small>
									</span>
									<span className="merchant-price">
										<strong>{formatPrice(offer.price)}</strong>
										{index === 0 ? <small>Meilleur prix</small> : null}
									</span>
									<a href={offer.url} target="_blank" rel="noopener noreferrer">
										Voir l&apos;offre
									</a>
								</article>
							))}
						</div>
						<p className="modal-disclaimer">
							Les prix proviennent du dernier relevé importé. Vérifiez le prix final et la
							disponibilité chez le marchand.
						</p>
						<a className="compare-button" href={`/produit/${selectedProduct.id}`}>
							Voir la comparaison détaillée <ArrowRight size={16} />
						</a>
					</section>
				</div>
			) : null}

			<div className={`toast ${toast ? "is-visible" : ""}`} role="status" aria-live="polite">
				<CheckCircle2 size={19} /> {toast}
			</div>
		</main>
	);
}

function TrendingPriceIcon() {
	return (
		<span className="trend-icon" aria-hidden="true">
			<span />
			<span />
			<span />
		</span>
	);
}
