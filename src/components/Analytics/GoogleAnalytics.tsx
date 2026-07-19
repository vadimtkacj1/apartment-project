import Script from 'next/script';

/**
 * Google Analytics 4 (GA4) tag.
 *
 * Measurement ID "G-DNZER16M0L" -> GA4 property "Aiterra" (properties/543571916,
 * web stream "go-apartsale.online") under the Aiterra account. A Measurement ID is not
 * a secret (it ships in the page HTML), so it's the hardcoded default; set
 * NEXT_PUBLIC_GA_ID to override (e.g. a separate staging property).
 *
 * Only loads in production builds so localhost/dev hits don't pollute the
 * property. GA4 Enhanced Measurement tracks client-side (App Router) navigations
 * via the History API automatically, so no manual route-change hook is needed.
 *
 * NOTE: the site's CSP (next.config.ts) must allow googletagmanager.com in
 * script-src and *.google-analytics.com in connect-src or the tag is blocked.
 */
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-DNZER16M0L';

export default function GoogleAnalytics() {
  // Don't load GA outside production — keeps dev/preview traffic out of the data.
  if (process.env.NODE_ENV !== 'production') return null;
  if (!GA_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  );
}
