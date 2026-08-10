"use client";

import {
  BadgePercent,
  ChevronDown,
  Filter,
  RefreshCw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Store,
  Tag,
  X,
} from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import Link from "../../components/NativeLink";
import { categories, getCategory, getFamilies, getFamilyCategories, products, type Product } from "../_data/content";
import { EmptyState, ProductCard, SoumlyIcon } from "./ui";

function Breadcrumbs({ current, parent }: { current: string; parent?: string }) {
  return (
    <nav className="sm-breadcrumbs" aria-label="Fil d’Ariane">
      <Link href="/">Accueil</Link><span>/</span>
      {parent ? <><Link href="/categories">{parent}</Link><span>/</span></> : null}
      <strong>{current}</strong>
    </nav>
  );
}

function TrustStrip() {
  return (
    <div className="sm-trust-strip">
      <span><RefreshCw size={20} /> Prix du dernier relevé</span>
      <span><Store size={20} /> Boutiques référencées</span>
      <span><ShieldCheck size={20} /> Liens marchands directs</span>
    </div>
  );
}

type FilterPanelProps = {
  items: Product[];
  selectedBrands: string[];
  setSelectedBrands: (brands: string[]) => void;
  onlyDeals: boolean;
  setOnlyDeals: (value: boolean) => void;
  maxPrice: number;
  setMaxPrice: (value: number) => void;
  close?: () => void;
};

function FilterPanel({ items, selectedBrands, setSelectedBrands, onlyDeals, setOnlyDeals, maxPrice, setMaxPrice, close }: FilterPanelProps) {
  const brands = [...new Set(items.map((product) => product.brand))]
    .filter((brand) => brand !== "Autre marque")
    .sort((first, second) => first.localeCompare(second, "fr"))
    .slice(0, 18);
  const ceiling = Math.max(100, Math.ceil(Math.max(...items.map((product) => product.price), 100) / 100) * 100);
  const toggleBrand = (brand: string) => setSelectedBrands(selectedBrands.includes(brand) ? selectedBrands.filter((item) => item !== brand) : [...selectedBrands, brand]);

  return (
    <aside className="sm-filter-panel">
      <div className="sm-filter-heading"><h2>Filtres</h2>{close ? <button type="button" onClick={close} aria-label="Fermer les filtres"><X size={21} /></button> : null}</div>
      <div className="sm-filter-group">
        <h3>Prix maximum</h3>
        <label className="sm-price-inputs">Jusqu’à <input value={maxPrice} min="0" max={ceiling} step="1" type="number" onChange={(event) => setMaxPrice(Math.max(0, Number(event.target.value)))} aria-label="Prix maximum" /> DT</label>
        <input className="sm-range" type="range" min="0" max={ceiling} value={Math.min(maxPrice, ceiling)} onChange={(event) => setMaxPrice(Number(event.target.value))} aria-label="Prix maximum" />
      </div>
      <div className="sm-filter-group">
        <h3>Marques</h3>
        {brands.map((brand) => <label className="sm-check-row" key={brand}><input type="checkbox" checked={selectedBrands.includes(brand)} onChange={() => toggleBrand(brand)} /><span>{brand}</span><small>{items.filter((product) => product.brand === brand).length}</small></label>)}
      </div>
      <div className="sm-filter-group">
        <h3>Offres</h3>
        <label className="sm-check-row"><input type="checkbox" checked={onlyDeals} onChange={(event) => setOnlyDeals(event.target.checked)} /><span>En promotion</span></label>
      </div>
      <button className="sm-secondary-button sm-full-button" type="button" onClick={() => { setSelectedBrands([]); setOnlyDeals(false); setMaxPrice(ceiling); }}>Réinitialiser</button>
    </aside>
  );
}

function sortProducts(items: Product[], sort: string) {
  const result = [...items];
  if (sort === "price-asc") return result.sort((first, second) => first.price - second.price);
  if (sort === "price-desc") return result.sort((first, second) => second.price - first.price);
  if (sort === "discount") return result.sort((first, second) => second.discount - first.discount);
  return result.sort((first, second) => first.name.localeCompare(second.name, "fr"));
}

