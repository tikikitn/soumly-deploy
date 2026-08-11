import type { Metadata } from "next";
import { FavoritesScreen } from "../_components/MiscScreens";

export const metadata: Metadata = {
	title: "Mes favoris",
	robots: { index: false, follow: false },
};

export default function FavoritesPage() {
	return <FavoritesScreen />;
}
