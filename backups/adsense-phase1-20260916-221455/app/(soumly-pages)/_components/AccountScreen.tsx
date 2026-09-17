// Mon espace — personal dashboard: favorites, price alerts, recently viewed.
// Client component: reads localStorage ids, resolves products server-side
// via /api/products/by-ids (never loads the full catalog client-side).
"use client";

import { Bell, ChevronRight, Clock, Heart, Info, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "../../components/NativeLink";
import type { Product, ProductSummary } from "../_data/content.shared";
import { EmptyState, ProductCard, SoumlyIcon } from "./ui";

// ---------- localStorage helpers (SSR-safe) ----------
function readIds(key: string): string[] {
	try {
		const raw = window.localStorage.getItem(key);
		if (!raw) return [];
		const parsed: unknown = JSON.parse(raw);
		return Array.isArray(parsed)
			? parsed.filter((item): item is string => typeof item === "string")
			: [];
	} catch {
		return [];
	}
}

function writeIds(key: string, ids: string[]) {
	try {
		window.localStorage.setItem(key, JSON.stringify(ids));
	} catch {
		// storage unavailable — ignore
	}
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

const RECENT_KEY = "soumly-recents";
const RECENT_MAX = 12;

// ---------- shared resolver ----------
function useResolvedProducts(ids: string[]) {
	const [products, setProducts] = useState<ProductSummary[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (ids.length === 0) {
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
			body: JSON.stringify({ ids }),
			signal: controller.signal,
		})
			.then((response) => response.json())
			.then((payload: { products: ProductSummary[] }) => {
				setProducts(payload.products ?? []);
				setLoading(false);
			})
			.catch(() => setLoading(false));
		return () => {
			controller.abort();
			window.cancelAnimationFrame(frame);
		};
	}, [ids]);

	return { products, loading };
}

// ---------- recently viewed (lightweight, deduped, capped) ----------
function readRecents(): string[] {
	const ids = readIds(RECENT_KEY);
	// sanitize: strings only, cap length, dedupe, keep order
	const seen = new Set<string>();
	const clean: string[] = [];
	for (const id of ids) {
		if (!seen.has(id) && id.length > 0 && id.length <= 200) {
			seen.add(id);
			clean.push(id);
		}
	}
	return clean.slice(0, RECENT_MAX);
}

