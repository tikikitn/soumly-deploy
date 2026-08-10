"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Store, Tag, ShieldCheck, RefreshCw } from "lucide-react";
import { products } from "../../products-data";

type Offer = {
  store: string;
  price: number;
  oldPrice: number;
  url: string;
  delivery?: string;
};

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const product = useMemo(() => products.find((p) => p.id === id), [id]);

  if (!product) {
    return (
      <main className="page-shell" style={{ padding: "80px 0", textAlign: "center" }}>
        <h2>Produit introuvable</h2>
        <button className="compare-button" onClick={() => router.push("/")}>
          Retour à l&apos;accueil
        </button>
      </main>
    );
  }

  // Build a comparison list from (product as any).offers (real multi-store data).
  const offers: Offer[] = ((product as any).offers && (product as any).offers.length ? (product as any).offers : [{
    store: product.storeName || "Tunisianet",
    price: product.price,
    oldPrice: product.oldPrice,
    url: product.storeUrl || "#",
  }]).map((o: any) => ({
    store: o.store || "Tunisianet",
    price: o.price,
    oldPrice: o.oldPrice,
    url: o.url || "#",
    delivery: "Livraison 24-48h",
  }));

  const lowest = Math.min(...offers.map((o) => o.price));

  return (
    <main id="produit" className="page-shell" style={{ padding: "40px 0" }}>
      <button className="icon-button" onClick={() => router.back()} aria-label="Retour">
        <ArrowLeft size={22} />
      </button>

      <div className="product-detail">
        <div className="product-detail__image">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={product.image} alt={product.name} />
        </div>

        <div className="product-detail__info">
          <span className="product-category">{product.category}</span>
          <h1>{product.name}</h1>

          {product.discount > 0 ? (
            <div className="price-block">
              <strong className="current-price">{product.price.toLocaleString("fr-FR")} DT</strong>
              <span className="old-price">{product.oldPrice.toLocaleString("fr-FR")} DT</span>
              <span className="discount-badge">−{product.discount}%</span>
            </div>
          ) : (
            <strong className="current-price">{product.price.toLocaleString("fr-FR")} DT</strong>
          )}

          <div className="trust-strip" style={{ marginTop: 16 }}>
            <div><ShieldCheck size={20} /><span><strong>Prix garanti</strong> Soumly vérifie</span></div>
            <div><RefreshCw size={20} /><span><strong>Mis à jour</strong> Aujourd&apos;hui</span></div>
          </div>
        </div>
      </div>

      <section className="products-section" style={{ marginTop: 40 }}>
        <div className="section-heading">
          <div>
            <span className="section-kicker">Comparaison des boutiques</span>
            <h2>Où acheter au meilleur prix</h2>
          </div>
        </div>

        <div className="comparison-table">
          <div className="comparison-row comparison-header">
            <span><Store size={16} /> Boutique</span>
            <span>Prix</span>
            <span>Livraison</span>
            <span></span>
          </div>
          {offers.map((o, i) => (
            <div className="comparison-row" key={i}>
              <span><strong>{o.store}</strong></span>
              <span className={o.price === lowest ? "best-price" : ""}>
                {o.price.toLocaleString("fr-FR")} DT
                {o.price === lowest ? "  🏆" : ""}
              </span>
              <span>{o.delivery}</span>
              <span>
                <a className="compare-button" href={o.url} target="_blank" rel="noopener">
                  Voir l&apos;offre <Tag size={15} />
                </a>
              </span>
            </div>
          ))}
        </div>

        {offers.length === 1 ? (
          <p style={{ marginTop: 16, color: "#888", fontSize: 14 }}>
            D&apos;autres boutiques tunisiennes (Mytek, Spacenet, Wiki…) seront comparées ici dès que leurs prix seront ajoutés.
          </p>
        ) : null}
      </section>
    </main>
  );
}
