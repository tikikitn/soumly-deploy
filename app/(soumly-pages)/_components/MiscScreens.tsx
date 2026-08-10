// Soumly miscellaneous screens (stores, guides, favorites, account).
// NOTE: still imports the full catalog (Phase 2B blocker) — not used by the
// product detail route.
"use client";

import {
	ArrowRight,
	Bell,
	BookOpen,
	ChevronRight,
	Clock3,
	ExternalLink,
	Heart,
	Search,
	ShieldCheck,
	ShoppingBag,
	Store,
	Tag,
	UserRound,
} from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "../../components/NativeLink";
import { guides, products, stores } from "../_data/content";
import { EmptyState, ProductCard, SoumlyIcon } from "./ui";

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

function readIds(key: string): string[] {
	if (typeof window === "undefined") return [] as string[];
	try {
		return JSON.parse(window.localStorage.getItem(key) ?? "[]") as string[];
	} catch {
		try {
			const cookie = document.cookie.split("; ").find((item) => item.startsWith(`${key}=`));
			return cookie
				? (JSON.parse(decodeURIComponent(cookie.split("=").slice(1).join("="))) as string[])
				: [];
		} catch {
			return [] as string[];
		}
	}
}

function writeIds(key: string, ids: string[]) {
	if (typeof window === "undefined") return;
	try {
		window.localStorage.setItem(key, JSON.stringify(ids));
	} catch {
		// cookies fallback
	}
	try {
		document.cookie = `${key}=${encodeURIComponent(JSON.stringify(ids))}; path=/; max-age=31536000; SameSite=Lax`;
	} catch {
		// ignore
	}
	window.dispatchEvent(new CustomEvent(`soumly:${key}`));
}

export function StoresScreen() {
	const searchParams = useSearchParams();
	const [query, setQuery] = useState(searchParams.get("q") ?? "");
	const visible = stores.filter((storeItem) =>
		`${storeItem.name} ${storeItem.categories}`.toLowerCase().includes(query.toLowerCase()),
	);
	return (
		<>
			<section className="sm-page-shell sm-stores-hero">
				<div>
					<Breadcrumbs items={[{ label: "Boutiques" }]} />
					<span className="sm-eyebrow">
						<Store size={15} /> Sources actives
					</span>
					<h1>Boutiques référencées</h1>
					<p>Soumly compare actuellement les offres importées de Tunisianet et Spacenet.</p>
				</div>
				<div className="sm-shield-visual">
					<Store size={64} />
					<strong>{stores.length}</strong>
					<span>boutiques référencées</span>
				</div>
			</section>
			<section className="sm-page-shell sm-section-block">
				<div className="sm-toolbar">
					<label>
						<Search size={17} />
						<input
							value={query}
							onChange={(event) => setQuery(event.target.value)}
							placeholder="Rechercher une boutique…"
							aria-label="Rechercher une boutique"
						/>
					</label>
				</div>
				<div className="sm-stores-grid">
					{visible.map((storeItem) => (
						<article className="sm-store-card" key={storeItem.name}>
							<div className="sm-store-card-top">
								<span className="sm-store-logo" style={{ background: storeItem.color }}>
									{storeItem.initials}
								</span>
								<span className="sm-section-kicker">Source active</span>
							</div>
							<h3>{storeItem.name}</h3>
							<p>{storeItem.categories}</p>
							<div className="sm-store-stats">
								<span>
									<b>{storeItem.offers}</b> produits référencés
								</span>
							</div>
							<div className="sm-summary-actions">
								<Link href={`/recherche?boutique=${encodeURIComponent(storeItem.name)}`}>
									Voir les produits <ChevronRight size={16} />
								</Link>
								<a href={storeItem.url} target="_blank" rel="noopener noreferrer">
									Visiter la boutique <ExternalLink size={15} />
								</a>
							</div>
						</article>
					))}
				</div>
			</section>
		</>
	);
}

