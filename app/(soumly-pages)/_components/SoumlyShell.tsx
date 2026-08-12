"use client";
/* eslint-disable @next/next/no-location-assign-relative-destination */

import {
	BookOpen,
	ChevronRight,
	Grid3X3,
	Heart,
	Home,
	Menu,
	Search,
	ShoppingBag,
	UserRound,
	X,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";
import { CATALOG_UNIVERSES } from "../../../lib/catalog-navigation";
import Link from "../../components/NativeLink";

const navItems = [
	{ label: "Catégories", href: "/categories", icon: Grid3X3 },
	{ label: "Boutiques", href: "/boutiques", icon: ShoppingBag },
	{ label: "Guides d’achat", href: "/guides", icon: BookOpen },
];

export default function SoumlyShell({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const [query, setQuery] = useState("");
	const [menuOpen, setMenuOpen] = useState(false);
	const [catalogOpen, setCatalogOpen] = useState(false);
	const [favoriteCount, setFavoriteCount] = useState(0);

	useEffect(() => {
		const update = () => {
			try {
				setFavoriteCount(
					JSON.parse(window.localStorage.getItem("soumly-favorites") ?? "[]").length,
				);
			} catch {
				try {
					const cookie = document.cookie
						.split("; ")
						.find((item) => item.startsWith("soumly-favorites="));
					setFavoriteCount(
						cookie
							? JSON.parse(decodeURIComponent(cookie.split("=").slice(1).join("="))).length
							: 0,
					);
				} catch {
					setFavoriteCount(0);
				}
			}
		};
		update();
		window.addEventListener("soumly:favorites", update);
		return () => window.removeEventListener("soumly:favorites", update);
	}, []);

	const submitSearch = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const value = query.trim();
		window.location.href = `/recherche${value ? `?q=${encodeURIComponent(value)}` : ""}`;
	};

	return (
		<div className="soumly-pages">
			<header className="sm-site-header">
				<div className="sm-page-shell sm-header-row">
					<Link className="sm-logo" href="/" aria-label="Soumly, accueil">
						Soumly<span>.</span>
					</Link>
					<nav className="sm-desktop-nav" aria-label="Navigation principale">
						{navItems.map((item) =>
							item.href === "/categories" ? (
								<div className="sm-nav-mega" key={item.href}>
									<Link
										className={pathname.startsWith(item.href) ? "is-active" : ""}
										href={item.href}
									>
										{item.label}
									</Link>
									<div className="sm-mega-panel" role="menu">
										<div className="sm-mega-head">
											<Link href="/categories">Tous les univers</Link>
										</div>
										<div className="sm-mega-grid">
											{CATALOG_UNIVERSES.map((universe) => (
												<Link
													className="sm-mega-item"
													href={`/univers/${universe.slug}`}
													key={universe.slug}
												>
													<strong>{universe.label}</strong>
													<span>{universe.tagline}</span>
												</Link>
											))}
										</div>
									</div>
								</div>
							) : (
								<Link
									key={item.href}
									className={pathname.startsWith(item.href) ? "is-active" : ""}
									href={item.href}
								>
									{item.label}
								</Link>
							),
						)}
					</nav>
					<search className="sm-header-search">
						<form onSubmit={submitSearch}>
							<Search size={19} />
							<input
								value={query}
								onChange={(event) => setQuery(event.target.value)}
								placeholder="Quel produit recherchez-vous ?"
								aria-label="Rechercher un produit"
							/>
						</form>
					</search>
					<div className="sm-header-actions">
						<Link
							className={`sm-icon-button sm-favorite-header ${pathname === "/favoris" ? "is-active" : ""}`}
							href="/favoris"
							aria-label="Favoris"
						>
							<Heart size={22} />
							{favoriteCount ? <span>{favoriteCount}</span> : null}
						</Link>
						<Link className="sm-login-button" href="/compte">
							<UserRound size={19} /> <span>Mon espace</span>
						</Link>
						<button
							className="sm-mobile-menu-button"
							type="button"
							onClick={() => setMenuOpen((open) => !open)}
							aria-label="Ouvrir le menu"
							aria-expanded={menuOpen}
						>
							{menuOpen ? <X size={24} /> : <Menu size={24} />}
						</button>
					</div>
				</div>
				<div className="sm-page-shell sm-mobile-search-wrap">
					<search className="sm-mobile-search">
						<form onSubmit={submitSearch}>
							<Search size={19} />
							<input
								value={query}
								onChange={(event) => setQuery(event.target.value)}
								placeholder="Rechercher un produit…"
								aria-label="Rechercher un produit"
							/>
							<button type="submit" aria-label="Lancer la recherche">
								<Search size={18} />
							</button>
						</form>
					</search>
				</div>
				{menuOpen ? (
					<nav className="sm-mobile-drawer" aria-label="Menu mobile">
						{navItems.map((item) => {
							const Icon = item.icon;
							return (
								<Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
									<Icon size={19} /> {item.label}
								</Link>
							);
						})}
						<button
							type="button"
							className="sm-drawer-accordion"
							onClick={() => setCatalogOpen((open) => !open)}
							aria-expanded={catalogOpen}
						>
							<Grid3X3 size={19} /> Univers
							<ChevronRight size={16} className={catalogOpen ? "is-rotated" : ""} />
						</button>
						{catalogOpen ? (
							<div className="sm-drawer-sub">
								{CATALOG_UNIVERSES.map((universe) => (
									<Link
										key={universe.slug}
										href={`/univers/${universe.slug}`}
										onClick={() => setMenuOpen(false)}
									>
										{universe.label}
									</Link>
								))}
							</div>
						) : null}
					</nav>
				) : null}
			</header>

			<main>{children}</main>

			<footer className="sm-footer">
				<div className="sm-page-shell sm-footer-grid">
					<div>
						<Link className="sm-logo" href="/">
							Soumly<span>.</span>
						</Link>
						<p>
							Comparez les prix des boutiques tunisiennes et trouvez la meilleure offre, simplement.
						</p>
					</div>
					<div>
						<h3>Explorer</h3>
						<Link href="/categories">Catégories</Link>
						<Link href="/boutiques">Boutiques</Link>
					</div>
					<div>
						<h3>Conseils</h3>
						<Link href="/guides">Guides d’achat</Link>
						<Link href="/recherche">Recherche</Link>
						<Link href="/favoris">Mes favoris</Link>
					</div>
					<div>
						<h3>Soumly</h3>
						<Link href="/a-propos">À propos</Link>
						<Link href="/contact">Contact</Link>
						<Link href="/confidentialite">Confidentialité</Link>
						<Link href="/conditions">Conditions</Link>
						<Link href="/mentions-legales">Mentions légales</Link>
					</div>
				</div>
				<div className="sm-page-shell sm-footer-bottom">
					<span>© 2026 Soumly. Tous droits réservés.</span>
					<span>Prix du dernier relevé · À confirmer chez le marchand</span>
				</div>
			</footer>

			<nav className="sm-bottom-nav" aria-label="Navigation mobile">
				<Link href="/" className={pathname === "/" ? "is-active" : ""}>
					<Home size={21} />
					<span>Accueil</span>
				</Link>
				<Link href="/categories" className={pathname.startsWith("/categories") ? "is-active" : ""}>
					<Grid3X3 size={21} />
					<span>Catégories</span>
				</Link>
				<Link href="/favoris" className={pathname === "/favoris" ? "is-active" : ""}>
					<Heart size={21} />
					<span>Favoris</span>
				</Link>
				<Link href="/compte" className={pathname === "/compte" ? "is-active" : ""}>
					<UserRound size={21} />
					<span>Compte</span>
				</Link>
			</nav>
		</div>
	);
}
