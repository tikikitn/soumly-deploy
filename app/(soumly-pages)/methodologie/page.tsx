import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Méthodologie",
  description: "Méthodologie de comparaison des prix et de mise à jour des offres sur Soumly.",
};

export default function MethodologyPage() {
  return (
    <main className="sm-page-shell sm-info-page">
      <nav className="sm-breadcrumbs" aria-label="Fil d’Ariane"><a href="/">Accueil</a><span className="sm-crumb"><i>/</i><strong>Méthodologie</strong></span></nav>
      <span className="sm-section-kicker">Transparence</span>
      <h1>Notre méthodologie</h1>
      <p>Soumly est un service tunisien de comparaison de prix. Nous réunissons des offres référencées chez des marchands en ligne afin de rendre les écarts de prix plus faciles à lire.</p>
      <h2>Origine des prix</h2>
      <p>Les prix affichés proviennent des offres marchandes référencées dans notre catalogue. Ils peuvent changer sur les sites des marchands. Le prix final et la disponibilité doivent toujours être vérifiés sur le site du marchand avant l’achat.</p>
      <h2>Association produit / offre</h2>
      <p>Nous associons une offre à un produit lorsqu’elle présente suffisamment d’éléments distinctifs en commun avec la référence du produit. Les associations insuffisamment fiables sont exclues de la comparaison plutôt que présentées comme certaines.</p>
      <h2>Mise à jour et disponibilité</h2>
      <p>Chaque fiche affiche la date du relevé disponible lorsqu’elle est connue. Soumly ne garantit pas manuellement le stock : la disponibilité affichée est une information de référence et doit être confirmée auprès du marchand.</p>
      <h2>Classement</h2>
      <p>Sur une fiche produit, les offres sont classées du prix le plus bas au plus élevé. Dans les listings, le tri par défaut privilégie les produits présents chez plusieurs boutiques, puis la réduction calculée à partir des prix disponibles, puis le prix. Les filtres permettent d’utiliser d’autres tris.</p>
      <h2>Relations commerciales</h2>
      <p>Les liens vers les marchands servent à visiter l’offre source et à mesurer les clics sortants. Le classement des offres affichées sur la fiche est basé sur les données de prix, pas sur un placement éditorial payé.</p>
      <p><a href="/comment-ca-marche">Voir le fonctionnement en pratique</a> · <a href="/contact">Nous contacter</a></p>
    </main>
  );
}
