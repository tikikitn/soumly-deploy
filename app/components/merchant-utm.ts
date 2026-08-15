// Merchant-visit UTM (referral attribution).
//
// Soumly's outbound offer links use rel="noopener noreferrer", so the
// browser sends NO Referer header to the merchant: without extra help the
// visit would appear as "direct" in the merchant's own analytics.
//
// At click time we append a minimal referral UTM to the destination URL.
// The merchant's analytics (GA4, Shopify, server logs, ...) then shows
// source = soumly. The stored offer URL is NEVER mutated — only the
// in-flight navigation is rewritten.
export function withMerchantUtm(url: string): string {
	if (!url) return url;
	const separator = url.includes("?") ? "&" : "?";
	return `${url}${separator}utm_source=soumly&utm_medium=referral`;
}
