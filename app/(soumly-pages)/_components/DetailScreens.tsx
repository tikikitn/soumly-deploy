"use client";
/* eslint-disable @next/next/no-img-element */

import {
	ArrowRight,
	BadgeCheck,
	Bell,
	BookOpen,
	Check,
	ChevronRight,
	Clock3,
	CreditCard,
	ExternalLink,
	Heart,
	LockKeyhole,
	Mail,
	PackageCheck,
	Search,
	ShieldCheck,
	ShoppingBag,
	SlidersHorizontal,
	TrendingDown,
	Trophy,
	Truck,
	UserRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";
import {
	formatPrice,
	getProduct,
	guides,
	priceHistory,
	products,
	storeOffers,
	stores,
} from "../_data/content";
import { EmptyState, ProductCard, SoumlyIcon, Stars, useFavorite, VerifiedBadge } from "./ui";

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

export function ProductScreen() {
	const pathname = usePathname();
	const slug = pathname.split("/").filter(Boolean).at(-1);
	const product = getProduct(slug);
	const { favorite, toggle } = useFavorite(product.id);
	const [alertEnabled, setAlertEnabled] = useState(false);
	const [tab, setTab] = useState<"offers" | "specs" | "history">("offers");
	const delta = product.price - products[0].price;
	const searchTerm = encodeURIComponent(product.name);
	const storeSearchUrls: Record<string, string> = {
		Tunisianet: `https://www.tunisianet.com.tn/recherche?s=${searchTerm}`,
		Spacenet: `https://spacenet.tn/recherche?controller=search&s=${searchTerm}`,
		ZStore: `https://zstore.com.tn/?s=${searchTerm}&post_type=product`,
		Wiki: `https://wiki.tn/?s=${searchTerm}&post_type=product`,
		Technopro: `https://www.technopro-online.com/recherche?controller=search&s=${searchTerm}`,
		"Samsung Tunisie": `https://www.samsungtunisie.tn/recherche?controller=search&s=${searchTerm}`,
	};
	const offers = storeOffers
		.map((offer) => ({
			...offer,
			price: Math.max(product.price, offer.price + delta),
			url: product.id === "galaxy-s24-ultra" ? offer.url : storeSearchUrls[offer.store],
		}))
		.sort((first, second) => first.price - second.price);
	const bestOffer = offers[0];
	const highestPrice = Math.max(...offers.map((offer) => offer.price));
	const maximumSaving = highestPrice - bestOffer.price;

	const points = priceHistory
		.map((value, index) => {
			const adjusted = value + delta;
			const min = Math.min(...priceHistory) + delta - 80;
			const max = Math.max(...priceHistory) + delta + 80;
			return `${(index / (priceHistory.length - 1)) * 100},${100 - ((adjusted - min) / (max - min)) * 100}`;
		})
		.join(" ");

	return (
		<>
			<section className="sm-page-shell sm-product-page-head">
				<Breadcrumbs
					items={[
						{ label: product.category, href: `/categories/${product.categorySlug}` },
						{ label: product.name },
					]}
				/>
				<div className="sm-product-detail-grid">
					<div className="sm-product-gallery">
						<span className="sm-product-detail-discount">−{product.discount}%</span>
						<img src={product.image} alt={product.name} />
						<div className="sm-gallery-thumbs">
							<button className="is-active" type="button">
								<img src={product.image} alt="Vue principale" />
							</button>
							<button type="button">
								<img src={product.image} alt="Vue produit 2" />
							</button>
							<button type="button">
								<img src={product.image} alt="Vue produit 3" />
							</button>
						</div>
					</div>
					<div className="sm-product-summary">
						<span className="sm-product-brand">{product.brand}</span>
						<h1>{product.name}</h1>
						<div className="sm-product-rating">
							<Stars rating={product.rating} />
							<b>{product.rating.toFixed(1).replace(".", ",")}</b>
							<a href="#avis">{product.reviews} avis</a>
							<span>·</span>
							<span>{offers.length} boutiques comparées</span>
						</div>
						<p className="sm-product-description">{product.description}</p>
						<div className="sm-price-highlight is-best-price">
							<span>
								<Trophy size={14} /> Meilleur prix disponible chez {bestOffer.store}
							</span>
							<strong>{formatPrice(bestOffer.price)}</strong>
							<div>
								<b>Le moins cher parmi {offers.length} boutiques</b>
								<small>Jusqu’à {formatPrice(maximumSaving)} d’écart</small>
							</div>
						</div>
						<div className="sm-summary-actions">
							<a className="sm-primary-button" href="#offers">
								<ShoppingBag size={18} /> Comparer {offers.length} offres
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
							onClick={() => setAlertEnabled((enabled) => !enabled)}
						>
							<span>
								<Bell size={20} />
							</span>
							<div>
								<strong>
									{alertEnabled ? "Alerte de prix activée" : "Créer une alerte de prix"}
								</strong>
								<small>
									{alertEnabled
										? `Nous vous préviendrons si le prix passe sous ${formatPrice(product.price)}.`
										: "Soyez informé dès que le prix baisse."}
								</small>
							</div>
							<i>{alertEnabled ? <Check size={17} /> : <ChevronRight size={17} />}</i>
						</button>
					</div>
					<aside className="sm-product-assurance">
						<h2>Achetez en confiance</h2>
						<div>
							<ShieldCheck size={21} />
							<span>
								<b>Boutiques vérifiées</b>
								<small>Partenaires sélectionnés</small>
							</span>
						</div>
						<div>
							<PackageCheck size={21} />
							<span>
								<b>Prix mis à jour</b>
								<small>Dernière vérification : 12 min</small>
							</span>
						</div>
						<div>
							<CreditCard size={21} />
							<span>
								<b>Comparaison gratuite</b>
								<small>Aucun frais pour vous</small>
							</span>
						</div>
					</aside>
				</div>
			</section>

			<div className="sm-product-tabs">
				<div className="sm-page-shell">
					{[
						["offers", "Offres"],
						["specs", "Caractéristiques"],
						["history", "Historique des prix"],
					].map(([value, label]) => (
						<button
							key={value}
							type="button"
							className={tab === value ? "is-active" : ""}
							onClick={() => {
								setTab(value as typeof tab);
								document
									.getElementById(value)
									?.scrollIntoView({ behavior: "smooth", block: "start" });
							}}
						>
							{label}
						</button>
					))}
				</div>
			</div>

			<section className="sm-page-shell sm-product-content-grid">
				<div>
					<section className="sm-detail-section" id="offers">
						<div className="sm-detail-section-heading">
							<div>
								<span className="sm-section-kicker">Comparaison complète</span>
								<h2>Comparez les prix de {offers.length} boutiques</h2>
							</div>
							<span className="sm-update-note">Classées du prix le plus bas au plus élevé</span>
						</div>
						<article className="sm-best-offer-spotlight">
							<div className="sm-best-offer-label">
								<Trophy size={20} />
								<span>
									<b>MEILLEUR PRIX</b>
									<small>Notre offre la moins chère</small>
								</span>
							</div>
							<div className="sm-best-store">
								<span style={{ background: bestOffer.color }}>{bestOffer.store[0]}</span>
								<div>
									<strong>{bestOffer.store}</strong>
									<VerifiedBadge />
								</div>
							</div>
							<div className="sm-best-price">
								<small>Prix total</small>
								<strong>{formatPrice(bestOffer.price)}</strong>
								<span>Vous économisez {formatPrice(maximumSaving)}</span>
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
								<span>Livraison & stock</span>
								<span>Prix du produit</span>
								<span>Accéder à l’offre</span>
							</div>
							{offers.map((offer, index) => (
								<article
									className={`sm-offer-row ${index === 0 ? "is-best" : ""}`}
									key={offer.store}
								>
									{index === 0 ? (
										<span className="sm-best-row-badge">
											<Trophy size={11} /> Meilleur prix
										</span>
									) : null}
									<div className="sm-store-brand">
										<span style={{ background: offer.color }}>{offer.store[0]}</span>
										<div>
											<strong>{offer.store}</strong>
											<VerifiedBadge />
											<small>
												{offer.rating.toFixed(1).replace(".", ",")}/5 · {offer.reviews} avis
											</small>
										</div>
									</div>
									<div className="sm-offer-delivery">
										<Truck size={17} />
										<span>
											<b>{offer.delivery}</b>
											<small>
												{offer.availability} · {offer.updatedAt}
											</small>
										</span>
									</div>
									<div className="sm-offer-price">
										{index === 0 ? (
											<em>Le moins cher</em>
										) : (
											<em className="is-difference">
												+ {formatPrice(offer.price - bestOffer.price)}
											</em>
										)}
										<strong>{formatPrice(offer.price)}</strong>
										<small>Prix total affiché</small>
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
							))}
						</div>
						<p className="sm-offer-disclaimer">
							Les prix de cette maquette sont indicatifs. Votre système de collecte pourra remplacer
							automatiquement le prix, la disponibilité et le lien de chaque offre.
						</p>
					</section>

					<section className="sm-detail-section" id="history">
						<div className="sm-detail-section-heading">
							<div>
								<span className="sm-section-kicker">Évolution</span>
								<h2>Historique des prix</h2>
							</div>
							<span className="sm-trend-badge">
								<TrendingDown size={15} /> −11% en 3 mois
							</span>
						</div>
						<div className="sm-history-summary">
							<div>
								<span>Prix actuel</span>
								<strong>{formatPrice(product.price)}</strong>
							</div>
							<div>
								<span>Prix le plus bas</span>
								<strong>{formatPrice(product.price)}</strong>
							</div>
							<div>
								<span>Prix moyen</span>
								<strong>{formatPrice(product.price + 188)}</strong>
							</div>
						</div>
						<div
							className="sm-price-chart"
							role="img"
							aria-label="Le prix baisse progressivement sur les douze derniers mois"
						>
							<div className="sm-chart-y">
								<span>{formatPrice(product.price + 500)}</span>
								<span>{formatPrice(product.price + 250)}</span>
								<span>{formatPrice(product.price)}</span>
							</div>
							<svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
								<defs>
									<linearGradient id="soumly-area" x1="0" x2="0" y1="0" y2="1">
										<stop offset="0%" stopColor="#6347f5" stopOpacity=".22" />
										<stop offset="100%" stopColor="#6347f5" stopOpacity="0" />
									</linearGradient>
								</defs>
								<polygon points={`0,100 ${points} 100,100`} fill="url(#soumly-area)" />
								<polyline
									points={points}
									fill="none"
									stroke="#6347f5"
									strokeWidth="2.4"
									vectorEffect="non-scaling-stroke"
								/>
							</svg>
							<div className="sm-chart-x">
								<span>Sept.</span>
								<span>Déc.</span>
								<span>Mars</span>
								<span>Juin</span>
								<span>Août</span>
							</div>
						</div>
						<p className="sm-chart-note">
							Données indicatives basées sur les prix relevés chez les boutiques partenaires.
						</p>
					</section>

					<section className="sm-detail-section" id="specs">
						<div className="sm-detail-section-heading">
							<div>
								<span className="sm-section-kicker">Fiche technique</span>
								<h2>Caractéristiques principales</h2>
							</div>
						</div>
						<dl className="sm-spec-grid">
							{product.specs.map(([label, value]) => (
								<div key={label}>
									<dt>{label}</dt>
									<dd>{value}</dd>
								</div>
							))}
						</dl>
					</section>
				</div>
				<aside className="sm-side-help-card">
					<span>
						<Bell size={23} />
					</span>
					<h3>Votre prix idéal ?</h3>
					<p>Activez une alerte et recevez une notification quand le prix baisse.</p>
					<button type="button" onClick={() => setAlertEnabled(true)}>
						{alertEnabled ? "Alerte activée ✓" : "Créer mon alerte"}
					</button>
					<small>Gratuit · Désactivation à tout moment</small>
				</aside>
			</section>

			<section className="sm-page-shell sm-section-block sm-related-section">
				<div className="sm-section-heading">
					<div>
						<span className="sm-section-kicker">Vous aimerez aussi</span>
						<h2>Produits similaires</h2>
					</div>
					<Link href={`/categories/${product.categorySlug}`}>Voir la catégorie →</Link>
				</div>
				<div className="sm-product-grid sm-grid-four">
					{products
						.filter((item) => item.id !== product.id)
						.slice(0, 4)
						.map((item) => (
							<ProductCard product={item} key={item.id} />
						))}
				</div>
			</section>
		</>
	);
}

export function StoresScreen() {
	const [query, setQuery] = useState("");
	const visible = stores.filter((storeItem) =>
		`${storeItem.name} ${storeItem.categories}`.toLowerCase().includes(query.toLowerCase()),
	);
	return (
		<>
			<section className="sm-page-shell sm-stores-hero">
				<div>
					<Breadcrumbs items={[{ label: "Boutiques" }]} />
					<span className="sm-eyebrow">
						<ShieldCheck size={15} /> Partenaires de confiance
					</span>
					<h1>Les boutiques comparées par Soumly</h1>
					<p>Découvrez nos partenaires tunisiens, leurs notes et les produits disponibles.</p>
				</div>
				<div className="sm-shield-visual">
					<ShieldCheck size={64} />
					<strong>42</strong>
					<span>boutiques vérifiées</span>
				</div>
			</section>
			<section className="sm-page-shell sm-section-block">
				<div className="sm-store-toolbar">
					<div>
						<h2>Toutes les boutiques</h2>
						<p>{visible.length} partenaires affichés</p>
					</div>
					<label>
						<Search size={18} />
						<input
							value={query}
							onChange={(event) => setQuery(event.target.value)}
							placeholder="Rechercher une boutique…"
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
								<VerifiedBadge />
								<button type="button" aria-label={`Voir ${storeItem.name}`}>
									<ArrowRight size={18} />
								</button>
							</div>
							<h3>{storeItem.name}</h3>
							<div className="sm-store-rating">
								<Stars rating={storeItem.rating} compact />
								<b>{storeItem.rating.toFixed(1).replace(".", ",")}</b>
								<span>({storeItem.reviews} avis)</span>
							</div>
							<p>{storeItem.categories}</p>
							<div className="sm-store-stats">
								<span>
									<b>{storeItem.offers}</b> offres
								</span>
								<span>
									<b>24–48 h</b> livraison
								</span>
							</div>
							<Link href={`/recherche?q=${encodeURIComponent(storeItem.name)}`}>
								Voir les offres <ChevronRight size={16} />
							</Link>
						</article>
					))}
				</div>
			</section>
			<section className="sm-page-shell sm-partner-banner">
				<div>
					<ShoppingBag size={30} />
					<div>
						<h2>Vous représentez une boutique ?</h2>
						<p>Rejoignez Soumly et rendez vos offres visibles auprès de nouveaux clients.</p>
					</div>
				</div>
				<a className="sm-primary-button" href="#contact">
					Devenir partenaire
				</a>
			</section>
		</>
	);
}

