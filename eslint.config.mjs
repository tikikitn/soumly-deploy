import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
	...nextVitals,
	...nextTs,
	// This app (Vinext, not standard Next.js) deliberately uses <img> for
	// product images — next/image optimization is not applicable here.
	{
		rules: {
			"@next/next/no-img-element": "off",
		},
	},
	// Override default ignores of eslint-config-next.
	globalIgnores([
		// Default ignores of eslint-config-next:
		".next/**",
		"out/**",
		"build/**",
		"next-env.d.ts",
		// Generated data file (40MB primini catalog) — not hand-written code.
		"app/products.ts",
	]),
]);

export default eslintConfig;
