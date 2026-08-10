import type { Metadata } from "next";
import { PromotionsScreen } from "../_components/ListingScreens";

export const metadata: Metadata = { title: "Promotions" };

export default function PromotionsPage() {
  return <PromotionsScreen />;
}
