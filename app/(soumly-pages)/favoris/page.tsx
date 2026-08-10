import type { Metadata } from "next";
import { FavoritesScreen } from "../_components/DetailScreens";

export const metadata: Metadata = { title: "Mes favoris" };

export default function FavoritesPage() {
	return <FavoritesScreen />;
}