export function GuidesScreen() {
	const [category, setCategory] = useState("Tous");
	const filterOptions = [
		"Tous",
		"Smartphones",
		"Informatique",
		"Électroménager",
		"Gaming",
		"Conseils",
	];
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
						Des guides pratiques pour comprendre les produits, comparer les options et investir au
						bon endroit.
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
				<div className="sm-featured-guide">
					<div className="sm-guide-art">
						<SoumlyIcon name="Smartphone" size={76} />
						<span>GUIDE 2026</span>
					</div>
					<div>
						<span className="sm-section-kicker">À la une</span>
						<h2>Comment choisir son smartphone en 2026 ?</h2>
						<p>
							Écran, autonomie, photo, stockage et budget : nous passons en revue les critères qui
							comptent vraiment.
						</p>
						<div>
							<span>
								<Clock3 size={15} /> 7 min de lecture
							</span>
							<span>Mis à jour en août 2026</span>
						</div>
						<Link className="sm-primary-button" href="/guides/choisir-smartphone-2026">
							Lire le guide <ArrowRight size={17} />
						</Link>
					</div>
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
	const guide = guides.find((item) => item.slug === slug) ?? guides[0];
	return (
		<>
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
						<span>Mis à jour le 8 août 2026</span>
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
						<a href="#criteres">2. Les critères essentiels</a>
						<a href="#budget">3. Choisir le bon budget</a>
						<a href="#comparaison">4. Comparer avant d’acheter</a>
					</aside>
					<div className="sm-article-copy">
						<p className="sm-lead">
							Le meilleur produit n’est pas forcément le plus cher : c’est celui qui correspond à
							votre usage, à votre budget et à vos priorités.
						</p>
						<section id="besoin">
							<h2>1. Commencez par votre besoin réel</h2>
							<p>
								Avant de regarder les fiches techniques, notez les trois usages qui comptent le plus
								pour vous. Un étudiant, un créateur de contenu et un joueur n’auront pas les mêmes
								priorités. Cette étape évite de payer pour des fonctions qui resteront inutilisées.
							</p>
							<div className="sm-tip-box">
								<span>Conseil Soumly</span>
								<p>
									Classez vos critères en deux groupes : « indispensable » et « agréable à avoir ».
									Votre choix deviendra beaucoup plus simple.
								</p>
							</div>
						</section>
						<section id="criteres">
							<h2>2. Comparez les critères essentiels</h2>
							<p>
								La qualité de l’écran, l’autonomie, les performances et la durée de garantie
								influencent l’expérience quotidienne. Comparez des produits équivalents et vérifiez
								toujours la capacité exacte, la référence et les accessoires inclus.
							</p>
							<ul>
								<li>
									<b>Performance :</b> adaptez-la aux applications que vous utilisez vraiment.
								</li>
								<li>
									<b>Autonomie :</b> privilégiez l’endurance si vous êtes souvent en déplacement.
								</li>
								<li>
									<b>Garantie :</b> vérifiez la durée et les conditions du service après-vente.
								</li>
								<li>
									<b>Évolutivité :</b> regardez si le stockage ou les accessoires pourront être
									ajoutés.
								</li>
							</ul>
						</section>
						<section id="budget">
							<h2>3. Fixez un budget total</h2>
							<p>
								Incluez la livraison, les accessoires indispensables et l’extension de garantie
								éventuelle. Une offre légèrement plus chère peut devenir plus intéressante si elle
								inclut la livraison ou un meilleur service après-vente.
							</p>
							<blockquote>
								Un bon prix est un prix compétitif aujourd’hui, mais aussi cohérent avec son
								historique.
							</blockquote>
						</section>
						<section id="comparaison">
							<h2>4. Comparez avant de valider</h2>
							<p>
								Consultez plusieurs boutiques, vérifiez la disponibilité et observez l’évolution du
								prix. Soumly regroupe ces informations pour vous aider à décider avec plus de
								sérénité.
							</p>
							<Link className="sm-primary-button" href="/categories">
								Explorer les catégories <ArrowRight size={17} />
							</Link>
						</section>
					</div>
				</div>
			</article>
			<section className="sm-page-shell sm-section-block sm-related-section">
				<div className="sm-section-heading">
					<div>
						<span className="sm-section-kicker">Continuer à apprendre</span>
						<h2>Guides similaires</h2>
					</div>
					<Link href="/guides">Tous les guides →</Link>
				</div>
				<div className="sm-guides-grid sm-guides-grid-compact">
					{guides
						.filter((item) => item.slug !== guide.slug)
						.slice(0, 3)
						.map((item) => (
							<article className="sm-guide-card" key={item.slug}>
								<div className={`sm-guide-card-art tone-${item.tone}`}>
									<SoumlyIcon name={item.icon} size={38} />
								</div>
								<div>
									<span className="sm-guide-time">
										<Clock3 size={14} /> {item.readTime}
									</span>
									<h2>{item.title}</h2>
									<Link href={`/guides/${item.slug}`}>
										Lire <ArrowRight size={16} />
									</Link>
								</div>
							</article>
						))}
				</div>
			</section>
		</>
	);
}

