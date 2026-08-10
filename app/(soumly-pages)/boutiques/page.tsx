import type { Metadata } from "next";
import { StoresScreen } from "../_components/DetailScreens";

export const metadata: Metadata = { title: "Boutiques référencées" };

export default function StoresPage() {
	return <StoresScreen />;
}
