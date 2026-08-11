// Google Analytics 4 — global analytics component.
// Loads gtag after the page becomes interactive (afterInteractive) so it
// never blocks initial render.
//
// Page-view strategy: automatic page_view from gtag('config') is DISABLED
// (send_page_view: false). Exactly ONE page_view is sent manually:
//   - on initial load (via useEffect after hydration)
//   - on each client-side navigation (usePathname/useSearchParams change)
// This avoids the duplicate page_view that would otherwise fire on the
// first load (config auto-page_view + manual effect).
//
// Custom events:
//   - outbound_store_click: fired immediately before the browser opens an
//     external retailer URL (same-tab or target=_blank). It carries
//     Soumly-specific metadata (product, store, price, category) that
//     GA4's built-in outbound "click" event does not include.
//     Navigation is NEVER blocked; if gtag is missing the click still
//     proceeds normally.
"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { useEffect } from "react";

const GA_ID = "G-GWRZRHR8FV";

export type OutboundStoreClickParams = {
	product_id?: string;
	product_name?: string;
	store_name: string;
	price?: number;
	category?: string;
	destination_url: string;
};

// Reusable typed helper: fire outbound_store_click with only defined
// values (gtag drops undefined keys, but we build the payload explicitly
// so no undefined/null ever reaches the data layer).
export function trackOutboundStoreClick(params: OutboundStoreClickParams) {
	const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
	if (typeof gtag !== "function") return; // never block navigation
	const payload: Record<string, string | number> = {
		store_name: params.store_name,
		destination_url: params.destination_url,
	};
	if (params.product_id !== undefined) payload.product_id = params.product_id;
	if (params.product_name !== undefined) payload.product_name = params.product_name;
	if (params.price !== undefined && Number.isFinite(params.price)) payload.price = params.price;
	if (params.category !== undefined) payload.category = params.category;
	gtag("event", "outbound_store_click", payload);
}

// Guard against double-firing from one physical click (e.g. duplicate
// event handlers or a click that bubbles twice).
export function guardOutboundClick(element: HTMLElement | null): boolean {
	if (!element || element.dataset.gaOutboundTracked === "1") return true;
	element.dataset.gaOutboundTracked = "1";
	return false;
}

function sendPageView(path: string) {
	if (typeof window === "undefined" || !(window as unknown as { gtag?: unknown }).gtag) return;
	(window as unknown as { gtag: (...args: unknown[]) => void }).gtag("event", "page_view", {
		page_path: path,
		page_location: window.location.href,
		page_title: document.title,
	});
}

export default function Analytics() {
	const pathname = usePathname();
	const searchParams = useSearchParams();

	useEffect(() => {
		const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
		// Defer one frame so gtag is ready after the config script runs.
		const frame = window.requestAnimationFrame(() => sendPageView(url));
		return () => window.cancelAnimationFrame(frame);
	}, [pathname, searchParams]);

	return (
		<>
			<Script
				src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
				strategy="afterInteractive"
			/>
			<Script id="gtag-init" strategy="afterInteractive">
				{`
					window.dataLayer = window.dataLayer || [];
					function gtag(){dataLayer.push(arguments);}
					gtag('js', new Date());
					gtag('config', '${GA_ID}', {
						send_page_view: false,
						page_path: window.location.pathname
					});
				`}
			</Script>
		</>
	);
}
