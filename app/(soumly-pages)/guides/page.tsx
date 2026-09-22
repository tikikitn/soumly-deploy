import type { Metadata } from "next";
import Link from "../../components/NativeLink";
import { editorialGuides } from "../_data/guide-content";
import { treatmentProductsForExperiment } from "../_data/products.server";

export const metadata: Metadata = {
 title: "Guides d’achat en Tunisie – Conseils pratiques | Soumly",
 description: "Guides pratiques pour choisir, comparer et acheter des produits au meilleur rapport qualité-prix en Tunisie.",
 alternates: { canonical: "https://soumly.online/guides" },
};

export default function GuidesPage() {
 return <main className="sm-page-shell sm-section-block">
  <nav className="sm-breadcrumbs" aria-label="Fil d’Ariane"><Link href="/">Accueil</Link><span>Guides d’achat</span></nav>
  <header className="sm-simple-title"><div><span className="sm-eyebrow">Conseils pratiques pour acheter en Tunisie</span><h1>Guides d’achat Soumly</h1><p>Des repères concrets pour comprendre les caractéristiques, comparer des offres équivalentes et vérifier les conditions du marchand.</p></div></header>
  <div className="sm-guides-grid">
   {editorialGuides.map((guide) => <article className="sm-guide-card" key={guide.slug}>
    <div className="sm-guide-card-art tone-1"><span>{guide.category}</span></div>
    <div><span className="sm-guide-time">{guide.readTime} de lecture</span><h2>{guide.title}</h2><p>{guide.excerpt}</p><Link href={`/guides/${guide.slug}`}>Lire le guide →</Link></div>
   </article>)}
  </div>
  {(() => { const products = treatmentProductsForExperiment(12); return products.length > 0 ? <section className="sm-page-shell sm-experiment-links" data-seo-experiment="treatment"><span className="sm-section-kicker">Sélection Soumly</span><h2>Références à comparer</h2><nav aria-label="Références sélectionnées pour l’expérience"><Link href="/guides">Guides d’achat Soumly →</Link>{products.map((product) => <Link href={`/produit/${product.id}`} key={product.id}>{product.name} →</Link>)}</nav></section> : null; })()}
 </main>;
}
