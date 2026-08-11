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
"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { useEffect } from "react";

const GA_ID = "G-GWRZRHR8FV";

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