export function FavoritesScreen() {
	const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
	useEffect(() => {
		const update = () => {
			try {
				setFavoriteIds(JSON.parse(window.localStorage.getItem("soumly-favorites") ?? "[]"));
			} catch {
				setFavoriteIds([]);
			}
		};
		update();
		window.addEventListener("soumly:favorites", update);
		return () => window.removeEventListener("soumly:favorites", update);
	}, []);
	const favoriteProducts = products.filter((product) => favoriteIds.includes(product.id));
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
						<p>Retrouvez vos produits enregistrés et surveillez leurs prix.</p>
					</div>
				</div>
				{favoriteProducts.length ? (
					<button
						className="sm-secondary-button"
						type="button"
						onClick={() => {
							window.localStorage.removeItem("soumly-favorites");
							setFavoriteIds([]);
							window.dispatchEvent(new CustomEvent("soumly:favorites"));
						}}
					>
						Tout retirer
					</button>
				) : null}
			</div>
			{favoriteProducts.length ? (
				<>
					<div className="sm-favorites-tools">
						<span>
							{favoriteProducts.length} produit{favoriteProducts.length > 1 ? "s" : ""} enregistré
							{favoriteProducts.length > 1 ? "s" : ""}
						</span>
						<button type="button">
							<Bell size={16} /> Activer les alertes de prix
						</button>
					</div>
					<div className="sm-product-grid sm-grid-four">
						{favoriteProducts.map((product) => (
							<ProductCard product={product} key={product.id} />
						))}
					</div>
				</>
			) : (
				<>
					<EmptyState
						title="Votre liste est encore vide"
						text="Ajoutez les produits qui vous intéressent pour les retrouver ici et suivre leurs prix."
						action="Explorer les catégories"
						href="/categories"
					/>
					<div className="sm-section-block">
						<div className="sm-section-heading">
							<div>
								<span className="sm-section-kicker">Pour commencer</span>
								<h2>Produits populaires</h2>
							</div>
						</div>
						<div className="sm-product-grid sm-grid-four">
							{products.slice(0, 4).map((product) => (
								<ProductCard product={product} key={product.id} />
							))}
						</div>
					</div>
				</>
			)}
		</section>
	);
}

