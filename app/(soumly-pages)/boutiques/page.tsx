import type { Metadata } from "next";
import { StoresScreen } from "../_components/MiscScreens";

export const metadata: Metadata = { title: "Boutiques référencées" };

export default function StoresPage() {
	return <StoresScreen />;
}
