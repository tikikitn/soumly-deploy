"use client";

import {
  ArrowRight,
  Bell,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  Gamepad2,
  Grid3X3,
  Heart,
  Home,
  Laptop,
  Menu,
  MonitorPlay,
  RefreshCw,
  Search,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Star,
  Store,
  Tag,
  UserRound,
  WashingMachine,
  X,
  Armchair,
} from "lucide-react";
import {
  type ComponentType,
  type FormEvent,
  type RefObject,
  useMemo,
  useRef,
  useState,
  useEffect,
} from "react";
import { useRouter } from "next/navigation";

import { products } from "./products-data";
import { categories as categoryList } from "./categories";
type Product = import("./products-data").Product;

type IconType = ComponentType<{ size?: number; strokeWidth?: number }>;

const categories: Array<{ label: string; icon: IconType }> = categoryList.map((label) => ({
  label,
  icon: label === "Smartphones" ? Smartphone
    : label === "PC Portable" || label === "PC de Bureau" || label === "Ordinateur" ? Laptop
    : label === "Casque & Écouteurs" || label === "Audio" || label === "TV" ? MonitorPlay
    : label === "Électroménager" || label === "Climatiseur" ? WashingMachine
    : label === "Gaming" ? Gamepad2
    : label === "Maison" ? Armchair
    : label === "Beauté" ? Sparkles
    : label === "Sport" ? Dumbbell
    : Grid3X3,
}));



const storeNames = ["Mytek", "Tunisianet", "Spacenet", "Graiet", "Scoop", "Wiki"];
const offerFilters = ["Tout", ...categoryList];

