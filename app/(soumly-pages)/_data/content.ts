import {
  products as sourceProducts,
  type Offer as SourceOffer,
  type Product as SourceProduct,
} from "../../products";

export type StoreOffer = {
  store: string;
  price: number;
  oldPrice: number;
  url: string;
  color: string;
  delivery: string;
  availability: string;
  updatedAt: string;
};

export type Product = {
  id: string;
  name: string;
  brand: string;
  category: string;
  categorySlug: string;
  image: string;
  price: number;
  oldPrice: number;
  rating: number;
  reviews: number;
  stores: number;
  discount: number;
  badge?: string;
  tag?: string;
  description: string;
  specs: Array<[string, string]>;
  offers: StoreOffer[];
};

export type Category = {
  slug: string;
  label: string;
  icon: string;
  count: number;
  note: string;
};

// Category definition used for both curated and generated categories.
type AnyCategoryDefinition = {
  raw?: readonly string[];
  slug: string;
  label: string;
  icon: string;
  count?: number;
  note?: string;
};

// Icon names used for generated categories (lucide icons)
const GENERIC_CATEGORY_ICONS = [
  "Box", "ShoppingBag", "Tag", "Sparkles", "Layers", "Package",
  "CircleDot", "Shirt", "Watch", "Home", "Zap", "Wrench",
] as const;

function humanizeCategory(slug: string) {
  return slug
    .split("-")
    .map((word) => (word.length > 2 ? word[0].toUpperCase() + word.slice(1) : word))
    .join(" ");
}

const CATEGORY_DEFINITIONS = [
  { raw: ["596-smartphone-tunisie", "smartphones"], slug: "smartphones", label: "Smartphones", icon: "Smartphone" },
  { raw: ["301-pc-portable-tunisie", "PC Portable", "pc-portables"], slug: "pc-portables", label: "PC portables", icon: "Laptop" },
  { raw: ["373-pc-de-bureau"], slug: "pc-de-bureau", label: "PC de bureau", icon: "Monitor" },
  { raw: ["667-ecran-pc-tunisie", "ecrans", "moniteurs"], slug: "ecrans", label: "Écrans", icon: "MonitorPlay" },
  { raw: ["338-casque-ecouteurs", "casques-ecouteurs", "casques", "ecouteurs"], slug: "casques-ecouteurs", label: "Casques & écouteurs", icon: "Headphones" },
  { raw: ["334-souris-informatique", "souris"], slug: "souris", label: "Souris", icon: "Mouse" },
  { raw: ["704-claviers", "claviers"], slug: "claviers", label: "Claviers", icon: "Keyboard" },
  { raw: ["457-climatiseur-tunisie-chaud-froid"], slug: "climatiseurs", label: "Climatiseurs", icon: "AirVent" },
  { raw: ["331-sac-a-dos-tunisie"], slug: "sacs-accessoires", label: "Sacs & accessoires", icon: "Backpack" },
] as const;

type CategoryDefinition = (typeof CATEGORY_DEFINITIONS)[number];
const categoryByRaw: Map<string, AnyCategoryDefinition> = new Map(
  CATEGORY_DEFINITIONS.flatMap((category) =>
    category.raw.map((raw) => [raw, category] as const),
  ),
);

// Generated definitions for categories found in the data but not declared above.
const generatedCategories = new Map<string, AnyCategoryDefinition>();
function categoryFor(rawSlug: string): AnyCategoryDefinition {
  const known = categoryByRaw.get(rawSlug);
  if (known) return known;
  let generated = generatedCategories.get(rawSlug);
  if (!generated) {
    const hash = [...rawSlug].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    generated = {
      slug: rawSlug,
      label: humanizeCategory(rawSlug),
      icon: GENERIC_CATEGORY_ICONS[Math.abs(hash) % GENERIC_CATEGORY_ICONS.length],
      count: 0,
      note: "",
    };
    generatedCategories.set(rawSlug, generated);
  }
  return generated;
}

