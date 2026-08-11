import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { searchProducts } from "../../../(soumly-pages)/_data/products.server";

// Homepage autocomplete endpoint.
// Returns at most 8 lightweight product summaries — NEVER the catalog.
export function GET(request: NextRequest) {
	const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";
	if (q.length < 2) return NextResponse.json({ results: [] });
	const results = searchProducts(q.slice(0, 60), 8);
	return NextResponse.json({ results });
}
