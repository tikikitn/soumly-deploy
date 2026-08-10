"use client";

import {
	ArrowRight,
	Bell,
	BookOpen,
	Check,
	ChevronRight,
	Clock3,
	ExternalLink,
	Heart,
	Info,
	PackageCheck,
	Search,
	ShieldCheck,
	ShoppingBag,
	Store,
	Tag,
	Trophy,
	Truck,
	UserRound,
} from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "../../components/NativeLink";
import {
	formatPrice,
	getProduct,
	guides,
	type Product,
	products,
	relatedProducts,
	stores,
} from "../_data/content";
import { EmptyState, ProductCard, SoumlyIcon, Stars, useFavorite } from "./ui";

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
			return [];
		}
	}
}

function writeIds(key: string, ids: string[]) {
	try {
		window.localStorage.setItem(key, JSON.stringify(ids));
	} catch {
		// Cookies keep device-local features available when storage is restricted.
	}
	document.cookie = `${key}=${encodeURIComponent(JSON.stringify(ids))}; path=/; max-age=31536000; SameSite=Lax`;
	window.dispatchEvent(new CustomEvent(`soumly:${key}`));
}

export function ProductScreen() {
	const pathname = usePathname();
	const slug = pathname.split("/").filter(Boolean).at(-1);
	const product = getProduct(slug);

	if (!product) {
		return (
			<EmptyState
				title="Produit introuvable"
				text="Ce produit n’existe pas ou n’est plus référencé."
				action="Retour aux catégories"
				href="/categories"
			/>
		);
	}

	return <ProductDetails product={product} />;
}

function ProductDetails({ product }: { product: Product }) {
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
								<span style={{ background: bestOffer.color }}>{bestOffer.store[0]}</span>
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
											<span style={{ background: offer.color }}>{offer.store[0]}</span>
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
					<Link href={`/categories/${product.categorySlug}`}>Voir la catégorie →</Link>
				</div>
				<div className="sm-product-grid sm-grid-four">
					{relatedProducts(product).map((item) => (
						<ProductCard product={item} key={item.id} />
					))}
				</div>
			</section>
		</>
	);
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
