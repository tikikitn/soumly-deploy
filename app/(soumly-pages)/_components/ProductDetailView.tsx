// Soumly PRODUCT DETAIL view (client).
// Receives product + relatedProducts as props from the Server Component.
// MUST NOT import products.ts / products.server.ts / the full catalog.
"use client";

import {
	Bell,
	Check,
	ChevronRight,
	ExternalLink,
	Heart,
	Info,
	PackageCheck,
	ShieldCheck,
	ShoppingBag,
	Trophy,
	Truck,
} from "lucide-react";
import { useEffect, useState } from "react";
import Link from "../../components/NativeLink";
import { formatPrice, type Product } from "../_data/content.shared";
import { ProductCard, Stars, useFavorite } from "./ui";

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

export function ProductDetailView({
	product,
	related,
	brandSlug,
	brandLabel,
}: {
	product: Product;
	related: Product[];
	brandSlug?: string | null;
	brandLabel?: string | null;
}) {
	return (
		<ProductDetails
			product={product}
			related={related}
			brandSlug={brandSlug}
			brandLabel={brandLabel}
		/>
	);
}

function ProductDetails({
	product,
	related,
	brandSlug,
	brandLabel,
}: {
	product: Product;
	related: Product[];
	brandSlug?: string | null;
	brandLabel?: string | null;
}) {
	const { favorite, toggle } = useFavorite(product.id);
	const [alertEnabled, setAlertEnabled] = useState(false);
	const offers = product.offers;
	const bestOffer = offers[0];
	const highestPrice = Math.max(...offers.map((offer) => offer.price));
	const maximumSaving = highestPrice - bestOffer.price;

	// ---- Schema.org structured data (JSON-LD) for rich Google results ----
	const productJsonLd = {
		"@context": "https://schema.org",
		"@type": "Product",
		name: product.name,
		image: product.image ? [product.image] : undefined,
		description:
			product.description ||
			`${product.name} — comparez les prix chez ${product.stores} boutiques tunisiennes.`,
		sku: product.id,
		offers: {
			"@type": "AggregateOffer",
			lowPrice: bestOffer?.price ?? product.price,
			highPrice: highestPrice,
			priceCurrency: "TND",
			offerCount: offers.length,
			availability: "https://schema.org/InStock",
			offers: offers.slice(0, 20).map((offer) => ({
				"@type": "Offer",
				price: offer.price,
				priceCurrency: "TND",
				availability: "https://schema.org/InStock",
				seller: { "@type": "Organization", name: offer.store },
				url: offer.url,
			})),
		},
	};

	const breadcrumbJsonLd = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{ "@type": "ListItem", position: 1, name: "Accueil", item: "https://soumly.online/" },
			{
				"@type": "ListItem",
				position: 2,
				name: product.category,
				item: `https://soumly.online/categories/${product.categorySlug}`,
			},
			{ "@type": "ListItem", position: 3, name: product.name },
		],
	};

	useEffect(() => {
		const update = () => setAlertEnabled(readIds("soumly-alerts").includes(product.id));
		const frame = window.requestAnimationFrame(update);
		window.addEventListener("soumly:soumly-alerts", update);
		window.addEventListener("storage", update);
		return () => {
			window.cancelAnimationFrame(frame);
			window.removeEventListener("soumly:soumly-alerts", update);
			window.removeEventListener("storage", update);
		};
	}, [product.id]);

	const toggleAlert = () => {
		const current = new Set<string>(readIds("soumly-alerts"));
		if (current.has(product.id)) current.delete(product.id);
		else current.add(product.id);
		writeIds("soumly-alerts", [...current]);
		setAlertEnabled(current.has(product.id));
	};

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
			/>
			<section className="sm-page-shell sm-product-page-head">
				<Breadcrumbs
					items={[
						{ label: product.category, href: `/categories/${product.categorySlug}` },
						{ label: product.name },
					]}
				/>
				<div className="sm-product-detail-grid">
					<div className="sm-product-gallery">
						{product.discount > 0 ? (
							<span className="sm-product-detail-discount">−{product.discount}%</span>
						) : null}
						<img src={product.image} alt={product.name} />
					</div>

					<div className="sm-product-summary">
						<span className="sm-product-brand">{product.brand}</span>
						<h1>{product.name}</h1>
						<div className="sm-product-rating">
							{product.rating > 0 ? (
								<>
									<Stars rating={product.rating} />
									<b>{product.rating.toFixed(1).replace(".", ",")}</b>
									<span>{product.reviews} avis</span>
								</>
							) : null}
							<span>·</span>
							<span>
								{offers.length} boutique{offers.length > 1 ? "s" : ""} référencée
								{offers.length > 1 ? "s" : ""}
							</span>
						</div>
						<p className="sm-product-description">{product.description}</p>
						<div className="sm-price-highlight is-best-price">
							<span>
								<Trophy size={14} />{" "}
								{offers.length > 1
									? `Meilleur prix chez ${bestOffer.store}`
									: `Prix chez ${bestOffer.store}`}
							</span>
							<strong>{formatPrice(bestOffer.price)}</strong>
							<div>
								<b>
									{offers.length > 1
										? `Le moins cher parmi ${offers.length} boutiques`
										: "Une seule offre disponible"}
								</b>
								<small>
									{maximumSaving > 0
										? `Jusqu’à ${formatPrice(maximumSaving)} d’écart`
										: "Prix identique sur les offres retenues"}
								</small>
							</div>
						</div>
						<div className="sm-summary-actions">
							<a className="sm-primary-button" href="#offers">
								<ShoppingBag size={18} /> Voir {offers.length > 1 ? "les offres" : "l’offre"}
							</a>
							<button
								className={`sm-secondary-button ${favorite ? "is-active" : ""}`}
								type="button"
								onClick={toggle}
							>
								<Heart size={18} fill={favorite ? "currentColor" : "none"} />{" "}
								{favorite ? "Dans mes favoris" : "Ajouter aux favoris"}
							</button>
						</div>
						<button
							className={`sm-alert-box ${alertEnabled ? "is-active" : ""}`}
							type="button"
							onClick={toggleAlert}
						>
							<span>
								<Bell size={20} />
							</span>
							<div>
								<strong>
									{alertEnabled
										? "Alerte enregistrée sur cet appareil"
										: "Créer une alerte de prix"}
								</strong>
								<small>
									{alertEnabled
										? "Vous pourrez retrouver cette alerte dans votre espace."
										: "Enregistrez ce produit pour surveiller son prix."}
								</small>
							</div>
							<i>{alertEnabled ? <Check size={17} /> : <ChevronRight size={17} />}</i>
						</button>
					</div>

					<aside className="sm-product-assurance">
						<h2>Avant d’acheter</h2>
						<div>
							<ShieldCheck size={21} />
							<span>
								<b>Lien marchand direct</b>
								<small>Chaque bouton ouvre la fiche correspondante.</small>
							</span>
						</div>
						<div>
							<PackageCheck size={21} />
							<span>
								<b>Prix du dernier relevé</b>
								<small>Le prix final doit être confirmé chez le marchand.</small>
							</span>
						</div>
						<div>
							<Info size={21} />
							<span>
								<b>Comparaison gratuite</b>
								<small>Soumly ne majore pas le prix affiché.</small>
							</span>
						</div>
					</aside>
				</div>
			</section>

			<div className="sm-product-tabs">
				<div className="sm-page-shell">
					<a className="is-active" href="#offers">
						Offres
					</a>
					<a href="#specs">Caractéristiques</a>
				</div>
			</div>

			<section className="sm-page-shell sm-product-content-grid">
				<div>
					<section className="sm-detail-section" id="offers">
						<div className="sm-detail-section-heading">
							<div>
								<span className="sm-section-kicker">Comparaison réelle</span>
								<h2>
									{offers.length > 1
										? `Prix dans ${offers.length} boutiques`
										: "Offre actuellement disponible"}
								</h2>
							</div>
							<span className="sm-update-note">Classées du prix le plus bas au plus élevé</span>
						</div>

						<article className="sm-best-offer-spotlight">
							<div className="sm-best-offer-label">
								<Trophy size={20} />
								<span>
									<b>{offers.length > 1 ? "MEILLEUR PRIX" : "PRIX RÉFÉRENCÉ"}</b>
									<small>
										{offers.length > 1 ? "L’offre la moins chère" : "Une seule boutique disponible"}
									</small>
								</span>
							</div>
							<div className="sm-best-store">
								<span style={{ background: bestOffer.color }}>
									{bestOffer.logo ? (
										<img
											src={bestOffer.logo}
											alt={`Logo ${bestOffer.store}`}
											className="sm-store-logo-img"
										/>
									) : (
										bestOffer.store[0]
									)}
								</span>
								<div>
									<strong>{bestOffer.store}</strong>
									<small>Boutique référencée</small>
								</div>
							</div>
							<div className="sm-best-price">
								<small>Prix du produit</small>
								<strong>{formatPrice(bestOffer.price)}</strong>
								{maximumSaving > 0 ? (
									<span>Écart maximal : {formatPrice(maximumSaving)}</span>
								) : null}
							</div>
							<a
								href={bestOffer.url}
								target="_blank"
								rel="noopener noreferrer"
								className="sm-best-offer-button"
								aria-label={`Voir ${product.name} chez ${bestOffer.store}`}
							>
								Voir chez {bestOffer.store} <ExternalLink size={16} />
							</a>
						</article>

						<div className="sm-offers-table">
							<div className="sm-offers-column-head">
								<span>Boutique</span>
								<span>Informations</span>
								<span>Prix du produit</span>
								<span>Accéder à l’offre</span>
							</div>
							{offers.map((offer, index) => {
								const difference = offer.price - bestOffer.price;
								return (
									<article
										className={`sm-offer-row ${index === 0 ? "is-best" : ""}`}
										key={offer.store}
									>
										{index === 0 ? (
											<span className="sm-best-row-badge">
												<Trophy size={11} />{" "}
												{offers.length > 1 ? "Meilleur prix" : "Offre disponible"}
											</span>
										) : null}
										<div className="sm-store-brand">
											<span style={{ background: offer.color }}>
												{offer.logo ? (
													<img
														src={offer.logo}
														alt={`Logo ${offer.store}`}
														className="sm-store-logo-img"
													/>
												) : (
													offer.store[0]
												)}
											</span>
											<div>
												<strong>{offer.store}</strong>
												<small>Boutique référencée</small>
											</div>
										</div>
										<div className="sm-offer-delivery">
											<Truck size={17} />
											<span>
												<b>{offer.delivery}</b>
												<small>{offer.availability}</small>
											</span>
										</div>
										<div className="sm-offer-price">
											<em className={difference > 0 ? "is-difference" : ""}>
												{index === 0
													? "Le moins cher"
													: difference > 0
														? `+ ${formatPrice(difference)}`
														: "Même prix"}
											</em>
											<strong>{formatPrice(offer.price)}</strong>
											<small>Dernier relevé importé</small>
										</div>
										<a
											href={offer.url}
											target="_blank"
											rel="noopener noreferrer"
											className="sm-offer-button"
											aria-label={`Voir ${product.name} chez ${offer.store}`}
										>
											Voir chez {offer.store} <ExternalLink size={15} />
										</a>
									</article>
								);
							})}
						</div>
						<p className="sm-offer-disclaimer">
							Soumly affiche les données du dernier relevé disponible. Le stock, les frais de
							livraison et le prix final sont ceux indiqués par le marchand au moment de l’achat.
						</p>
					</section>

					<section className="sm-detail-section" id="specs">
						<div className="sm-detail-section-heading">
							<div>
								<span className="sm-section-kicker">Référence</span>
								<h2>Informations du produit</h2>
							</div>
						</div>
						<div className="sm-specs-list">
							{product.specs.map(([label, value]) => (
								<div key={label}>
									<span>{label}</span>
									<strong>{value}</strong>
								</div>
							))}
						</div>
					</section>
				</div>
			</section>

			<section className="sm-page-shell sm-section-block sm-related-section">
				<div className="sm-section-heading">
					<div>
						<span className="sm-section-kicker">Dans la même catégorie</span>
						<h2>Produits similaires</h2>
					</div>
					<div className="sm-heading-links">
						{brandSlug && brandLabel ? (
							<Link href={`/marques/${brandSlug}`}>Voir les produits {brandLabel} →</Link>
						) : null}
						<Link href={`/categories/${product.categorySlug}`}>Voir la catégorie →</Link>
					</div>
				</div>
				<div className="sm-product-grid sm-grid-four">
					{related.map((item) => (
						<ProductCard product={item} key={item.id} />
					))}
				</div>
			</section>
		</>
	);
}
