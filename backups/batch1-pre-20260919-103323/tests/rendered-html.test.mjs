import assert from "node:assert/strict";
import test from "node:test";

const developmentPreviewMeta =
	/<meta(?=[^>]*\bname=["']codex-preview["'])(?=[^>]*\bcontent=["']development["'])[^>]*>/i;
const multiStoreProduct = "prim-6797-machine-laver-top-samsung-9-kg-wa90h4400ss-silver";

const workerUrl = new URL("../dist/server/index.js", import.meta.url);
workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
const { default: worker } = await import(workerUrl.href);

const env = {
	ASSETS: {
		fetch: async () => new Response("Not found", { status: 404 }),
	},
};
const context = {
	waitUntil() {},
	passThroughOnException() {},
};

async function request(path) {
	return worker.fetch(
		new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }),
		env,
		context,
	);
}

test("renders development preview metadata", async () => {
	const response = await request("/");
	assert.equal(response.status, 200);
	assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
	assert.match(await response.text(), developmentPreviewMeta);
});

test("homepage exposes the cleaned French catalog", async () => {
	const response = await request("/");
	const html = await response.text();
	assert.equal(response.status, 200);
	assert.match(html, /Comparez les prix/);
	assert.match(html, /Boutiques référencées/);
	assert.doesNotMatch(html, /−0%/);
	assert.doesNotMatch(html, /596-smartphone-tunisie/);
});

test("category, search, store and legal routes render", async () => {
	for (const path of [
		"/categories",
		"/categories/ordinateurs-portables",
		"/recherche?q=Lenovo%20V15",
		"/boutiques",
		"/guides",
		"/confidentialite",
		"/mentions-legales",
	]) {
		const response = await request(path);
		assert.equal(response.status, 200, path);
	}
});

test("product detail renders real merchant comparisons", async () => {
	const response = await request(`/produit/${multiStoreProduct}`);
	const html = await response.text();
	assert.equal(response.status, 200);
	assert.match(html, /MEILLEUR PRIX/);
	assert.match(html, /Voir chez/);
	// Real primini multi-store data: the washing machine has 13 merchants
	assert.match(html, /Tunisianet/);
	assert.match(html, /MyTEK/);
	assert.match(html, /Batam/);
});

test("PS5 console does not accept an accessory controller as a merchant offer", async () => {
	// Regression: a PS5 controller (289 DT from Promouv) used to pass the weak
	// URL-similarity guard and appear as an offer for the PS5 console bundle
	// (3169 DT from SpaceNet), producing a false "2 boutiques" + "saving".
	const response = await request("/produit/93432-playstation-5-edition-standard-avec-2eme-manette");
	const html = await response.text();
	assert.equal(response.status, 200);
	// The only accepted offer is the real console bundle from SpaceNet.
	assert.match(html, /SpaceNet/);
	assert.doesNotMatch(html, /Promouv/);
	// The displayed price is the console (3169 DT), not the controller (289).
	assert.match(html, /3\s*169/);
	assert.doesNotMatch(html, /289/);
});

test("legacy product route redirects and unknown routes return 404", async () => {
	const legacy = await request(`/product/${multiStoreProduct}`);
	assert.equal(legacy.status, 307);
	assert.match(legacy.headers.get("location") ?? "", new RegExp(`/produit/${multiStoreProduct}$`));

	const missing = await request("/page-qui-n-existe-pas");
	assert.equal(missing.status, 404);
	assert.match(await missing.text(), /Page introuvable/);
});
