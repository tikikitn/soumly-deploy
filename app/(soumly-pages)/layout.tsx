import type { Metadata } from "next";
import SoumlyShell from "./_components/SoumlyShell";
import "./soumly-pages.css";

export const metadata: Metadata = {
	title: { default: "Soumly", template: "%s | Soumly" },
	description: "Comparez les prix des boutiques tunisiennes et trouvez la meilleure offre.",
};

export default function SoumlyPagesLayout({ children }: { children: React.ReactNode }) {
	return <SoumlyShell>{children}</SoumlyShell>;
}
