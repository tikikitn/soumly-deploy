import type { Metadata } from "next";
import { GuideArticleScreen } from "../../_components/MiscScreens";
import { guides } from "../../_data/content.client";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;
	const guide = guides.find((item) => item.slug === slug);
	return guide
		? { title: guide.title, description: guide.excerpt }
		: { title: "Guide introuvable" };
}

export default function GuidePage() {
	return <GuideArticleScreen />;
}
