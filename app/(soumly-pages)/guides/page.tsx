import type { Metadata } from "next";
import { GuidesScreen } from "../_components/DetailScreens";

export const metadata: Metadata = { title: "Guides d’achat" };

export default function GuidesPage() {
  return <GuidesScreen />;
}
