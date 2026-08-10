// Soumly CLIENT-SAFE module.
// Re-exports ONLY lightweight shared data (types, families, guides, formatPrice).
// IMPORTANT: never import products.server.ts or app/products.ts here.
// Client Components must receive catalog data as props from Server Components.
export {
	type Category,
	FAMILY_DEFINITIONS,
	FAMILY_GROUPS,
	FAMILY_LABELS,
	type Family,
	type FamilyGroup,
	formatPrice,
	guides,
	type Product,
	type StoreOffer,
} from "./content.shared";
