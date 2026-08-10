"use client";

import {
	BookOpen,
	Grid3X3,
	Heart,
	Home,
	Menu,
	Search,
	ShoppingBag,
	Tag,
	UserRound,
	X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";

const navItems = [
	{ label: "Catégories", href: "/categories", icon: Grid3X3 },
	{ label: "Promotions", href: "/promotions", icon: Tag },
	{ label: "Boutiques", href: "/boutiques", icon: ShoppingBag },
	{ label: "Guides d’achat", href: "/guides", icon: BookOpen },
];

export default function SoumlyShell({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const [query, setQuery] = useState("");
	const [menuOpen, setMenuOpen] = useState(false);
	const [favoriteCount, setFavoriteCount] = useState(0);

	useEffect(() => {
		const update = () => {
			try {
				setFavoriteCount(
					JSON.parse(window.localStorage.getItem("soumly-favorites") ?? "[]").length,
				);
			} catch {
				setFavoriteCount(0);
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
						{navItems.map((item) => (
							<Link
								key={item.href}
								className={pathname.startsWith(item.href) ? "is-active" : ""}
								href={item.href}
							>
								{item.label}
							</Link>
						))}
					</nav>
					<form className="sm-header-search" onSubmit={submitSearch} role="search">
						<Search size={19} />
						<input
							value={query}
							onChange={(event) => setQuery(event.target.value)}
							placeholder="Quel produit recherchez-vous ?"
							aria-label="Rechercher un produit"
						/>
					</form>
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
							<UserRound size={19} /> <span>Se connecter</span>
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
					<form className="sm-mobile-search" onSubmit={submitSearch} role="search">
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
						<Link href="/promotions">Promotions</Link>
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
						<a href="#a-propos">À propos</a>
						<a href="#contact">Contact</a>
						<a href="#confidentialite">Confidentialité</a>
					</div>
				</div>
				<div className="sm-page-shell sm-footer-bottom">
					<span>© 2026 Soumly. Tous droits réservés.</span>
					<span>Prix affichés à titre indicatif · Données de démonstration</span>
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
