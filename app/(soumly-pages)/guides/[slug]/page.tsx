import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "../../../components/NativeLink";
import { guideBySlug, guideClosing } from "../../_data/guide-content";
import { getGuideEvidence } from "../../_data/products.server";

const BASE = "https://soumly.online";
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
 const guide = guideBySlug((await params).slug);
 if (!guide) return { title: "Guide introuvable" };
 return { title: guide.title, description: guide.excerpt, alternates: { canonical: `${BASE}/guides/${guide.slug}` } };
}

export default async function GuidePage({ params }: Props) {
 const guide = guideBySlug((await params).slug);
 if (!guide) notFound();
 const article = { "@context":"https://schema.org", "@type":"Article", headline:guide.title, description:guide.excerpt, url:`${BASE}/guides/${guide.slug}`, author:{"@type":"Organization",name:"Soumly"}, publisher:{"@type":"Organization",name:"Soumly",url:BASE}, inLanguage:"fr-TN" };
 const evidence = getGuideEvidence(guide.slug);
 return <main className="sm-page-shell sm-guide-article">
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(article)}} />
  <nav className="sm-breadcrumbs" aria-label="Fil d’Ariane"><Link href="/">Accueil</Link><Link href="/guides">Guides</Link><span>{guide.title}</span></nav>
  <span className="sm-eyebrow">Guide d’achat · {guide.category}</span><h1>{guide.title}</h1><p className="sm-guide-article-excerpt">{guide.excerpt}</p>
  <div className="sm-guide-article-body">
   {guide.sections.map((section) => <section key={section.heading}><h2>{section.heading}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>)}
   <section><h2>Dernière vérification avant l’achat</h2>{guideClosing.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>
  </div>
  {evidence ? <section className="sm-guide-evidence" aria-label="Données du catalogue utilisées par ce guide">
    <h2>Exemples du catalogue Soumly</h2>
    <p>Cette sélection est ordonnée par nombre d’offres puis par prix dans la catégorie <Link href={`/categories/${evidence.categorySlug}`}>{evidence.category}</Link>. Les prix ci-dessous viennent du relevé importé le {evidence.capturedAt}; ils ne constituent pas une vérification aujourd’hui.</p>
    <div className="sm-guide-evidence-table"><table><thead><tr><th>Référence</th><th>Prix observé</th><th>Offres</th><th>Lien</th></tr></thead><tbody>{evidence.products.map((item) => <tr key={item.id}><td>{item.name}</td><td>{item.price.toFixed(2)} DT</td><td>{item.stores}</td><td><Link href={`/produit/${item.id}`}>Comparer</Link></td></tr>)}</tbody></table></div>
    <p className="sm-guide-source-note">Méthode de sélection : produits effectivement présents dans cette catégorie au moment de l’import, sans avis utilisateur inventé ni test pratique ajouté par Soumly.</p>
   </section> : null}
  <p><Link href="/methodologie">Voir la méthodologie Soumly</Link> · <Link href="/categories">Explorer les catégories</Link></p>
 </main>;
}
