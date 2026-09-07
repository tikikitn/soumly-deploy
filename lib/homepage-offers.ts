import type { ProductSummary } from "../app/(soumly-pages)/_data/content.shared";

// Abort guards callbacks as well as the network: late responses cannot replace
// a newer selection, even when a transport has already completed before abort.
export async function loadHomepageOffers(
	category: string,
	signal: AbortSignal,
	onSuccess: (products: ProductSummary[]) => void,
	onError: () => void,
	fetcher: typeof fetch = fetch,
) {
	try {
		const response = await fetcher(`/api/homepage/offers?category=${encodeURIComponent(category)}`, { signal });
		if (!response.ok) throw new Error("Offers unavailable");
		const result = await response.json();
		if (result.category !== category || !Array.isArray(result.products)) {
			throw new Error("Invalid offers response");
		}
		if (!signal.aborted) onSuccess(result.products);
	} catch {
		if (!signal.aborted) onError();
	}
}
