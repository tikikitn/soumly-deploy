import { ArrowRight, Info, Mail, ShieldCheck } from "lucide-react";
import Link from "../../components/NativeLink";

type InfoKind = "about" | "contact" | "privacy" | "terms" | "legal";

const content: Record<
	InfoKind,
	{
		eyebrow: string;
		title: string;
		intro: string;
		sections: Array<{ title: string; text: string }>;
	}
> = {
	about: {
		eyebrow: "À propos de Soumly",
		title: "Comparer clairement avant d’acheter.",
		intro:
			"Soumly rassemble des offres de boutiques tunisiennes pour faciliter la comparaison d’une même référence.",
		sections: [
			{
				title: "Comment fonctionne Soumly ?",
				text: "Les données produits sont importées depuis les sources marchandes, normalisées, classées par catégorie puis regroupées lorsque les références correspondent.",
			},
			{
				title: "Ce que Soumly compare",
				text: "Le prix du produit et le lien direct vers la fiche marchande. Le stock, la livraison, la garantie et le prix final restent ceux affichés par la boutique.",
			},
			{
				title: "Notre principe",
				text: "Ne pas inventer de boutique, de note, de réduction ou d’avis. Lorsqu’une seule offre est connue, Soumly l’indique clairement.",
			},
		],
	},
	contact: {
		eyebrow: "Contact",
		title: "Parler avec l’équipe Soumly.",
		intro:
			"Cette version est prête à recevoir les coordonnées officielles du propriétaire avant sa mise en ligne publique.",
		sections: [
			{
				title: "Demande utilisateur",
				text: "Pour signaler un produit, un lien ou un prix, indiquez la référence exacte et la boutique concernée.",
			},
			{
				title: "Boutiques",
				text: "Une boutique peut demander la correction de ses informations ou proposer un flux officiel de catalogue.",
			},
			{
				title: "Configuration requise",
				text: "Ajoutez ici l’adresse e-mail professionnelle, le numéro de téléphone et l’adresse de l’entreprise avant le lancement commercial.",
			},
		],
	},
	privacy: {
		eyebrow: "Confidentialité",
		title: "Des préférences stockées localement.",
		intro:
			"Soumly n’envoie pas de formulaire de connexion et ne crée pas de faux compte utilisateur dans cette version.",
		sections: [
			{
				title: "Favoris et alertes",
				text: "Les identifiants des produits favoris et des alertes sont enregistrés dans le navigateur de l’appareil. Ils ne sont pas synchronisés entre plusieurs appareils.",
			},
			{
				title: "Liens externes",
				text: "Les boutons marchands ouvrent des sites tiers. Leurs propres politiques de confidentialité et cookies s’appliquent alors.",
			},
			{
				title: "Mesure d’audience",
				text: "Aucun outil de suivi supplémentaire n’est configuré dans le projet livré. Toute future solution d’analyse devra être documentée ici.",
			},
		],
	},
	terms: {
		eyebrow: "Conditions d’utilisation",
		title: "Une aide à la comparaison, pas un vendeur.",
		intro:
			"Soumly présente des informations de comparaison et redirige vers des boutiques indépendantes.",
		sections: [
			{
				title: "Prix et disponibilité",
				text: "Les données peuvent évoluer après leur import. Le prix contractuel, le stock, la livraison et la garantie sont confirmés uniquement sur le site du marchand.",
			},
			{
				title: "Achat",
				text: "La commande, le paiement, la livraison, le retour et le service après-vente sont conclus directement entre l’utilisateur et la boutique.",
			},
			{
				title: "Utilisation du service",
				text: "L’utilisateur doit vérifier la référence, la configuration et les accessoires inclus avant de finaliser son achat.",
			},
		],
	},
	legal: {
		eyebrow: "Mentions légales",
		title: "Informations de l’éditeur.",
		intro:
			"Les informations légales définitives doivent correspondre à l’entité qui exploitera Soumly.",
		sections: [
			{
				title: "Éditeur",
				text: "À compléter avant publication : raison sociale ou nom de l’entrepreneur, forme juridique, identifiant fiscal, adresse et coordonnées officielles.",
			},
			{
				title: "Responsable de publication",
				text: "À compléter par le propriétaire du service avant le lancement public.",
			},
			{
				title: "Hébergement",
				text: "À compléter avec le prestataire et l’adresse d’hébergement retenus pour la version de production.",
			},
		],
	},
};

export function InfoScreen({ kind }: { kind: InfoKind }) {
	const page = content[kind];
	const Icon = kind === "contact" ? Mail : kind === "privacy" ? ShieldCheck : Info;
	return (
		<section className="sm-page-shell sm-info-page">
			<div className="sm-info-hero">
				<span className="sm-eyebrow">
					<Icon size={15} /> {page.eyebrow}
				</span>
				<h1>{page.title}</h1>
				<p>{page.intro}</p>
			</div>
			<div className="sm-info-grid">
				{page.sections.map((section) => (
					<article key={section.title}>
						<h2>{section.title}</h2>
						<p>{section.text}</p>
					</article>
				))}
			</div>
			<div className="sm-info-cta">
				<div>
					<h2>Continuer à comparer</h2>
					<p>Explorez les catégories et ouvrez directement les offres marchandes.</p>
				</div>
				<Link className="sm-primary-button" href="/categories">
					Voir les catégories <ArrowRight size={17} />
				</Link>
			</div>
		</section>
	);
}
