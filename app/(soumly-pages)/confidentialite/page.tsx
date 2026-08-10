import type { Metadata } from "next";
import { InfoScreen } from "../_components/InfoScreens";

export const metadata: Metadata = { title: "Confidentialité" };
export default function PrivacyPage() {
	return <InfoScreen kind="privacy" />;
}
