import { getHomepageOffers } from "../../../(soumly-pages)/_data/products.server";

// No shared response caching: keep HTTP/RSC and user-specific responses separate.
export async function GET(request: Request) {
	const values = new URL(request.url).searchParams.getAll("category");
	const products = values.length === 1 ? getHomepageOffers(values[0]) : null;
	const headers = { "Cache-Control": "no-store" };
	if (products === null) {
		return Response.json({ error: "Invalid category" }, { status: 400, headers });
	}
	return Response.json({ category: values[0], products }, { headers });
}
