import type { Metadata } from "next";
import { notFound } from "next/navigation";
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

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const guide = guides.find((item) => item.slug === slug);
	if (!guide) notFound();
	return <GuideArticleScreen />;
}
