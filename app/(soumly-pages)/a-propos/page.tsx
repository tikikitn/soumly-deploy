import type { Metadata } from "next";
import { InfoScreen } from "../_components/InfoScreens";

export const metadata: Metadata = { title: "À propos" };
export default function AboutPage() {
	return <InfoScreen kind="about" />;
}
