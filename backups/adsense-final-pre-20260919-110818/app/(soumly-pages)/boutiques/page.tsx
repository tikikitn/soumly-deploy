import type { Metadata } from "next";
import { StoresScreen } from "../_components/MiscScreens";
import { stores } from "../_data/products.server";

export const metadata: Metadata = { title: "Boutiques référencées" };

export default function StoresPage() {
	return <StoresScreen stores={stores} />;
}
