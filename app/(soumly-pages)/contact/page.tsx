import type { Metadata } from "next";
import { InfoScreen } from "../_components/InfoScreens";

export const metadata: Metadata = { title: "Contact" };
export default function ContactPage() { return <InfoScreen kind="contact" />; }
