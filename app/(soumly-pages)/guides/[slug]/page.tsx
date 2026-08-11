import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuideArticleScreen } from "../../_components/MiscScreens";
import { guides } from "../../_data/content.client";

const BASE = "https://soumly.online";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;
	const guide = guides.find((item) => item.slug === slug);
	if (!guide) return { title: "Guide introuvable" };
	return {
		title: guide.title,
		description: guide.excerpt,
		alternates: { canonical: `${BASE}/guides/${guide.slug}` },
	};
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const guide = guides.find((item) => item.slug === slug);
	if (!guide) notFound();
	return <GuideArticleScreen />;
}
