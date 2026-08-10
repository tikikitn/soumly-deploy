"use client";

import Link from "./components/NativeLink";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return <main className="global-state"><span>!</span><h1>Une erreur est survenue</h1><p>Réessayez ou revenez à l’accueil.</p><button type="button" onClick={reset}>Réessayer</button><Link href="/">Accueil</Link></main>;
}
