// Soumly PRODUCT DETAIL view (client).
// Receives product + relatedProducts as props from the Server Component.
// MUST NOT import products.ts / products.server.ts / the full catalog.
"use client";

import {
	BarChart3,
	Bell,
	CalendarDays,
	Check,
	ChevronRight,
	ExternalLink,
	FileText,
	Grid3X3,
	Heart,
	Info,
	PackageCheck,
	ShieldCheck,
	ShoppingBag,
	Store,
	Tag,
	TrendingUp,
	Trophy,
	Truck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { guardOutboundClick, trackOutboundStoreClick } from "../../components/analytics";
import { withMerchantUtm } from "../../components/merchant-utm";
import Link from "../../components/NativeLink";
import type { TreatmentContent } from "../_data/indexation-experiment";
import { formatPrice, type Product, type ProductComparison } from "../_data/content.shared";
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

function ProductInfoIcon({ label }: { label: string }) {
	if (label === "Marque") return <Tag size={18} strokeWidth={2} />;
	if (label === "Catégorie") return <Grid3X3 size={18} strokeWidth={2} />;
	if (label === "Boutiques référencées") return <Store size={18} strokeWidth={2} />;
	return <FileText size={18} strokeWidth={2} />;
}

export function ProductDetailView({
	product,
	related,
	comparison,
	brandSlug,
	brandLabel,
	treatment,
}: {
	product: Product;
	related: Product[];
	comparison: ProductComparison | null;
	brandSlug?: string | null;
	brandLabel?: string | null;
	treatment: TreatmentContent | null;
}) {
	return (
		<ProductDetails
			product={product}
			related={related}
			comparison={comparison}
			brandSlug={brandSlug}
			brandLabel={brandLabel}
			treatment={treatment}
		/>
	);
}

function capturedDate(updatedAt: string) {
	return updatedAt.match(/\d{4}-\d{2}-\d{2}/)?.[0] ?? null;
}

function isOldCapture(updatedAt: string) {
	const date = capturedDate(updatedAt);
	return date ? Date.now() - Date.parse(`${date}T00:00:00Z`) > 7 * 24 * 60 * 60 * 1000 : false;
}

function ProductDetails({
	product,
	related,
	comparison,
	brandSlug,
	brandLabel,
	treatment,
}: {
	product: Product;
	related: Product[];
	comparison: ProductComparison | null;
	brandSlug?: string | null;
	brandLabel?: string | null;
	treatment: TreatmentContent | null;
}) {
	const { favorite, toggle } = useFavorite(product.id);
	const [alertEnabled, setAlertEnabled] = useState(false);
	const offers = product.offers;
	const bestOffer = offers[0];
	const highestPrice = Math.max(...offers.map((offer) => offer.price));
	const maximumSaving = highestPrice - bestOffer.price;
	const priceGapPercent = bestOffer.price > 0 ? (maximumSaving / bestOffer.price) * 100 : 0;
	const lastUpdate = offers.find((offer) => offer.updatedAt.trim())?.updatedAt ?? "";

	// ---- Schema.org structured data (JSON-LD) for rich Google results ----
	const productJsonLd = {
		"@context": "https://schema.org",
		"@type": "Product",
		name: product.name,
		image: product.image ? [product.image] : undefined,
		description:
			treatment?.summary ||
			product.description ||
			`${product.name} — comparez les prix chez ${product.stores} boutiques tunisiennes.`,
		sku: product.id,
		offers: {
			"@type": "AggregateOffer",
			lowPrice: bestOffer?.price ?? product.price,
			highPrice: highestPrice,
			priceCurrency: "TND",
			offerCount: offers.length,
			offers: offers.slice(0, 20).map((offer) => ({
				"@type": "Offer",
				price: offer.price,
				priceCurrency: "TND",
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

	// Recently viewed: store a lightweight reference on visit (SSR-safe).
	useEffect(() => {
		const RECENT_KEY = "soumly-recents";
		const RECENT_MAX = 12;
		try {
			const raw = window.localStorage.getItem(RECENT_KEY);
			const parsed: unknown = raw ? JSON.parse(raw) : [];
			const current = Array.isArray(parsed)
				? parsed.filter((item): item is string => typeof item === "string")
				: [];
			const next = [product.id, ...current.filter((id) => id !== product.id)].slice(0, RECENT_MAX);
			window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
			window.dispatchEvent(new Event("soumly:recents"));
		} catch {
			// storage unavailable — ignore
		}
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

					<section className="sm-product-verification" aria-label="Vérification des références et des dates">
						<h2>À vérifier avant de comparer</h2>
						<p>Soumly rapproche une offre du titre catalogue et de l’URL du marchand. Une correspondance forte partage au moins deux éléments distinctifs ; elle ne remplace pas la vérification de la référence exacte, de la mémoire, de la couleur ou du pack sur le site marchand.</p>
						{offers.some((offer) => offer.matchStrength === "limitée") ? <p className="sm-warning-text">Au moins une offre a une correspondance limitée : vérifiez particulièrement le modèle et la variante.</p> : null}
						{offers.some((offer) => isOldCapture(offer.updatedAt)) ? <p className="sm-warning-text">Les prix affichés proviennent d’un relevé ancien selon le seuil de 7 jours ; ils ne constituent pas une vérification actuelle.</p> : null}
						{priceGapPercent >= 30 ? <p className="sm-warning-text">Écart inhabituel : l’écart observé dépasse 30 % entre l’offre la moins chère et la plus chère. Vérifiez les variantes et les conditions avant de comparer uniquement le prix.</p> : null}
					</section>

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

			{treatment ? (
				<section className="sm-page-shell sm-experiment-insight" data-seo-experiment="treatment">
					<span className="sm-section-kicker">Lecture Soumly</span>
					<h2>Ce que montre la comparaison pour cette référence</h2>
					<p>{treatment.summary}</p>
					<p><strong>{treatment.priceInsight}</strong> {treatment.merchantInsight}</p>
					<nav aria-label="Liens utiles pour cette comparaison">
						<Link href={`/categories/${treatment.categorySlug}`}>Voir toute la catégorie {treatment.category} →</Link>
						<Link href="/guides">Lire les guides d’achat Soumly →</Link>
						{related.slice(0, 3).map((item) => <Link href={`/produit/${item.id}`} key={item.id}>Comparer aussi {item.name} →</Link>)}
					</nav>
				</section>
			) : null}

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
								onClick={(event) => {
									if (guardOutboundClick(event.currentTarget)) return;
									const finalUrl = withMerchantUtm(bestOffer.url);
									event.currentTarget.href = finalUrl;
									trackOutboundStoreClick({
										product_id: product.id,
										product_name: product.name,
										store_name: bestOffer.store,
										price: bestOffer.price,
										category: product.category,
										destination_url: finalUrl,
										source_location: "product_detail",
									});
								}}
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
										<small>{offer.matchStrength === "limitée" ? "Correspondance limitée" : "Correspondance forte"}</small>
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
											<small>{offer.updatedAt}{isOldCapture(offer.updatedAt) ? " · Donnée ancienne" : ""}</small>
										</div>
										<a
											href={offer.url}
											target="_blank"
											rel="noopener noreferrer"
											className="sm-offer-button"
											aria-label={`Voir ${product.name} chez ${offer.store}`}
											onClick={(event) => {
												if (guardOutboundClick(event.currentTarget)) return;
												const finalUrl = withMerchantUtm(offer.url);
												event.currentTarget.href = finalUrl;
												trackOutboundStoreClick({
													product_id: product.id,
													product_name: product.name,
													store_name: offer.store,
													price: offer.price,
													category: product.category,
													destination_url: finalUrl,
													source_location: "product_detail",
												});
											}}
										>
											Voir chez {offer.store} <ExternalLink size={15} />
										</a>
									</article>
								);
							})}
						</div>
						<div className="sm-price-insight-card">
						<div className="sm-price-insight-header">
							<BarChart3 size={18} aria-hidden="true" />
							<div>
								<strong>Lecture Soumly</strong>
								<p>Voici un résumé des informations principales détectées par Soumly pour ce produit.</p>
							</div>
						</div>
						<div className="sm-price-insight-grid">
							<div className="sm-price-insight-item is-primary">
								<span className="sm-price-insight-icon" aria-hidden="true"><Tag size={18} /></span>
								<span className="sm-price-insight-copy">
									<small>Prix le plus bas détecté</small>
									<strong>{formatPrice(bestOffer.price)}</strong>
									<span>chez <b>{bestOffer.store}</b></span>
								</span>
							</div>
							{offers.length > 1 ? (
								<div className="sm-price-insight-item">
									<span className="sm-price-insight-icon" aria-hidden="true"><TrendingUp size={18} /></span>
									<span className="sm-price-insight-copy">
										<small>Écart entre l’offre la moins chère et la plus chère</small>
										<strong>{formatPrice(maximumSaving)} <em>{priceGapPercent > 0 ? `(${priceGapPercent.toFixed(1).replace(".", ",")} %)` : ""}</em></strong>
									</span>
								</div>
							) : null}
							<div className="sm-price-insight-item">
								<span className="sm-price-insight-icon" aria-hidden="true"><Store size={18} /></span>
								<span className="sm-price-insight-copy">
									<small>Offres actuellement référencées</small>
									<strong>{offers.length} offre{offers.length > 1 ? "s" : ""}</strong>
								</span>
							</div>
						</div>
						{lastUpdate ? (
							<div className="sm-price-insight-date">
								<CalendarDays size={17} aria-hidden="true" />
								<span><strong>Relevé importé</strong> Prix issu du relevé du <b>{lastUpdate}</b>. Ce n’est pas une vérification effectuée aujourd’hui.</span>
							</div>
						) : null}
						<p className="sm-offer-disclaimer">
							Soumly affiche les données du dernier relevé disponible. Le stock, les frais de
							livraison et le prix final sont ceux indiqués par le marchand au moment de l’achat.
						</p>
						</div>
					</section>

					<section className="sm-detail-section" id="specs">
						<div className="sm-detail-section-heading">
							<div>
								<span className="sm-section-kicker">Référence</span>
								<h2>Informations du produit</h2>
							</div>
						</div>
						<div className="sm-product-info-card">
							{[product.specs.slice(0, 2), product.specs.slice(2)].map((column, columnIndex) => (
								<div className="sm-product-info-column" key={`product-info-column-${columnIndex}`}>
									{column.map(([label, value]) => (
										<div className="sm-product-info-item" key={label}>
											<span className="sm-product-info-icon" aria-hidden="true">
												<ProductInfoIcon label={label} />
											</span>
											<span className="sm-product-info-copy">
												<span>{label}</span>
												<strong>{value}</strong>
											</span>
										</div>
									))}
								</div>
							))}
						</div>
					</section>
				</div>
			</section>

			{comparison ? (
				<section className="sm-page-shell sm-product-comparison" aria-label="Comparaison côte à côte">
					<span className="sm-section-kicker">Décision d’achat</span>
					<h2>Comparer des références proches</h2>
					<p>Cette comparaison côte à côte utilise uniquement les éléments explicitement présents dans les titres du catalogue. Une information absente est indiquée comme indisponible.</p>
					<div className="sm-comparison-grid">
						{comparison.products.map((item) => <article key={item.id} className="sm-comparison-card">
							<h3>{item.name}</h3>
							<p className="sm-comparison-price"><strong>À partir de {formatPrice(item.price)}</strong><span>· {item.stores} offre{item.stores > 1 ? "s" : ""} référencée{item.stores > 1 ? "s" : ""}</span></p>
							<table><tbody>{item.specs.map(([label, value]) => <tr key={label}><th>{label}</th><td className={value === "Information indisponible" ? "is-unavailable" : ""}>{value}</td></tr>)}</tbody></table>
							<Link className="sm-comparison-cta" href={`/produit/${item.id}`}>Voir la fiche et les offres →</Link>
						</article>)}
					</div>
				</section>
			) : null}

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

			{/* Sticky mobile buy bar — best price + merchant always one tap away */}
			<div className="sm-buybar">
				<div className="sm-buybar-info">
					<small>Meilleur prix · {bestOffer.store}</small>
					<strong>{formatPrice(bestOffer.price)}</strong>
				</div>
				<a
					href={bestOffer.url}
					target="_blank"
					rel="noopener noreferrer"
					className="sm-buybar-cta"
					aria-label={`Voir l’offre à ${formatPrice(bestOffer.price)} chez ${bestOffer.store}`}
					onClick={(event) => {
						if (guardOutboundClick(event.currentTarget)) return;
						const finalUrl = withMerchantUtm(bestOffer.url);
						event.currentTarget.href = finalUrl;
						trackOutboundStoreClick({
							product_id: product.id,
							product_name: product.name,
							store_name: bestOffer.store,
							price: bestOffer.price,
							category: product.category,
							destination_url: finalUrl,
							source_location: "mobile_buy_bar",
						});
					}}
				>
					Voir l’offre <ExternalLink size={15} />
				</a>
			</div>
		</>
	);
}
