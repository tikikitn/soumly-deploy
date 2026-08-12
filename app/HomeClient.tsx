// Soumly homepage client shell — receives pre-computed data from the server.
// MUST NOT import products.ts / products.server.ts / the full catalog.
"use client";
/* eslint-disable @next/next/no-html-link-for-pages, @next/next/no-location-assign-relative-destination */

import {
	ArrowRight,
	Bell,
	BookOpen,
	CheckCircle2,
	ChevronRight,
	CookingPot,
	Dumbbell,
	Grid3X3,
	Heart,
	Home,
	Laptop,
	Menu,
	Microwave,
	PawPrint,
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
import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { CATALOG_UNIVERSES } from "../lib/catalog-navigation";
import {
	type Family,
	formatPrice,
	type Product,
	type ProductSummary,
} from "./(soumly-pages)/_data/content.shared";

const FAMILY_IMAGES: Record<string, string> = {
	informatique: "/assets/families/informatique-v3.webp",
	telephonie: "/assets/families/telephonie-v3.webp",
	"sante-beaute": "/assets/families/sante-beaute-v3.webp",
	electromenager: "/assets/families/electromenager-v3.webp",
	"petit-electromenager": "/assets/families/petit-electromenager-v3.webp",
	cuisine: "/assets/families/cuisine-v3.webp",
	"maison-jardin": "/assets/families/maison-jardin-v3.webp",
	"bebe-enfants": "/assets/families/bebe-enfants-v3.webp",
};

const UNIVERSE_IMAGES: Record<string, string> = {
	"high-tech": "/assets/universes/01-high-tech.webp",
	electromenager: "/assets/universes/02-electromenager.webp",
	"maison-cuisine": "/assets/universes/03-maison-cuisine.webp",
	"beaute-bien-etre": "/assets/universes/04-beaute-bien-etre.webp",
	"mode-accessoires": "/assets/universes/05-mode-accessoires.webp",
	"bebe-enfants": "/assets/universes/06-bebe-enfants.webp",
	"sport-fitness": "/assets/universes/07-sport-fitness.webp",
	"bureau-papeterie": "/assets/universes/08-bureau-papeterie.webp",
	animaux: "/assets/universes/09-animaux.webp",
};

function UniverseIcon({ name }: { name: string }) {
	const size = 16;
	const stroke = 2;
	switch (name) {
		case "high-tech":
			return <Laptop size={size} strokeWidth={stroke} />;
		case "electromenager":
			return <Refrigerator size={size} strokeWidth={stroke} />;
		case "maison-cuisine":
			return <Home size={size} strokeWidth={stroke} />;
		case "beaute-bien-etre":
			return <Sparkles size={size} strokeWidth={stroke} />;
		case "mode-accessoires":
			return <ShoppingBag size={size} strokeWidth={stroke} />;
		case "bebe-enfants":
			return <ToyBrick size={size} strokeWidth={stroke} />;
		case "sport-fitness":
			return <Dumbbell size={size} strokeWidth={stroke} />;
		case "bureau-papeterie":
			return <BookOpen size={size} strokeWidth={stroke} />;
		case "animaux":
			return <PawPrint size={size} strokeWidth={stroke} />;
		default:
			return <Grid3X3 size={size} strokeWidth={stroke} />;
	}
}

const FEATURED_ICONS: Record<string, typeof Laptop> = {
	informatique: Laptop,
	telephonie: Smartphone,
	electromenager: Refrigerator,
	"petit-electromenager": Microwave,
	cuisine: CookingPot,
	"sante-beaute": Sparkles,
	"maison-jardin": Home,
	"bebe-enfants": ToyBrick,
};

const storeNames = ["Tunisianet", "Spacenet"];

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
		<img className={className} src={src} alt={alt} loading="lazy" />
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
							{product.rating > 0 ? (
								<>
									{product.rating} · {product.reviews} avis
								</>
							) : null}
						</span>
					</div>
					<div className="price-row">
						<strong>{formatPrice(product.price)}</strong>
						{product.oldPrice > product.price ? <del>{formatPrice(product.oldPrice)}</del> : null}
					</div>
					<span className="product-stores">
						<Store size={14} /> {product.stores} boutique{product.stores > 1 ? "s" : ""}
					</span>
				</div>
			</a>

			<button className="compare-button" type="button" onClick={onCompare}>
				Comparer les prix
			</button>
		</article>
	);
}

function RailControls({ getRail, label }: { getRail: () => HTMLDivElement | null; label: string }) {
	const scroll = (direction: -1 | 1) => {
		const rail = getRail();
		if (!rail) return;
		rail.scrollBy({ left: direction * rail.clientWidth * 0.8, behavior: "smooth" });
	};
	return (
		<div className="rail-controls">
			<button type="button" aria-label={`${label}, précédent`} onClick={() => scroll(-1)}>
				<ChevronRight size={19} className="flip" />
			</button>
			<button type="button" aria-label={`${label}, suivant`} onClick={() => scroll(1)}>
				<ChevronRight size={19} />
			</button>
		</div>
	);
}

type HomepageData = {
	families: Array<Family & { categoryCount: number; productCount: number }>;
	familyRails: Array<{ slug: string; label: string; products: ProductSummary[] }>;
	offerFilters: string[];
	offersByCategory: Record<string, ProductSummary[]>;
	popular: ProductSummary[];
	maximumDiscount: number;
};

