import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Comment ça marche ?",
  description: "Comment Soumly compare les prix des boutiques tunisiennes.",
};

export default function HowItWorksPage() {
  return (
    <main className="sm-page-shell sm-info-page">
      <nav className="sm-breadcrumbs" aria-label="Fil d’Ariane"><a href="/">Accueil</a><span className="sm-crumb"><i>/</i><strong>Comment ça marche ?</strong></span></nav>
      <span className="sm-section-kicker">Comprendre Soumly</span>
      <h1>Comment ça marche ?</h1>
      <p>Soumly compare des offres référencées auprès de boutiques tunisiennes pour vous aider à repérer les écarts de prix avant votre achat.</p>
      <h2>1. Recherchez un produit</h2>
      <p>Utilisez la recherche ou parcourez les catégories. Chaque fiche produit regroupe les offres que Soumly a pu associer au même produit.</p>
      <h2>2. Comparez les offres</h2>
      <p>Sur une fiche, les offres sont classées du prix le plus bas au plus élevé. Le nombre de boutiques, les prix et les différences sont calculés à partir des offres affichées.</p>
      <h2>3. Vérifiez chez le marchand</h2>
      <p>Le bouton de chaque offre ouvre la fiche correspondante chez le marchand. Le prix final, le stock, les frais de livraison et les conditions de vente doivent être confirmés sur son site au moment de l’achat.</p>
      <p><a href="/methodologie">Lire notre méthodologie</a> · <a href="/contact">Nous contacter</a></p>
    </main>
  );
}
