import Link from "./components/NativeLink";

export default function NotFound() {
	return (
		<main className="global-state">
			<span>404</span>
			<h1>Page introuvable</h1>
			<p>La page demandée n’existe pas ou a été déplacée.</p>
			<Link href="/">Retour à l’accueil</Link>
		</main>
	);
}