export function AccountScreen() {
	const [mode, setMode] = useState<"login" | "signup">("login");
	const [submitted, setSubmitted] = useState(false);
	const submit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setSubmitted(true);
	};
	return (
		<section className="sm-account-background">
			<div className="sm-page-shell sm-login-layout">
				<div className="sm-login-benefits">
					<span className="sm-eyebrow">
						<UserRound size={15} /> Votre espace Soumly
					</span>
					<h1>
						Vos prix, vos favoris,
						<br />
						au même endroit.
					</h1>
					<p>Créez votre espace gratuit pour suivre les produits qui comptent pour vous.</p>
					<div>
						<span>
							<Heart size={20} />
							<b>Sauvegardez vos favoris</b>
							<small>Retrouvez-les sur tous vos appareils.</small>
						</span>
						<span>
							<Bell size={20} />
							<b>Recevez des alertes de prix</b>
							<small>Soyez informé au meilleur moment.</small>
						</span>
						<span>
							<SlidersHorizontal size={20} />
							<b>Personnalisez vos recherches</b>
							<small>Des résultats plus proches de vos besoins.</small>
						</span>
					</div>
					<p className="sm-secure-note">
						<LockKeyhole size={16} /> Vos données restent privées et sécurisées.
					</p>
				</div>
				<div className="sm-login-card">
					{submitted ? (
						<div className="sm-login-success">
							<span>
								<Check size={30} />
							</span>
							<h2>{mode === "login" ? "Connexion simulée" : "Compte prêt à être créé"}</h2>
							<p>
								Cette maquette front-end est prête à être reliée à votre système d’authentification.
							</p>
							<button
								className="sm-primary-button"
								type="button"
								onClick={() => setSubmitted(false)}
							>
								Retour
							</button>
						</div>
					) : (
						<>
							<div className="sm-auth-tabs">
								<button
									type="button"
									className={mode === "login" ? "is-active" : ""}
									onClick={() => setMode("login")}
								>
									Se connecter
								</button>
								<button
									type="button"
									className={mode === "signup" ? "is-active" : ""}
									onClick={() => setMode("signup")}
								>
									Créer un compte
								</button>
							</div>
							<div className="sm-login-copy">
								<h2>{mode === "login" ? "Bon retour parmi nous" : "Rejoignez Soumly"}</h2>
								<p>
									{mode === "login"
										? "Connectez-vous pour retrouver votre sélection."
										: "Créez votre compte gratuit en quelques secondes."}
								</p>
							</div>
							<form onSubmit={submit} className="sm-login-form">
								{mode === "signup" ? (
									<label>
										Nom complet
										<div>
											<UserRound size={18} />
											<input required placeholder="Votre nom" />
										</div>
									</label>
								) : null}
								<label>
									Adresse e-mail
									<div>
										<Mail size={18} />
										<input required type="email" placeholder="nom@exemple.com" />
									</div>
								</label>
								<label>
									Mot de passe
									<div>
										<LockKeyhole size={18} />
										<input required type="password" minLength={6} placeholder="••••••••" />
									</div>
								</label>
								{mode === "login" ? (
									<div className="sm-login-options">
										<label>
											<input type="checkbox" /> Se souvenir de moi
										</label>
										<button type="button">Mot de passe oublié ?</button>
									</div>
								) : (
									<label className="sm-terms">
										<input required type="checkbox" /> J’accepte les conditions d’utilisation et la
										politique de confidentialité.
									</label>
								)}
								<button className="sm-primary-button sm-full-button" type="submit">
									{mode === "login" ? "Se connecter" : "Créer mon compte"}
								</button>
							</form>
							<div className="sm-demo-note">
								<BadgeCheck size={16} /> Interface de démonstration — aucune donnée n’est envoyée.
							</div>
						</>
					)}
				</div>
			</div>
		</section>
	);
}
