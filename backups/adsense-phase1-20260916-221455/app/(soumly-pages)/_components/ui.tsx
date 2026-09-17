"use client";

import {
	AirVent,
	Armchair,
	Baby,
	Backpack,
	Battery,
	Bike,
	Blend,
	BookOpen,
	Box,
	Calculator,
	Camera,
	Code2,
	Coffee,
	Compass,
	CookingPot,
	Cpu,
	CupSoda,
	Disc3,
	Droplet,
	Droplets,
	Dumbbell,
	Eye,
	Flame,
	FolderOpen,
	Footprints,
	Gamepad2,
	Glasses,
	HardDrive,
	Headphones,
	Heart,
	HeartPulse,
	Image,
	Keyboard,
	Lamp,
	Laptop,
	Layers,
	Lock,
	MemoryStick,
	Microwave,
	Monitor,
	MonitorPlay,
	Moon,
	Mouse,
	Network,
	Paintbrush,
	Palette,
	PawPrint,
	PenTool,
	Pill,
	Printer,
	Refrigerator,
	Ruler,
	Scale,
	Scissors,
	Shield,
	Shirt,
	ShoppingBag,
	ShowerHead,
	Smartphone,
	Smile,
	Sparkle,
	Sparkles,
	SprayCan,
	Sprout,
	Star,
	Stethoscope,
	Store,
	Sun,
	Table,
	Tablet,
	ToyBrick,
	Tv,
	User,
	Utensils,
	UtensilsCrossed,
	Volleyball,
	WashingMachine,
	Watch,
	Waves,
	Wind,
	Wrench,
	Zap,
} from "lucide-react";

import { useEffect, useState } from "react";
import Link from "../../components/NativeLink";
import { formatPrice, type Product } from "../_data/content.client";

const iconMap = {
	AirVent,
	Armchair,
	Baby,
	Backpack,
	Battery,
	Bike,
	Blend,
	BookOpen,
	Box,
	Calculator,
	Camera,
	Code2,
	Coffee,
	Compass,
	CookingPot,
	Cpu,
	CupSoda,
	Disc3,
	Droplet,
	Droplets,
	Dumbbell,
	Eye,
	Flame,
	FolderOpen,
	Footprints,
	Gamepad2,
	Glasses,
	HardDrive,
	Headphones,
	Heart,
	HeartPulse,
	Image,
	Keyboard,
	Lamp,
	Laptop,
	Layers,
	Lock,
	MemoryStick,
	Microwave,
	Monitor,
	MonitorPlay,
	Moon,
	Mouse,
	Network,
	Paintbrush,
	Palette,
	PawPrint,
	PenTool,
	Pill,
	Printer,
	Refrigerator,
	Ruler,
	Scale,
	Scissors,
	Shield,
	Shirt,
	ShoppingBag,
	ShowerHead,
	Smartphone,
	Smile,
	Sparkle,
	Sparkles,
	SprayCan,
	Sprout,
	Stethoscope,
	Sun,
	Table,
	Tablet,
	ToyBrick,
	Tv,
	User,
	Utensils,
	UtensilsCrossed,
	Volleyball,
	WashingMachine,
	Watch,
	Waves,
	Wind,
	Wrench,
	Zap,
};

export function SoumlyIcon({ name, size = 24 }: { name: string; size?: number }) {
	const Icon = iconMap[name as keyof typeof iconMap] ?? ShoppingBag;
	return <Icon size={size} strokeWidth={1.8} />;
}

export function Stars({ rating, compact = false }: { rating: number; compact?: boolean }) {
	if (rating <= 0) return null;
	return (
		<span className="sm-stars" role="img" aria-label={`${rating.toFixed(1)} sur 5`}>
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

function readFavorites(): string[] {
	if (typeof window === "undefined") return [] as string[];
	try {
		return JSON.parse(window.localStorage.getItem("soumly-favorites") ?? "[]") as string[];
	} catch {
		try {
			const cookie = document.cookie
				.split("; ")
				.find((item) => item.startsWith("soumly-favorites="));
			return cookie
				? (JSON.parse(decodeURIComponent(cookie.split("=").slice(1).join("="))) as string[])
				: [];
		} catch {
			return [] as string[];
		}
	}
}

export function useFavorite(productId: string) {
	const [favorite, setFavorite] = useState(false);

	useEffect(() => {
		const update = () => setFavorite(readFavorites().includes(productId));
		const frame = window.requestAnimationFrame(update);
		window.addEventListener("soumly:favorites", update);
		window.addEventListener("storage", update);
		return () => {
			window.cancelAnimationFrame(frame);
			window.removeEventListener("soumly:favorites", update);
			window.removeEventListener("storage", update);
		};
	}, [productId]);

	const toggle = () => {
		const current = readFavorites();
		const next = current.includes(productId)
			? current.filter((id) => id !== productId)
			: [...current, productId];
		try {
			window.localStorage.setItem("soumly-favorites", JSON.stringify(next));
		} catch {
			// Cookie fallback below supports restricted storage environments.
		}
		document.cookie = `soumly-favorites=${encodeURIComponent(JSON.stringify(next))}; path=/; max-age=31536000; SameSite=Lax`;
		setFavorite(next.includes(productId));
		window.dispatchEvent(new CustomEvent("soumly:favorites"));
	};

	return { favorite, toggle };
}

export function ProductCard({ product, compact = false }: { product: Product; compact?: boolean }) {
	const { favorite, toggle } = useFavorite(product.id);

	return (
		<article className={`sm-product-card ${compact ? "is-compact" : ""}`}>
			<div className="sm-product-card__media">
				{product.discount > 0 ? <span className="sm-discount">−{product.discount}%</span> : null}
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
					{}
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
					{product.rating > 0 ? (
						<>
							<Stars rating={product.rating} compact />
							<span>
								{product.rating.toFixed(1).replace(".", ",")} ({product.reviews})
							</span>
						</>
					) : null}
				</div>
				<div className="sm-price-row">
					<strong>{formatPrice(product.price)}</strong>
					{product.oldPrice > product.price ? <del>{formatPrice(product.oldPrice)}</del> : null}
				</div>
				<span className="sm-store-count">
					<Store size={15} /> {product.stores} boutique{product.stores > 1 ? "s" : ""}
				</span>
				<Link className="sm-compare-link" href={`/produit/${product.id}`}>
					Comparer les prix <span aria-hidden="true">→</span>
				</Link>
			</div>
		</article>
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
