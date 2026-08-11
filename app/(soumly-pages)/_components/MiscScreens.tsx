// Soumly miscellaneous screens (stores, guides, favorites, account).
// Phase 2E: NO catalog imports — stores arrive as props, favorites resolve
// via the by-ids API, guides/account are static.
"use client";

import {
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
	UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";
import Link from "../../components/NativeLink";
import { guides, type Product, type ProductSummary } from "../_data/content.client";
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

export type StoreSummary = {
	name: string;
	initials: string;
	color: string;
	offers: number;
	categories: string;
	url: string;
};

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

export function StoresScreen({ stores }: { stores: StoreSummary[] }) {
	const searchParams = useSearchParamsSafe();
	const [query, setQuery] = useState(searchParams);
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
					<p>
						Soumly compare actuellement les offres importées des boutiques tunisiennes partenaires.
					</p>
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

function useSearchParamsSafe(): string {
	const [value, setValue] = useState("");
	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const frame = window.requestAnimationFrame(() => setValue(params.get("q") ?? ""));
		return () => window.cancelAnimationFrame(frame);
	}, []);
	return value;
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
									Lire le guide <ChevronRight size={16} />
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
	const [slug, setSlug] = useState("");
	useEffect(() => {
		const parts = window.location.pathname.split("/").filter(Boolean);
		const frame = window.requestAnimationFrame(() => setSlug(parts.at(-1) ?? ""));
		return () => window.cancelAnimationFrame(frame);
	}, []);
	const guide = guides.find((item) => item.slug === slug);
	if (!guide) {
		return (
			<EmptyState
				title="Guide introuvable"
				text="Ce guide n’existe pas."
				action="Voir tous les guides"
				href="/guides"
			/>
		);
	}
	return (
		<section className="sm-page-shell sm-guide-article">
			<Breadcrumbs items={[{ label: "Guides", href: "/guides" }, { label: guide.title }]} />
			<span className="sm-eyebrow">
				<BookOpen size={15} /> Guide d’achat
			</span>
			<h1>{guide.title}</h1>
			<p className="sm-guide-article-excerpt">{guide.excerpt}</p>
			<div className="sm-guide-article-body">
				<p>
					Avant de comparer les prix, commencez par définir vos besoins : usage principal, budget et
					critères indispensables.
				</p>
				<p>
					Sur Soumly, chaque fiche produit réunit les offres de plusieurs boutiques tunisiennes afin
					de comparer des références équivalentes.
				</p>
				<p>Vérifiez toujours le prix final et la disponibilité chez le marchand avant d’acheter.</p>
			</div>
			<Link className="sm-secondary-button" href="/guides">
				Tous les guides
			</Link>
		</section>
	);
}

export function FavoritesScreen() {
	const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
	const [products, setProducts] = useState<ProductSummary[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const update = () => setFavoriteIds(readIds("soumly-favorites"));
		const frame = window.requestAnimationFrame(update);
		window.addEventListener("soumly:soumly-favorites", update);
		window.addEventListener("soumly:favorites", update);
		return () => {
			window.cancelAnimationFrame(frame);
			window.removeEventListener("soumly:soumly-favorites", update);
			window.removeEventListener("soumly:favorites", update);
		};
	}, []);

	// Resolve ids server-side — only requested products come back.
	useEffect(() => {
		if (favoriteIds.length === 0) {
			const frame = window.requestAnimationFrame(() => {
				setProducts([]);
				setLoading(false);
			});
			return () => window.cancelAnimationFrame(frame);
		}
		const controller = new AbortController();
		const frame = window.requestAnimationFrame(() => setLoading(true));
		fetch("/api/products/by-ids", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ ids: favoriteIds }),
			signal: controller.signal,
		})
			.then((response) => response.json())
			.then((payload: { products: ProductSummary[] }) => {
				setProducts(payload.products ?? []);
				setLoading(false);
			})
			.catch(() => {
				setLoading(false);
			});
		return () => {
			controller.abort();
			window.cancelAnimationFrame(frame);
		};
	}, [favoriteIds]);

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
				{products.length ? (
					<button className="sm-secondary-button" type="button" onClick={clear}>
						Tout retirer
					</button>
				) : null}
			</div>
			{loading ? (
				<p className="sm-loading-note">Chargement de vos favoris…</p>
			) : products.length ? (
				<div className="sm-product-grid sm-grid-four">
					{products.map((summary) => (
						<ProductCard product={summaryToProduct(summary)} key={summary.id} />
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
						<p>Retrouvez ici vos favoris et vos alertes de prix, enregistrés sur cet appareil.</p>
					</div>
					<Link className="sm-primary-button" href="/favoris">
						Mes favoris <ChevronRight size={17} />
					</Link>
				</div>
			</div>
		</section>
	);
}
