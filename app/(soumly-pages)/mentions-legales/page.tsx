import type { Metadata } from "next";
import { InfoScreen } from "../_components/InfoScreens";

export const metadata: Metadata = { title: "Mentions légales" };
export default function LegalPage() { return <InfoScreen kind="legal" />; }