const STORE_DETAILS: Record<string, { color: string; delivery: string; availability: string }> = {
  Tunisianet: {
    color: "#6d4aff",
    delivery: "Voir les conditions de livraison",
    availability: "Disponibilité à confirmer",
  },
  Spacenet: {
    color: "#ef3f4f",
    delivery: "Voir les conditions de livraison",
    availability: "Disponibilité à confirmer",
  },
};

// Color palette for additional stores (primini merchant list)
const STORE_COLORS = [
  "#6347f5", "#ff4757", "#2ed573", "#1e90ff", "#ffa502", "#a55eea",
  "#ff6348", "#3742fa", "#7bed9f", "#70a1ff", "#ff6b81", "#f368e0",
];
let storeColorIndex = 0;
function storeColor(store: string) {
  let hash = 0;
  for (let i = 0; i < store.length; i++) hash = (hash * 31 + store.charCodeAt(i)) | 0;
  return STORE_COLORS[Math.abs(hash) % STORE_COLORS.length];
}
function getStoreDetails(name: string) {
  const key = name === "Tunisianet" ? "Tunisianet" : name === "Spacenet" ? "Spacenet" : name;
  return STORE_DETAILS[key] ?? {
    color: storeColor(name),
    delivery: "Voir les conditions de livraison",
    availability: "Disponibilité à confirmer",
  };
}

const GENERIC_TOKENS = new Set([
  "pc", "portable", "ordinateur", "laptop", "tunisie", "de", "du", "la", "le", "les",
  "avec", "sans", "pour", "noir", "blanc", "silver", "gris", "blue", "bleu", "red", "rouge",
  "gaming", "gamer",
]);

const BRAND_NAMES = [
  "Spirit of Gamer", "Cooler Master", "Western Digital", "Hewlett Packard",
  "Apple", "Samsung", "Xiaomi", "Redmi", "Oppo", "Infinix", "Tecno", "Itel", "Honor",
  "Realme", "Nokia", "Motorola", "Huawei", "OnePlus", "Lenovo", "ThinkPad", "HP", "Dell",
  "Asus", "Acer", "MSI", "Gigabyte", "Logitech", "Redragon", "Razer", "SteelSeries", "HyperX",
  "Corsair", "Trust", "JBL", "Sony", "Philips", "LG", "TCL", "Hisense", "Haier", "Biolux",
  "Candy", "Beko", "Bosch", "Indesit", "Dahua", "Hikvision", "AOC", "ViewSonic", "Hama",
  "Rapoo", "Marvo", "Meetion", "Fantech", "Thermaltake", "Lexar", "Kingston", "Sandisk",
].sort((first, second) => second.length - first.length);

const BRAND_STOP_WORDS = new Set([
  "smartphone", "telephone", "téléphone", "pc", "ordinateur", "portable", "ecran", "écran", "moniteur",
  "casque", "ecouteur", "écouteur", "ecouteurs", "écouteurs", "souris", "clavier", "climatiseur",
  "sac", "housse", "filaire", "fil", "sans", "micro", "gamer", "gaming", "dos", "optique", "mecanique",
  "mécanique", "sans-fil", "avec", "pour", "usb", "rgb", "noir", "blanc", "bleu", "gris", "silver",
]);

function simplify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function offerSlug(url: string) {
  try {
    return decodeURIComponent(new URL(url).pathname.split("/").filter(Boolean).at(-1) ?? "")
      .replace(/^\d+-/, "")
      .replace(/\.html$/, "");
  } catch {
    return "";
  }
}

function comparisonTokens(value: string) {
  return new Set(
    simplify(value)
      .replace(/^\d+-/, "")
      .replace(/\.html$/, "")
      .split(/[^a-z0-9]+/)
      .filter((token) => token.length > 1 && !GENERIC_TOKENS.has(token)),
  );
}

function similarity(first: string, second: string) {
  const firstTokens = comparisonTokens(first);
  const secondTokens = comparisonTokens(second);
  let shared = 0;
  for (const token of firstTokens) {
    if (secondTokens.has(token)) shared += 1;
  }
  return shared / Math.max(firstTokens.size, secondTokens.size, 1);
}

