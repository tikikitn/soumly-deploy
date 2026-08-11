// Google Analytics 4 — global analytics component.
// Loads gtag after the page becomes interactive (afterInteractive) so it
// never blocks initial render. Tracks page views on route changes.
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
		// Defer to after hydration; gtag may not be ready on the very first
		// navigation tick (the script itself fires the initial page_view).
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
					gtag('config', '${GA_ID}', { page_path: window.location.pathname });
				`}
			</Script>
		</>
	);
}