function formatPrice(value: number) {
  return `${new Intl.NumberFormat("fr-FR").format(value)} DT`;
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
    <span className="stars" aria-label={`${rating} sur 5`}>
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

function ProductArtwork({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
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
  const router = useRouter();
  return (
    <article className="product-card">
      <div className="product-card__top">
        <span className="discount-badge">−{product.discount}%</span>
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

      <button className="product-card__content" type="button" onClick={() => router.push(`/produit/${product.id}`)}>
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
              {product.rating > 0 ? `${product.rating.toFixed(1).replace(".", ",")}${product.reviews > 0 ? ` (${product.reviews})` : ""}` : "Nouveau"}
            </span>
          </div>
          <strong className="current-price">{formatPrice(product.price)}</strong>
          <span className="old-price">{formatPrice(product.oldPrice)}</span>
          <span className="store-count">
            <Store size={16} /> {product.stores} boutiques
          </span>
        </div>
      </button>

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
    <div className="rail-controls" aria-label={label}>
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
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("Tout");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState("");
  const offersRail = useRef<HTMLDivElement>(null);
  const popularRail = useRef<HTMLDivElement>(null);

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
  }, [query]);

  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedQuery(query), 200);
    return () => window.clearTimeout(t);
  }, [query]);

  const filteredOffers = useMemo(() => {
    if (activeFilter === "Tout" || activeFilter === "Maison") return products.slice(0, 4);
    return [
      ...products.filter((product) => product.category === activeFilter),
      ...products.filter((product) => product.category !== activeFilter),
    ].slice(0, 4);
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
    router.push(`/recherche?q=${encodeURIComponent(term)}`);
  };

  const toggleFavorite = (product: Product) => {
    setFavorites((current) => {
      const next = new Set(current);
      if (next.has(product.id)) {
        next.delete(product.id);
        showToast(`${product.name} retiré des favoris`);
      } else {
        next.add(product.id);
        showToast(`${product.name} ajouté aux favoris`);
      }
      return next;
    });
  };

  const chooseSuggestion = (product: Product) => {
    setQuery(product.name);
    setSelectedProduct(product);
  };

  return (
    <main id="accueil">
      <header className="site-header">
        <div className="header-main page-shell">
          <Logo />

          <nav className="desktop-nav" aria-label="Navigation principale">
            <a href="/categories">Catégories</a>
            <a href="/promotions">Promotions</a>
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
              onClick={() => router.push("/favoris")}
            >
              <Heart size={22} />
              {favorites.size > 0 ? <span>{favorites.size}</span> : null}
            </button>
            <button
              className="login-button"
              type="button"
              onClick={() => router.push("/compte")}
            >
              <UserRound size={19} /> <span>Se connecter</span>
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
          <p>
            Retrouvez les meilleures offres des boutiques tunisiennes, au même
            endroit.
          </p>

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
              <div className="search-suggestions" role="listbox" aria-label="Suggestions" style={{ maxHeight: 380, overflowY: "auto" }}>
                {suggestions.map((product) => (
                  <button
                    type="button"
                    key={product.id}
                    onClick={() => chooseSuggestion(product)}
                  >
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

          <div className="popular-searches" aria-label="Recherches populaires">
            <span>Populaire :</span>
            {["Galaxy S24", "AirPods Pro", "PC portable"].map((term) => (
              <button type="button" key={term} onClick={() => setQuery(term)}>
                {term}
              </button>
            ))}
          </div>
        </div>

        <div className="hero-visual" aria-label="Produits populaires sur Soumly">
          {/* Local approved Soumly visual reference. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/hero-products.png" alt="Téléphone, casque, ordinateur et air fryer" />
          <div className="hero-price-note">
            <TrendingPriceIcon />
            <span>
              <strong>Jusqu&apos;à −23%</strong>
              sur les offres du jour
            </span>
          </div>
        </div>
      </section>

      <section className="category-section page-shell" id="categories" aria-labelledby="categories-title">
        <div className="section-heading compact-heading">
          <div>
            <span className="section-kicker">Explorez facilement</span>
            <h2 id="categories-title">Toutes les catégories</h2>
          </div>
          <a href="/promotions">
            Voir tout <ChevronRight size={17} />
          </a>
        </div>
        <div className="category-rail">
          {categories.map(({ label, icon: Icon }) => (
            <button
              type="button"
              className="category-item"
              key={label}
              onClick={() => {
                setActiveFilter(label === "Maison" ? "Maison" : label);
                document.querySelector("#offres")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <span>
                <Icon size={27} strokeWidth={1.8} />
              </span>
              {label}
            </button>
          ))}
        </div>
      </section>

      <section className="trust-strip page-shell" aria-label="Avantages Soumly">
        <div>
          <RefreshCw size={21} />
          <span>
            <strong>Prix à jour</strong>
            Offres actualisées
          </span>
        </div>
        <div>
          <ShieldCheck size={22} />
          <span>
            <strong>Boutiques vérifiées</strong>
            Achetez en confiance
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
            <span className="section-kicker">Sélection du jour</span>
            <h2 id="offres-title">Meilleures offres du jour</h2>
            <p>Les baisses de prix qui méritent votre attention aujourd&apos;hui.</p>
          </div>
          <div className="heading-actions">
            <a href="/categories">Voir tout</a>
            <RailControls railRef={offersRail} label="Faire défiler les offres" />
          </div>
        </div>

        <div className="filter-row" aria-label="Filtrer les offres">
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
        </div>

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
            Soumly rassemble les offres disponibles pour vous aider à choisir la
            boutique adaptée à votre budget.
          </p>
        </div>
        <a href="/promotions">
          Commencer à comparer <ArrowRight size={18} />
        </a>
      </section>

      <section className="products-section page-shell" id="populaires" aria-labelledby="populaires-title">
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
          {products.slice(4).map((product) => (
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
            <span className="section-kicker">Nos partenaires</span>
            <h2 id="stores-title">Boutiques tunisiennes vérifiées</h2>
            <p>Comparez les offres proposées par des enseignes connues du marché tunisien.</p>
          </div>
          <a className="text-link" href="/promotions">
            Voir les offres <ArrowRight size={17} />
          </a>
        </div>
        <div className="store-grid">
          {storeNames.map((store, index) => (
            <div className="store-logo" key={store}>
              <span>{store.slice(0, 1)}</span>
              <strong>{store}</strong>
              {index < 3 ? <small>Vérifiée</small> : null}
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
            <button type="button" onClick={() => showToast("Guide bientôt disponible")}>
              Lire le guide <ArrowRight size={17} />
            </button>
          </article>
          <article className="guide-card guide-card--coral">
            <span>
              <Laptop size={24} />
            </span>
            <small>Informatique · 5 min</small>
            <h3>Quel PC portable pour vos besoins ?</h3>
            <p>Études, travail ou création : trouvez la configuration la plus cohérente.</p>
            <button type="button" onClick={() => showToast("Guide bientôt disponible")}>
              Lire le guide <ArrowRight size={17} />
            </button>
          </article>
          <article className="guide-card guide-card--navy">
            <span>
              <BookOpen size={24} />
            </span>
            <small>Conseils · 4 min</small>
            <h3>Reconnaître une vraie bonne affaire</h3>
            <p>Comparez le prix, le vendeur et les conditions avant de décider.</p>
            <button type="button" onClick={() => showToast("Guide bientôt disponible")}>
              Lire le guide <ArrowRight size={17} />
            </button>
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
        <button type="button" onClick={() => showToast("Votre future alerte est prête à être configurée")}>
          Créer une alerte <ArrowRight size={18} />
        </button>
      </section>

      <footer className="site-footer">
        <div className="page-shell footer-grid">
          <div className="footer-brand">
            <Logo />
            <p>
              Comparez les prix des boutiques tunisiennes et prenez une décision
              plus éclairée.
            </p>
            <span className="demo-note">Prototype visuel — les prix affichés sont des données de démonstration.</span>
          </div>
          <div>
            <h3>Soumly</h3>
            <a href="/categories">Catégories</a>
            <a href="/promotions">Promotions</a>
            <a href="/guides">Guides d’achat</a>
          </div>
          <div>
            <h3>Aide</h3>
            <a href="#accueil">Comment ça marche ?</a>
            <a href="#stores-title">Boutiques partenaires</a>
            <a href="#accueil">Nous contacter</a>
          </div>
          <div>
            <h3>Légal</h3>
            <a href="#accueil">Confidentialité</a>
            <a href="#accueil">Conditions d&apos;utilisation</a>
            <a href="#accueil">Mentions légales</a>
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
        <button
          type="button"
          onClick={() =>
            showToast(
              favorites.size
                ? `${favorites.size} produit${favorites.size > 1 ? "s" : ""} favori${favorites.size > 1 ? "s" : ""}`
                : "Votre liste de favoris est vide",
            )
          }
        >
          <Heart size={22} fill={favorites.size ? "currentColor" : "none"} />
          <span>Favoris</span>
          {favorites.size ? <small>{favorites.size}</small> : null}
        </button>
        <button type="button" onClick={() => router.push("/compte")}>
          <UserRound size={22} /> <span>Compte</span>
        </button>
      </nav>

      {mobileMenuOpen ? (
        <div className="mobile-menu-overlay" role="presentation" onClick={() => setMobileMenuOpen(false)}>
          <aside
            className="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu Soumly"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mobile-menu__top">
              <Logo />
              <button className="icon-button" type="button" onClick={() => setMobileMenuOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <nav>
              <a href="/categories" onClick={() => setMobileMenuOpen(false)}>
                <Grid3X3 size={20} /> Catégories <ChevronRight size={18} />
              </a>
              <a href="/promotions" onClick={() => setMobileMenuOpen(false)}>
                <Tag size={20} /> Promotions <ChevronRight size={18} />
              </a>
              <a href="/guides" onClick={() => setMobileMenuOpen(false)}>
                <BookOpen size={20} /> Guides d&apos;achat <ChevronRight size={18} />
              </a>
            </nav>
            <button className="menu-login" type="button" onClick={() => router.push("/compte")}>
              <UserRound size={20} /> Se connecter
            </button>
          </aside>
        </div>
      ) : null}

      {selectedProduct ? (
        <div className="modal-overlay" role="presentation" onClick={() => setSelectedProduct(null)}>
          <section
            className="comparison-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="comparison-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-handle" />
            <div className="modal-top">
              <div>
                <span className="section-kicker">Comparaison rapide</span>
                <h2 id="comparison-title">{selectedProduct.name}</h2>
              </div>
              <button className="icon-button" type="button" onClick={() => setSelectedProduct(null)} aria-label="Fermer">
                <X size={22} />
              </button>
            </div>
            <div className="modal-product">
              <ProductArtwork src={selectedProduct.image} alt={selectedProduct.name} />
              <div>
                <span>Meilleur prix actuel</span>
                <strong>{formatPrice(selectedProduct.price)}</strong>
                <small>{selectedProduct.stores} boutiques comparées</small>
              </div>
            </div>
            <div className="merchant-list">
              {["Mytek", "Tunisianet", "Spacenet"].map((store, index) => {
                const price = selectedProduct.price + index * Math.max(12, Math.round(selectedProduct.price * 0.025));
                return (
                  <article key={store}>
                    <span className="merchant-logo">{store.slice(0, 1)}</span>
                    <span>
                      <strong>{store}</strong>
                      <small>{index === 0 ? "En stock · Livraison offerte" : "En stock · Livraison 24–48 h"}</small>
                    </span>
                    <span className="merchant-price">
                      <strong>{formatPrice(price)}</strong>
                      {index === 0 ? <small>Meilleur prix</small> : null}
                    </span>
                    <button type="button" onClick={() => showToast(`Ouverture de l'offre ${store}`)}>
                      Voir l&apos;offre
                    </button>
                  </article>
                );
              })}
            </div>
            <p className="modal-disclaimer">
              Prix de démonstration. Vérifiez toujours le prix final et la disponibilité chez le marchand.
            </p>
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
