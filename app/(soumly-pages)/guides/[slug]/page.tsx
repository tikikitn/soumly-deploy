import type { Metadata } from "next";
import { GuideArticleScreen } from "../../_components/DetailScreens";

export const metadata: Metadata = { title: "Guide d’achat" };

export default function GuidePage() {
  return <GuideArticleScreen />;
}
