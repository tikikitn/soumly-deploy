import type { Metadata } from "next";
import { StoresScreen } from "../_components/DetailScreens";

export const metadata: Metadata = { title: "Boutiques partenaires" };

export default function StoresPage() {
  return <StoresScreen />;
}