function storeName(offer: SourceOffer): string | null {
  const value = simplify(offer.store);
  if (!value) return null;
  if (value.includes("tunisianet")) return "Tunisianet";
  if (value.includes("spacenet")) return "Spacenet";
  // Any other merchant: keep its display name (title-cased first word-ish)
  return offer.store;
}

function validMerchantUrl(url: string, _store: string) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

function merchantPrice(value: number, store: string) {
  // Tunisianet raw prices are in millimes (e.g. 169000) -> divide by 1000.
  // Other stores (primini feed) already carry DT values.
  const normalized = store === "Tunisianet" && value > 1000 ? value / 1000 : value;
  return Number(normalized.toFixed(3));
}

function merchantOldPrice(value: number, price: number, store: string) {
  const normalized = merchantPrice(value, store);
  if (!Number.isFinite(normalized) || normalized < price || normalized > price * 3) return price;
  return normalized;
}

function inferBrand(name: string) {
  const normalized = simplify(name);
  const known = BRAND_NAMES.find((brand) => normalized.includes(simplify(brand)));
  if (known) return known === "Hewlett Packard" ? "HP" : known;

  const candidate = name
    .replace(/[|/()\[\],:;+]/g, " ")
    .split(/\s+/)
    .map((word) => word.replace(/[^\p{L}\p{N}-]/gu, ""))
    .find((word) => {
      const token = simplify(word);
      return token.length > 2 && !BRAND_STOP_WORDS.has(token) && !/^\d/.test(token);
    });
  return candidate || "Autre marque";
}

function normalizeOffer(source: SourceOffer, productId: string): (StoreOffer & { similarity: number }) | null {
  const merchant = storeName(source);
  if (!merchant || !validMerchantUrl(source.url, merchant)) return null;
  const match = similarity(productId, offerSlug(source.url));
  if (match < 0.2) return null;

  const price = merchantPrice(source.price, merchant);
  if (!Number.isFinite(price) || price <= 0) return null;
  const details = getStoreDetails(merchant);
  return {
    store: merchant,
    price,
    oldPrice: merchantOldPrice(source.oldPrice, price, merchant),
    url: source.url,
    color: details.color,
    delivery: details.delivery,
    availability: details.availability,
    updatedAt: "Prix issu du dernier relevé importé",
    similarity: match,
  };
}

function productOffers(group: SourceProduct[]) {
  const productId = group[0].id;
  const bestByStore = new Map<string, StoreOffer & { similarity: number }>();
  for (const rawOffer of group.flatMap((product) => product.offers ?? [])) {
    const offer = normalizeOffer(rawOffer, productId);
    if (!offer) continue;
    const current = bestByStore.get(offer.store);
    if (!current || offer.similarity > current.similarity || (offer.similarity === current.similarity && offer.price < current.price)) {
      bestByStore.set(offer.store, offer);
    }
  }
  return [...bestByStore.values()]
    .map((offer): StoreOffer => ({
      store: offer.store,
      price: offer.price,
      oldPrice: offer.oldPrice,
      url: offer.url,
      color: offer.color,
      delivery: offer.delivery,
      availability: offer.availability,
      updatedAt: offer.updatedAt,
    }))
    .sort((first, second) => first.price - second.price);
}

const groupedProducts = new Map<string, SourceProduct[]>();
for (const sourceProduct of sourceProducts) {
  const existing = groupedProducts.get(sourceProduct.id) ?? [];
  existing.push(sourceProduct);
  groupedProducts.set(sourceProduct.id, existing);
}