function Catalog({ baseProducts }: { baseProducts: Product[] }) {
  const initialCeiling = Math.max(100, Math.ceil(Math.max(...baseProducts.map((product) => product.price), 100) / 100) * 100);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [onlyDeals, setOnlyDeals] = useState(false);
  const [maxPrice, setMaxPrice] = useState(initialCeiling);
  const [sort, setSort] = useState("name");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [displayLimit, setDisplayLimit] = useState(60);

  const visibleProducts = sortProducts(baseProducts.filter((product) =>
    (!selectedBrands.length || selectedBrands.includes(product.brand))
    && (!onlyDeals || product.discount > 0)
    && product.price <= maxPrice,
  ), sort);

  const panelProps = { items: baseProducts, selectedBrands, setSelectedBrands, onlyDeals, setOnlyDeals, maxPrice, setMaxPrice };
  const displayedProducts = visibleProducts.slice(0, displayLimit);

  return (
    <section className="sm-page-shell sm-catalog-layout">
      <div className="sm-desktop-filters"><FilterPanel {...panelProps} /></div>
      {filtersOpen ? <div className="sm-filter-overlay" onClick={() => setFiltersOpen(false)}><div onClick={(event) => event.stopPropagation()}><FilterPanel {...panelProps} close={() => setFiltersOpen(false)} /></div></div> : null}
      <div className="sm-catalog-results">
        <div className="sm-results-toolbar"><button className="sm-mobile-filter-button" type="button" onClick={() => setFiltersOpen(true)}><Filter size={18} /> Filtres{selectedBrands.length ? ` (${selectedBrands.length})` : ""}</button><span>{visibleProducts.length} résultat{visibleProducts.length > 1 ? "s" : ""}</span><label>Trier par <select value={sort} onChange={(event) => setSort(event.target.value)}><option value="name">Nom</option><option value="price-asc">Prix croissant</option><option value="price-desc">Prix décroissant</option><option value="discount">Réduction</option></select><ChevronDown size={15} /></label></div>
        {visibleProducts.length ? <><div className="sm-product-grid sm-grid-three">{displayedProducts.map((product) => <ProductCard product={product} key={product.id} />)}</div>{displayedProducts.length < visibleProducts.length ? <button className="sm-secondary-button sm-load-more" type="button" onClick={() => setDisplayLimit((limit) => limit + 60)}>Afficher plus ({visibleProducts.length - displayedProducts.length} restants)</button> : null}</> : <div className="sm-no-results"><SlidersHorizontal size={32} /><h2>Aucun produit trouvé</h2><p>Modifiez vos filtres pour afficher plus de résultats.</p></div>}
      </div>
    </section>
  );
}

export function CategoriesScreen() {
  const families = getFamilies();
  return (
    <>
      <section className="sm-page-shell sm-inner-hero sm-categories-hero">
        <div><Breadcrumbs current="Catégories" /><span className="sm-eyebrow"><Sparkles size={15} /> Le catalogue Soumly</span><h1>Explorez les catégories</h1><p>{products.length.toLocaleString("fr-FR")} produits classés en {families.length} familles.</p></div>
        <div className="sm-hero-stat-grid"><div><strong>{products.length.toLocaleString("fr-FR")}</strong><span>produits référencés</span></div><div><strong>{categories.length}</strong><span>catégories</span></div><div><strong>{families.length}</strong><span>familles</span></div></div>
      </section>
      <section className="sm-page-shell sm-section-block">
        <div className="sm-section-heading"><div><span className="sm-section-kicker">Familles</span><h2>Que recherchez-vous ?</h2></div></div>
        <div className="sm-category-grid">{families.map((family, index) => <Link className={`sm-category-card tone-${(index % 4) + 1}`} href={`/categories/${family.slug}`} key={family.slug}><span className="sm-category-icon"><SoumlyIcon name={family.icon} size={30} /></span><div><h3>{family.label}</h3><p>{family.categoryCount} catégories</p><strong>{new Intl.NumberFormat("fr-FR").format(family.productCount)} produits</strong></div><span className="sm-round-arrow">→</span></Link>)}</div>
      </section>
      <section className="sm-page-shell sm-section-block sm-soft-section"><div className="sm-section-heading"><div><span className="sm-section-kicker">Prix comparés</span><h2>Produits présents dans plusieurs boutiques</h2></div><Link href="/recherche">Voir le catalogue →</Link></div><div className="sm-product-grid sm-grid-four">{products.filter((product) => product.stores > 1).slice(0, 4).map((product) => <ProductCard key={product.id} product={product} />)}</div></section>
      <div className="sm-page-shell"><TrustStrip /></div>
    </>
  );
}

export function FamilyScreen() {
  const pathname = usePathname();
  const slug = pathname.split("/").filter(Boolean).at(-1);
  const family = getFamilies().find((f) => f.slug === slug);
  if (!family) return <EmptyState title="Famille introuvable" text="Cette famille n’existe pas." action="Voir toutes les catégories" href="/categories" />;
  const familyCategories = getFamilyCategories(slug ?? "");
  const familyProducts = products.filter((product) =>
    familyCategories.some((category) => category.slug === product.categorySlug)
  );
  return (
    <>
      <section className="sm-page-shell sm-listing-intro"><Breadcrumbs current={family.label} parent="Catégories" /><div className="sm-listing-title-row"><div><span className="sm-category-icon is-large"><SoumlyIcon name={family.icon} size={35} /></span><div><h1>{family.label}</h1><p>{family.categoryCount} catégories, {new Intl.NumberFormat("fr-FR").format(family.productCount)} produits.</p></div></div><span className="sm-result-pill">{familyProducts.length} produits</span></div></section>
      <section className="sm-page-shell sm-section-block">
        <div className="sm-family-chips">{familyCategories.map((category) => <Link className="sm-family-chip" href={`/categories/${category.slug}`} key={category.slug}><SoumlyIcon name={category.icon} size={15} />{category.label}<em>{category.count}</em></Link>)}</div>
      </section>
      <Catalog baseProducts={familyProducts} />
    </>
  );
}