// ---------- main screen ----------
export function AccountScreen() {
	const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
	const [alertIds, setAlertIds] = useState<string[]>([]);
	const [recentIds, setRecentIds] = useState<string[]>([]);

	useEffect(() => {
		const update = () => {
			setFavoriteIds(readIds("soumly-favorites"));
			setAlertIds(readIds("soumly-alerts"));
			setRecentIds(readRecents());
		};
		const frame = window.requestAnimationFrame(update);
		window.addEventListener("soumly:favorites", update);
		window.addEventListener("soumly:soumly-favorites", update);
		window.addEventListener("soumly:soumly-alerts", update);
		window.addEventListener("soumly:recents", update);
		window.addEventListener("storage", update);
		return () => {
			window.cancelAnimationFrame(frame);
			window.removeEventListener("soumly:favorites", update);
			window.removeEventListener("soumly:soumly-favorites", update);
			window.removeEventListener("soumly:soumly-alerts", update);
			window.removeEventListener("soumly:recents", update);
			window.removeEventListener("storage", update);
		};
	}, []);

	const favorites = useResolvedProducts(favoriteIds);
	const alerts = useResolvedProducts(alertIds);
	const recents = useResolvedProducts(recentIds);

	const removeAlert = (id: string) => {
		const next = alertIds.filter((item) => item !== id);
		setAlertIds(next);
		writeIds("soumly-alerts", next);
		window.dispatchEvent(new Event("soumly:soumly-alerts"));
	};

	return (
		<section className="sm-page-shell sm-account-page">
			{/* Intro — compact */}
			<div className="sm-espace-intro">
				<span className="sm-title-icon">
					<Sparkles size={24} />
				</span>
				<div>
					<h1>Mon espace</h1>
					<p>
						Vos favoris, alertes de prix et produits récemment consultés, réunis au même endroit.
					</p>
				</div>
			</div>

			{/* Summary cards */}
			<div className="sm-espace-summary">
				<Link className="sm-espace-summary-card" href="/favoris">
					<span className="sm-summary-icon is-heart">
						<Heart size={22} />
					</span>
					<div>
						<strong>Favoris</strong>
						<span>
							{favoriteIds.length} produit{favoriteIds.length > 1 ? "s" : ""}
						</span>
					</div>
					<ChevronRight size={18} />
				</Link>
				<div className="sm-espace-summary-card">
					<span className="sm-summary-icon is-bell">
						<Bell size={22} />
					</span>
					<div>
						<strong>Alertes de prix</strong>
						<span>
							{alertIds.length} alerte{alertIds.length > 1 ? "s" : ""} active
							{alertIds.length > 1 ? "s" : ""}
						</span>
					</div>
				</div>
			</div>

			{/* Favorites */}
			<div className="sm-espace-section">
				<div className="sm-espace-heading">
					<h2>Mes favoris</h2>
					{favorites.products.length ? (
						<Link href="/favoris">
							Voir tous <ChevronRight size={14} />
						</Link>
					) : null}
				</div>
				{favorites.loading ? (
					<p className="sm-loading-note">Chargement de vos favoris…</p>
				) : favorites.products.length ? (
					<div className="sm-product-grid sm-grid-four">
						{favorites.products.map((summary) => (
							<ProductCard product={summaryToProduct(summary)} key={summary.id} />
						))}
					</div>
				) : (
					<EmptyState
						title="Aucun favori pour le moment"
						text="Enregistrez les produits qui vous intéressent pour les retrouver facilement et comparer leurs prix plus tard."
						action="Découvrir les produits"
						href="/categories"
					/>
				)}
			</div>

			{/* Price alerts */}
			<div className="sm-espace-section">
				<div className="sm-espace-heading">
					<h2>Alertes de prix</h2>
				</div>
				{alerts.loading ? (
					<p className="sm-loading-note">Chargement de vos alertes…</p>
				) : alerts.products.length ? (
					<ul className="sm-alert-list">
						{alerts.products.map((summary) => (
							<li className="sm-alert-row" key={summary.id}>
								<Link
									className="sm-alert-thumb"
									href={`/produit/${summary.id}`}
									aria-label={summary.name}
								>
									{summary.image ? (
										// eslint-disable-next-line @next/next/no-img-element
										<img src={summary.image} alt="" loading="lazy" />
									) : (
										<SoumlyIcon name="Sparkles" size={22} />
									)}
								</Link>
								<Link className="sm-alert-info" href={`/produit/${summary.id}`}>
									<strong>{summary.name}</strong>
									<span>{summary.stores > 1 ? `${summary.stores} boutiques` : "1 boutique"}</span>
								</Link>
								<strong className="sm-alert-price">
									{new Intl.NumberFormat("fr-FR").format(summary.price)} DT
								</strong>
								<button
									className="sm-alert-remove"
									type="button"
									aria-label={`Retirer l’alerte pour ${summary.name}`}
									onClick={() => removeAlert(summary.id)}
								>
									<Bell size={16} />
									<span>Retirer</span>
								</button>
							</li>
						))}
					</ul>
				) : (
					<EmptyState
						title="Aucune alerte pour le moment"
						text="Surveillez les produits qui vous intéressent et retrouvez rapidement leur meilleur prix."
						action="Découvrir les produits"
						href="/categories"
					/>
				)}
			</div>

			{/* Recently viewed */}
			<div className="sm-espace-section">
				<div className="sm-espace-heading">
					<h2>Consultés récemment</h2>
				</div>
				{recents.loading ? (
					<p className="sm-loading-note">Chargement…</p>
				) : recents.products.length ? (
					<div className="sm-recents-row">
						{recents.products.map((summary) => (
							<ProductCard product={summaryToProduct(summary)} key={summary.id} />
						))}
					</div>
				) : (
					<p className="sm-recents-empty">
						<Clock size={15} /> Les produits que vous consultez apparaîtront ici.
					</p>
				)}
			</div>

			{/* Local note */}
			<div className="sm-espace-localnote">
				<Info size={14} />
				<span>Vos préférences sont enregistrées uniquement sur cet appareil.</span>
			</div>
		</section>
	);
}

export { RECENT_KEY, RECENT_MAX, readRecents };