export const products: Product[] = [...groupedProducts.values()]
  .flatMap((group): Product[] => {
    const source = group[0];
    const category = categoryFor(source.category);
    const offers = productOffers(group);
    if (!category || offers.length === 0) return [];
    const bestOffer = offers[0];
    const oldPrice = Math.max(bestOffer.price, bestOffer.oldPrice);
    const discount = oldPrice > bestOffer.price
      ? Math.round(((oldPrice - bestOffer.price) / oldPrice) * 100)
      : 0;
    const brand = inferBrand(source.name);
    const product: Product = {
      id: source.id,
      name: source.name,
      brand,
      category: category.label,
      categorySlug: category.slug,
      image: source.image,
      price: bestOffer.price,
      oldPrice,
      rating: 0,
      reviews: 0,
      stores: offers.length,
      discount,
      badge: discount > 0 ? "Promotion" : undefined,
      tag: offers.length > 1 ? "Prix comparé" : undefined,
      description: offers.length > 1
        ? `${source.name} est actuellement référencé chez ${offers.length} boutiques. Comparez les prix et ouvrez directement l’offre du marchand.`
        : `${source.name} est actuellement référencé chez une boutique. Consultez le prix et les conditions du marchand avant l’achat.`,
      specs: [
        ["Marque", brand],
        ["Catégorie", category.label],
        ["Boutiques référencées", String(offers.length)],
        ["Référence Soumly", source.id],
      ] as Array<[string, string]>,
      offers,
    };
    return [product];
  });

const allDefinitions = [
  ...CATEGORY_DEFINITIONS,
  ...[...generatedCategories.values()],
];

export const categories: Category[] = allDefinitions
  .map((definition) => {
    const count = products.filter((product) => product.categorySlug === definition.slug).length;
    return {
      slug: definition.slug,
      label: definition.label,
      icon: definition.icon,
      count,
      note: `${count} produit${count > 1 ? "s" : ""}`,
    };
  })
  .filter((category) => category.count > 0)
  .sort((first, second) => second.count - first.count);

export const stores = (["Tunisianet", "Spacenet"] as const).map((name) => {
  const storeProducts = products.filter((product) => product.offers.some((offer) => offer.store === name));
  const representedCategories = [...new Set(storeProducts.map((product) => product.category))];
  return {
    name,
    initials: name === "Tunisianet" ? "TN" : "SN",
    color: STORE_DETAILS[name].color,
    rating: 0,
    reviews: 0,
    offers: storeProducts.length,
    categories: representedCategories.join(" · "),
    url: name === "Tunisianet" ? "https://www.tunisianet.com.tn/" : "https://spacenet.tn/",
  };
});

export const guides = [
  { slug: "choisir-smartphone-2026", title: "Comment choisir son smartphone ?", excerpt: "Les critères utiles pour comparer l’écran, l’autonomie, la photo et le stockage.", category: "Smartphones", readTime: "7 min", icon: "Smartphone", tone: 1 },
  { slug: "choisir-pc-portable", title: "Bien choisir son PC portable", excerpt: "Processeur, mémoire, stockage et écran : adaptez la configuration à votre usage.", category: "Informatique", readTime: "8 min", icon: "Laptop", tone: 2 },
  { slug: "comprendre-ecrans", title: "Comprendre les écrans PC", excerpt: "Taille, définition, fréquence et type de dalle expliqués simplement.", category: "Informatique", readTime: "6 min", icon: "MonitorPlay", tone: 3 },
  { slug: "casque-ou-ecouteurs", title: "Casque ou écouteurs : que choisir ?", excerpt: "Confort, isolation, microphone et autonomie selon votre quotidien.", category: "Audio", readTime: "5 min", icon: "Headphones", tone: 4 },
  { slug: "climatiseur-economique", title: "Choisir un climatiseur économique", excerpt: "Puissance, technologie inverter et consommation selon la surface.", category: "Maison", readTime: "7 min", icon: "AirVent", tone: 1 },
  { slug: "comparer-prix-en-ligne", title: "Comparer un prix correctement", excerpt: "Référence exacte, livraison, garantie et disponibilité : les vérifications essentielles.", category: "Conseils", readTime: "4 min", icon: "BadgeCheck", tone: 2 },
];

export function getCategory(slug?: string) {
  return categories.find((category) => category.slug === slug) ?? null;
}

export function getProduct(slug?: string) {
  return products.find((product) => product.id === slug) ?? null;
}

export function relatedProducts(product: Product, limit = 4) {
  return products
    .filter((candidate) => candidate.id !== product.id && candidate.categorySlug === product.categorySlug)
    .slice(0, limit);
}

export function formatPrice(value: number) {
  const hasCents = Math.abs(value - Math.round(value)) > 0.0001;
  return `${new Intl.NumberFormat("fr-TN", {
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(value)} DT`;
}