export function CategoryScreen() {
  const pathname = usePathname();
  const slug = pathname.split("/").filter(Boolean).at(-1);
  const category = getCategory(slug);
  if (!category) return <EmptyState title="Catégorie introuvable" text="Cette catégorie n’existe pas." action="Voir toutes les catégories" href="/categories" />;
  const categoryProducts = products.filter((product) => product.categorySlug === category.slug);
  return (
    <>
      <section className="sm-page-shell sm-listing-intro"><Breadcrumbs current={category.label} parent="Catégories" /><div className="sm-listing-title-row"><div><span className="sm-category-icon is-large"><SoumlyIcon name={category.icon} size={35} /></span><div><h1>{category.label}</h1><p>{category.note}. Comparez uniquement des références équivalentes.</p></div></div><span className="sm-result-pill">{categoryProducts.length} produits</span></div></section>
      <Catalog baseProducts={categoryProducts} />
    </>
  );
}

export function SearchScreen() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.trim() ?? "";
  const merchant = searchParams.get("boutique")?.trim() ?? "";

  const matches = useMemo(() => {
    const words = query.toLocaleLowerCase("fr").split(/\s+/).filter(Boolean);
    return products.filter((product) => {
      const haystack = `${product.name} ${product.brand} ${product.category}`.toLocaleLowerCase("fr");
      const matchesText = words.length === 0 || words.every((word) => haystack.includes(word));
      const matchesMerchant = !merchant || product.offers.some((offer) => offer.store.toLowerCase() === merchant.toLowerCase());
      return matchesText && matchesMerchant;
    });
  }, [query, merchant]);

  const title = merchant ? `Produits chez ${merchant}` : query ? `Résultats pour « ${query} »` : "Tout le catalogue";
  return (
    <>
      <section className="sm-search-hero"><div className="sm-page-shell"><Breadcrumbs current="Résultats de recherche" /><h1>{title}</h1><p>{matches.length} produit{matches.length > 1 ? "s" : ""} correspondant{matches.length > 1 ? "s" : ""}.</p><form className="sm-big-search" action="/recherche" method="get"><Search size={22} /><input defaultValue={query} name="q" placeholder="Ex. Lenovo V15, écran MSI…" aria-label="Rechercher" /><button type="submit">Rechercher</button></form><div className="sm-quick-search"><span>Recherches suggérées :</span>{["Lenovo V15", "iPhone", "écran MSI", "climatiseur"].map((item) => <Link key={item} href={`/recherche?q=${encodeURIComponent(item)}`}>{item}</Link>)}</div></div></section>
      {matches.length ? <Catalog baseProducts={matches} /> : <EmptyState title="Aucun résultat" text="Essayez une référence plus courte ou parcourez les catégories." action="Voir les catégories" href="/categories" />}
    </>
  );
}

export function PromotionsScreen() {
  const promoted = products.filter((product) => product.discount > 0).sort((first, second) => second.discount - first.discount);
  const promoCategories = categories.filter((category) => promoted.some((product) => product.categorySlug === category.slug));
  const [active, setActive] = useState("Toutes");
  const visible = active === "Toutes" ? promoted : promoted.filter((product) => product.category === active);
  const maximumDiscount = promoted[0]?.discount ?? 0;
  return (
    <>
      <section className="sm-page-shell sm-promo-hero"><div><Breadcrumbs current="Promotions" /><span className="sm-eyebrow"><BadgePercent size={15} /> Réductions détectées</span><h1>Les prix barrés<br />du catalogue.</h1><p>Cette page affiche uniquement les produits dont le dernier relevé contient un ancien prix supérieur au prix actuel.</p><div className="sm-promo-benefits"><span><Tag size={17} /> {promoted.length} promotions</span><span><RefreshCw size={17} /> Dernier relevé importé</span></div></div><div className="sm-deal-card"><span>RÉDUCTION MAXIMALE</span><strong>{maximumDiscount > 0 ? `−${maximumDiscount}%` : "—"}</strong><p>sur les données actuellement disponibles</p><Link href={promoted[0] ? `/produit/${promoted[0].id}` : "/categories"}>Voir le produit →</Link></div></section>
      <section className="sm-page-shell sm-section-block"><div className="sm-section-heading"><div><span className="sm-section-kicker">Catalogue Soumly</span><h2>Promotions disponibles</h2></div><span className="sm-update-note">Vérifiez le prix final chez le marchand</span></div><div className="sm-filter-chips"><button type="button" className={active === "Toutes" ? "is-active" : ""} onClick={() => setActive("Toutes")}>Toutes</button>{promoCategories.map((category) => <button type="button" key={category.slug} className={active === category.label ? "is-active" : ""} onClick={() => setActive(category.label)}>{category.label}</button>)}</div>{visible.length ? <div className="sm-product-grid sm-grid-four">{visible.map((product) => <ProductCard product={product} key={product.id} />)}</div> : <EmptyState title="Aucune promotion" text="Aucune réduction fiable n’est disponible dans cette catégorie." action="Voir les catégories" href="/categories" />}</section>
    </>
  );
}
