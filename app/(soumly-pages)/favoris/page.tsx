import type { Metadata } from "next";
import { FavoritesScreen } from "../_components/MiscScreens";

export const metadata: Metadata = { title: "Mes favoris" };

export default function FavoritesPage() {
	return <FavoritesScreen />;
}
