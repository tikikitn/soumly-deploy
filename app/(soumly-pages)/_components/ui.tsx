"use client";

import {
	Armchair,
	BadgePercent,
	Check,
	CookingPot,
	Dumbbell,
	Gamepad2,
	Heart,
	Laptop,
	MonitorPlay,
	ShoppingBag,
	Smartphone,
	Sparkles,
	Star,
	Store,
	WashingMachine,
} from "lucide-react";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import { formatPrice, type Product } from "../_data/content";

const iconMap = {
	Armchair,
	BadgePercent,
	CookingPot,
	Dumbbell,
	Gamepad2,
	Laptop,
	MonitorPlay,
	ShoppingBag,
	Smartphone,
	Sparkles,
	WashingMachine,
};

export function SoumlyIcon({ name, size = 24 }: { name: string; size?: number }) {
	const Icon = iconMap[name as keyof typeof iconMap] ?? ShoppingBag;
	return <Icon size={size} strokeWidth={1.8} />;
}

export function Stars({ rating, compact = false }: { rating: number; compact?: boolean }) {
	return (
		<span className="sm-stars" aria-label={`${rating.toFixed(1)} sur 5`}>
			{[0, 1, 2, 3, 4].map((index) => (
				<Star
					key={index}
					size={compact ? 13 : 15}
					strokeWidth={2}
					fill={index < Math.round(rating) ? "currentColor" : "none"}
				/>
			))}
		</span>
	);
}

function readFavorites() {
	if (typeof window === "undefined") return [] as string[];
	try {
		return JSON.parse(window.localStorage.getItem("soumly-favorites") ?? "[]") as string[];
	} catch {
		return [] as string[];
	}
}

export function useFavorite(productId: string) {
	const favorite = useSyncExternalStore(
		(notify) => {
			window.addEventListener("soumly:favorites", notify);
			window.addEventListener("storage", notify);
			return () => {
				window.removeEventListener("soumly:favorites", notify);
				window.removeEventListener("storage", notify);
			};
		},
		() => readFavorites().includes(productId),
		() => false,
	);

	const toggle = () => {
		const current = readFavorites();
		const next = current.includes(productId)
			? current.filter((id) => id !== productId)
			: [...current, productId];
		window.localStorage.setItem("soumly-favorites", JSON.stringify(next));
		window.dispatchEvent(new CustomEvent("soumly:favorites"));
	};

	return { favorite, toggle };
}

export function ProductCard({ product, compact = false }: { product: Product; compact?: boolean }) {
	const { favorite, toggle } = useFavorite(product.id);

	return (
		<article className={`sm-product-card ${compact ? "is-compact" : ""}`}>
			<div className="sm-product-card__media">
				<span className="sm-discount">−{product.discount}%</span>
				<button
					type="button"
					className={`sm-favorite ${favorite ? "is-active" : ""}`}
					onClick={toggle}
					aria-label={
						favorite ? `Retirer ${product.name} des favoris` : `Ajouter ${product.name} aux favoris`
					}
				>
					<Heart size={21} fill={favorite ? "currentColor" : "none"} />
				</button>
				<Link href={`/produit/${product.id}`} aria-label={`Voir ${product.name}`}>
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img src={product.image} alt={product.name} loading="lazy" />
				</Link>
			</div>
			<div className="sm-product-card__body">
				<div className="sm-card-meta">
					<span>{product.category}</span>
					{product.tag ? <b>{product.tag}</b> : null}
				</div>
				<Link className="sm-product-title" href={`/produit/${product.id}`}>
					{product.name}
				</Link>
				<div className="sm-rating-row">
					<Stars rating={product.rating} compact />
					<span>
						{product.rating.toFixed(1).replace(".", ",")} ({product.reviews})
					</span>
				</div>
				<div className="sm-price-row">
					<strong>{formatPrice(product.price)}</strong>
					<del>{formatPrice(product.oldPrice)}</del>
				</div>
				<span className="sm-store-count">
					<Store size={15} /> {product.stores} boutiques
				</span>
				<Link className="sm-compare-link" href={`/produit/${product.id}`}>
					Comparer les prix <span aria-hidden="true">→</span>
				</Link>
			</div>
		</article>
	);
}

export function VerifiedBadge({ children = "Boutique vérifiée" }: { children?: React.ReactNode }) {
	return (
		<span className="sm-verified">
			<Check size={13} /> {children}
		</span>
	);
}

export function EmptyState({
	title,
	text,
	action,
	href,
}: {
	title: string;
	text: string;
	action: string;
	href: string;
}) {
	return (
		<section className="sm-empty-state">
			<span>
				<Heart size={34} />
			</span>
			<h2>{title}</h2>
			<p>{text}</p>
			<Link className="sm-primary-button" href={href}>
				{action}
			</Link>
		</section>
	);
}
