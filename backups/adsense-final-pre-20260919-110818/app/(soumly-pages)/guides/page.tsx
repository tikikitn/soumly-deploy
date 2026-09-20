import type { Metadata } from "next";
import { GuidesScreen } from "../_components/MiscScreens";

export const metadata: Metadata = { title: "Guides d’achat" };

export default function GuidesPage() {
	return <GuidesScreen />;
}
