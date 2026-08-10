import type { Metadata } from "next";
import { AccountScreen } from "../_components/MiscScreens";

export const metadata: Metadata = { title: "Mon espace" };

export default function AccountPage() {
	return <AccountScreen />;
}
