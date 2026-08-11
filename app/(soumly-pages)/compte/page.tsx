import type { Metadata } from "next";
import { AccountScreen } from "../_components/MiscScreens";

export const metadata: Metadata = {
	title: "Mon espace",
	robots: { index: false, follow: false },
};

export default function AccountPage() {
	return <AccountScreen />;
}
