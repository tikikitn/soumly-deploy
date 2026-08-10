import type { Metadata } from "next";
import { InfoScreen } from "../_components/InfoScreens";

export const metadata: Metadata = { title: "Conditions d’utilisation" };
export default function TermsPage() { return <InfoScreen kind="terms" />; }
