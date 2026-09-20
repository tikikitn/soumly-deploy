import type { Metadata } from "next";
import { StoresScreen } from "../_components/MiscScreens";
import { stores } from "../_data/products.server";

export async function generateMetadata({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }): Promise<Metadata> {
 const params = await searchParams;
 const hasQuery = Object.values(params).some((value) => Array.isArray(value) ? value.length > 0 : Boolean(value));
 return { title: "Boutiques référencées", alternates: { canonical: "https://soumly.online/boutiques" }, robots: hasQuery ? { index: false, follow: true } : { index: true, follow: true } };
}

export default function StoresPage() { return <StoresScreen stores={stores} />; }