export function GuidesScreen() {
	const [category, setCategory] = useState("Tous");
	const filterOptions = ["Tous", ...new Set(guides.map((guide) => guide.category))];
	const visible =
		category === "Tous" ? guides : guides.filter((guide) => guide.category === category);
	return (
		<>
			<section className="sm-guides-hero">
				<div className="sm-page-shell">
					<Breadcrumbs items={[{ label: "Guides d’achat" }]} />
					<span className="sm-eyebrow">
						<BookOpen size={15} /> Conseils simples et utiles
					</span>
					<h1>
						Choisissez mieux.
						<br />
						Achetez sans hésiter.
					</h1>
					<p>
						Des guides pratiques pour comprendre les produits et comparer des offres équivalentes.
					</p>
				</div>
			</section>
			<section className="sm-page-shell sm-section-block">
				<div className="sm-filter-chips">
					{filterOptions.map((option) => (
						<button
							key={option}
							type="button"
							className={option === category ? "is-active" : ""}
							onClick={() => setCategory(option)}
						>
							{option}
						</button>
					))}
				</div>
				<div className="sm-guides-grid">
					{visible.map((guide) => (
						<article className="sm-guide-card" key={guide.slug}>
							<div className={`sm-guide-card-art tone-${guide.tone}`}>
								<SoumlyIcon name={guide.icon} size={42} />
								<span>{guide.category}</span>
							</div>
							<div>
								<span className="sm-guide-time">
									<Clock3 size={14} /> {guide.readTime} de lecture
								</span>
								<h2>{guide.title}</h2>
								<p>{guide.excerpt}</p>
								<Link href={`/guides/${guide.slug}`}>
									Lire le guide <ArrowRight size={16} />
								</Link>
							</div>
						</article>
					))}
				</div>
			</section>
		</>
	);
}

export function GuideArticleScreen() {
	const pathname = usePathname();
	const slug = pathname.split("/").filter(Boolean).at(-1);
	const guide = guides.find((item) => item.slug === slug);
	if (!guide)
		return (
			<EmptyState
				title="Guide introuvable"
				text="Ce guide n’est pas disponible."
				action="Voir tous les guides"
				href="/guides"
			/>
		);
	return (
		<article className="sm-page-shell sm-article-layout">
			<header className="sm-article-head">
				<Breadcrumbs
					items={[{ label: "Guides d’achat", href: "/guides" }, { label: guide.title }]}
				/>
				<span className="sm-section-kicker">{guide.category}</span>
				<h1>{guide.title}</h1>
				<p>{guide.excerpt}</p>
				<div>
					<span>
						<Clock3 size={15} /> {guide.readTime} de lecture
					</span>
				</div>
			</header>
			<div className="sm-article-hero-art">
				<SoumlyIcon name={guide.icon} size={92} />
				<span>LE GUIDE SOUMLY</span>
			</div>
			<div className="sm-article-body-grid">
				<aside className="sm-toc">
					<strong>Dans ce guide</strong>
					<a href="#besoin">1. Définir votre besoin</a>
					<a href="#criteres">2. Vérifier la référence</a>
					<a href="#budget">3. Calculer le coût total</a>
					<a href="#comparaison">4. Comparer les offres</a>
				</aside>
				<div className="sm-article-copy">
					<p className="sm-lead">
						Le meilleur choix est celui qui correspond à votre usage, votre budget et vos priorités
						— pas forcément le produit le plus cher.
					</p>
					<section id="besoin">
						<h2>1. Commencez par votre besoin réel</h2>
						<p>
							Listez les usages les plus importants et séparez les fonctions indispensables de
							celles qui sont simplement agréables à avoir.
						</p>
						<div className="sm-tip-box">
							<span>Conseil Soumly</span>
							<p>Comparez des produits de gamme et de configuration équivalentes.</p>
						</div>
					</section>
					<section id="criteres">
						<h2>2. Vérifiez la référence exacte</h2>
						<p>
							Un même nom commercial peut désigner plusieurs configurations. Contrôlez le
							processeur, la mémoire, le stockage, la taille, la couleur et les accessoires inclus.
						</p>
					</section>
					<section id="budget">
						<h2>3. Calculez le coût total</h2>
						<p>
							Ajoutez au prix du produit les frais de livraison et les accessoires indispensables.
							Vérifiez également la durée et les conditions de garantie.
						</p>
					</section>
					<section id="comparaison">
						<h2>4. Comparez avant de valider</h2>
						<p>
							Consultez chaque fiche marchande, confirmez le stock et le prix final, puis choisissez
							l’offre la plus adaptée.
						</p>
						<Link className="sm-primary-button" href="/categories">
							Explorer les catégories <ArrowRight size={17} />
						</Link>
					</section>
				</div>
			</div>
		</article>
	);
}

