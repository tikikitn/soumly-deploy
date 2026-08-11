import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getProductsByIds } from "../../../(soumly-pages)/_data/products.server";

// Favorites resolver: client sends ONLY its saved ids, server returns ONLY
// those products as lightweight summaries. Never the full catalog.
export async function POST(request: NextRequest) {
	let ids: unknown;
	try {
		ids = (await request.json())?.ids;
	} catch {
		return NextResponse.json({ products: [], error: "invalid-json" }, { status: 400 });
	}
	if (!Array.isArray(ids)) {
		return NextResponse.json({ products: [], error: "ids-required" }, { status: 400 });
	}
	const clean = ids
		.filter((id): id is string => typeof id === "string" && id.length > 0 && id.length <= 200)
		.map((id) => id.slice(0, 200));
	const products = getProductsByIds(clean);
	return NextResponse.json({ products });
}