export default function HomeClient({ data }: { data: HomepageData }) {
	const [query, setQuery] = useState("");
	const [debouncedQuery, setDebouncedQuery] = useState("");
	const [activeFilter, setActiveFilter] = useState("Tout");
	const [favorites, setFavorites] = useState<Set<string>>(new Set());
	const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [toast, setToast] = useState("");
	const [suggestions, setSuggestions] = useState<ProductSummary[]>([]);
	const offersRail = useRef<HTMLDivElement>(null);
	const familyRails = useRef<Record<string, HTMLDivElement | null>>({});
	const popularRail = useRef<HTMLDivElement>(null);
	const { familyRails: rails, offersByCategory, popular, maximumDiscount } = data;

	useEffect(() => {
		const frame = window.requestAnimationFrame(() => setFavorites(readFavorites()));
		return () => window.cancelAnimationFrame(frame);
	}, []);

	// Server-backed autocomplete: fetch suggestions, debounced, cancelled on stale.
	useEffect(() => {
		const normalized = debouncedQuery.trim();
		if (normalized.length < 2) {
			const frame = window.requestAnimationFrame(() => setSuggestions([]));
			return () => window.cancelAnimationFrame(frame);
		}
		const controller = new AbortController();
		const timer = window.setTimeout(async () => {
			try {
				const response = await fetch(
					`/api/search/suggestions?q=${encodeURIComponent(normalized)}`,
					{
						signal: controller.signal,
					},
				);
				if (!response.ok) return;
				const payload = (await response.json()) as { results: ProductSummary[] };
				setSuggestions(payload.results ?? []);
			} catch {
				// aborted or network error — keep previous suggestions
			}
		}, 250);
		return () => {
			window.clearTimeout(timer);
			controller.abort();
		};
	}, [debouncedQuery]);

	useEffect(() => {
		const t = window.setTimeout(() => setDebouncedQuery(query), 200);
		return () => window.clearTimeout(t);
	}, [query]);

	const filteredOffers = useMemo(() => {
		const pool = offersByCategory[activeFilter] ?? offersByCategory.Tout ?? [];
		return pool.map(summaryToProduct);
	}, [activeFilter, offersByCategory]);

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

	const chooseSuggestion = (product: ProductSummary) => {
		window.location.assign(`/produit/${product.id}`);
	};

	const categories = data.families
		.filter((f) => FEATURED_ICONS[f.slug as keyof typeof FEATURED_ICONS])
		.map((f) => ({
			slug: f.slug,
			label: f.label,
			icon: FEATURED_ICONS[f.slug as keyof typeof FEATURED_ICONS],
		}));

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
					{}
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
					{CATALOG_UNIVERSES.map((universe, index) => (
						<a
							className={`family-card uni-card uni-tone-${(index % 4) + 1}`}
							key={universe.slug}
							href={`/univers/${universe.slug}`}
							style={{ "--family-img": `url(${UNIVERSE_IMAGES[universe.slug] ?? ""})` } as React.CSSProperties}
						>
							<span className="family-card-arrow">→</span>
							<span className="family-card-label">
								<span className="family-card-label-icon">
									<UniverseIcon name={universe.slug} />
								</span>
								{universe.label}
							</span>
							<span className="uni-card-tagline">{universe.tagline}</span>
						</a>
					))}
					<a className="family-card guides-promo-card" href="/guides" aria-label="Guides d’achat">
						<span className="family-card-arrow">→</span>
						<span className="guides-promo-visual" aria-hidden="true">
							<span className="guides-promo-glass">
								<Search size={22} strokeWidth={2.2} />
							</span>
							<span className="guides-promo-shapes">
								<span className="g-shape g-shape-1" />
								<span className="g-shape g-shape-2" />
								<span className="g-shape g-shape-3" />
							</span>
						</span>
						<span className="guides-promo-body">
							<span className="guides-promo-title">Guides d’achat</span>
							<span className="guides-promo-desc">
								Nos conseils pour choisir le bon produit au meilleur prix.
							</span>
							<span className="guides-promo-cta">Découvrir les guides</span>
						</span>
					</a>
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
				{rails.map((rail) => (
					<div className="page-shell family-rail-block" key={`rail-${rail.slug}`}>
						<div className="section-heading compact-heading">
							<div>
								<span className="section-kicker">Famille</span>
								<h2>{rail.label}</h2>
							</div>
							<div className="heading-actions">
								<a href={`/categories/${rail.slug}`}>Voir tout</a>
								<RailControls
									getRail={() => familyRails.current[rail.slug] ?? null}
									label={`Faire défiler les produits ${rail.label}`}
								/>
							</div>
						</div>
						<div
							className="product-rail"
							ref={(node) => {
								familyRails.current[rail.slug] = node;
							}}
						>
							{rail.products.map((summary) => {
								const product = summaryToProduct(summary);
								return (
									<ProductCard
										key={product.id}
										product={product}
										isFavorite={favorites.has(product.id)}
										onFavorite={() => toggleFavorite(product)}
										onCompare={() => setSelectedProduct(product)}
									/>
								);
							})}
						</div>
					</div>
				))}
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
						<RailControls getRail={() => offersRail.current} label="Faire défiler les offres" />
					</div>
				</div>

				<section className="filter-row" aria-label="Filtrer les offres">
					{data.offerFilters.map((filter) => (
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
						<RailControls
							getRail={() => popularRail.current}
							label="Faire défiler les produits populaires"
						/>
					</div>
				</div>

				<div className="product-rail" ref={popularRail}>
					{popular.map((summary) => {
						const product = summaryToProduct(summary);
						return (
							<ProductCard
								key={product.id}
								product={product}
								isFavorite={favorites.has(product.id)}
								onFavorite={() => toggleFavorite(product)}
								onCompare={() => setSelectedProduct(product)}
							/>
						);
					})}
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
						<div className="modal-product-note">
							<p>Voir la comparaison détaillée pour tous les marchands et les offres.</p>
						</div>
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