export function FavoritesScreen() {
	const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
	useEffect(() => {
		const update = () => setFavoriteIds(readIds("soumly-favorites"));
		update();
		window.addEventListener("soumly:soumly-favorites", update);
		window.addEventListener("soumly:favorites", update);
		return () => {
			window.removeEventListener("soumly:soumly-favorites", update);
			window.removeEventListener("soumly:favorites", update);
		};
	}, []);
	const favoriteProducts = products.filter((product) => favoriteIds.includes(product.id));
	const clear = () => {
		writeIds("soumly-favorites", []);
		setFavoriteIds([]);
	};
	return (
		<section className="sm-page-shell sm-account-page">
			<Breadcrumbs items={[{ label: "Mes favoris" }]} />
			<div className="sm-simple-title">
				<div>
					<span className="sm-title-icon">
						<Heart size={25} />
					</span>
					<div>
						<h1>Mes favoris</h1>
						<p>Produits enregistrés localement sur cet appareil.</p>
					</div>
				</div>
				{favoriteProducts.length ? (
					<button className="sm-secondary-button" type="button" onClick={clear}>
						Tout retirer
					</button>
				) : null}
			</div>
			{favoriteProducts.length ? (
				<div className="sm-product-grid sm-grid-four">
					{favoriteProducts.map((product) => (
						<ProductCard product={product} key={product.id} />
					))}
				</div>
			) : (
				<EmptyState
					title="Votre liste est vide"
					text="Ajoutez un produit à vos favoris pour le retrouver ici."
					action="Explorer les catégories"
					href="/categories"
				/>
			)}
		</section>
	);
}

export function AccountScreen() {
	const [favoriteCount, setFavoriteCount] = useState(0);
	const [alertCount, setAlertCount] = useState(0);
	useEffect(() => {
		const update = () => {
			setFavoriteCount(readIds("soumly-favorites").length);
			setAlertCount(readIds("soumly-alerts").length);
		};
		update();
		window.addEventListener("soumly:favorites", update);
		window.addEventListener("soumly:soumly-alerts", update);
		return () => {
			window.removeEventListener("soumly:favorites", update);
			window.removeEventListener("soumly:soumly-alerts", update);
		};
	}, []);

	return (
		<section className="sm-account-background">
			<div className="sm-page-shell sm-login-layout">
				<div className="sm-login-benefits">
					<span className="sm-eyebrow">
						<UserRound size={15} /> Votre espace Soumly
					</span>
					<h1>
						Vos favoris et alertes,
						<br />
						sur cet appareil.
					</h1>
					<p>
						Aucun faux compte n’est créé : ces préférences restent enregistrées localement dans
						votre navigateur.
					</p>
					<div>
						<span>
							<Heart size={20} />
							<b>
								{favoriteCount} favori{favoriteCount > 1 ? "s" : ""}
							</b>
							<small>Retrouvez votre sélection à tout moment.</small>
						</span>
						<span>
							<Bell size={20} />
							<b>
								{alertCount} alerte{alertCount > 1 ? "s" : ""}
							</b>
							<small>Produits enregistrés pour un suivi futur.</small>
						</span>
						<span>
							<ShieldCheck size={20} />
							<b>Données locales</b>
							<small>Aucun mot de passe ni donnée personnelle collecté.</small>
						</span>
					</div>
				</div>
				<div className="sm-login-card">
					<div className="sm-login-copy">
						<span className="sm-title-icon">
							<ShoppingBag size={24} />
						</span>
						<h2>Mon tableau de bord</h2>
						<p>Accédez directement à vos préférences.</p>
					</div>
					<div className="sm-account-actions">
						<Link className="sm-primary-button sm-full-button" href="/favoris">
							<Heart size={18} /> Voir mes favoris ({favoriteCount})
						</Link>
						<Link className="sm-secondary-button sm-full-button" href="/categories">
							<Tag size={18} /> Explorer les produits
						</Link>
					</div>
					<div className="sm-demo-note">
						<ShieldCheck size={16} /> Un véritable compte synchronisé nécessitera ultérieurement un
						service d’authentification.
					</div>
				</div>
			</div>
		</section>
	);
}
