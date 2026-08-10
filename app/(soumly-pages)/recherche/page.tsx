import type { Metadata } from "next";
import { SearchScreen } from "../_components/ListingScreens";

export const metadata: Metadata = { title: "Recherche" };

export default function SearchPage() {
  return <SearchScreen />;
}
