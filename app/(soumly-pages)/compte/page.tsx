import type { Metadata } from "next";
import { AccountScreen } from "../_components/DetailScreens";

export const metadata: Metadata = { title: "Mon compte" };

export default function AccountPage() {
  return <AccountScreen />;
}
