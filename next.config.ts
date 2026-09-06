import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    root: __dirname,
  },
  // Enable standalone output for production deployment
  output: 'standalone',
  
  // Optimize images
  images: {
    // Restrict the image optimizer to known hosts. A wildcard ('**') turns
    // /_next/image into an open proxy (SSRF). Uploaded property/team/owner
    // images are served from same-origin '/uploads/*' (relative paths need no
    // remotePattern), so only a handful of external hosts are required.
    remotePatterns: [
      { protocol: 'https', hostname: 'ram-haim.co.il' },
      { protocol: 'https', hostname: 'www.ram-haim.co.il' },
      { protocol: 'https', hostname: '*.googleapis.com' },
      { protocol: 'https', hostname: '*.gstatic.com' },
      { protocol: 'https', hostname: '*.google.com' },
      { protocol: 'http', hostname: 'localhost' },
      // Property photos referenced as Unsplash URLs. Without this exact host
      // the optimizer returns 400 and EVERY such image is broken in production
      // (and uncrawlable for SEO). Specific host, not a wildcard, so /_next/image
      // is not turned into an open proxy.
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
    // Allow unoptimized images for development
    unoptimized: process.env.NODE_ENV === 'development',
    // Add domains for image optimization
    domains: [],
    // Image optimization settings
    // Whitelist the quality levels actually requested by next/image usages.
    // Next.js defaults this to [75]; FloorPlansSection/AboutSection ask for 85,
    // which warns (and would 400 in prod) unless listed here.
    qualities: [75, 85],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512, 640, 768],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year for better caching
    // Enable lazy loading by default
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Compression
  compress: true,

  // Reduce bundle size
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  
  // Production optimizations
  poweredByHeader: false,
  reactStrictMode: true,
  
  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', 'swiper', '@ant-design/icons', 'react-icons'],
    // NOTE: optimizeCss was removed — it requires the `beasties` (or legacy
    // `critters`) package to inline critical CSS, which isn't installed, so the
    // flag was a no-op at best and a build hazard at worst. Re-add it together
    // with `npm i -D beasties` if critical-CSS inlining is wanted later.
    // Retested 2026-09-06 with beasties 0.5.4 on Next 16.1.6: the flag inlined
    // only 269 bytes and left both stylesheet links render-blocking, so it does
    // not work on this App Router build. Do not re-enable without re-measuring.
  },
  
  // Webpack optimizations
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        usedExports: true,
      };
    }
    return config;
  },

  // Redirect old routes to new ones with query parameters
  async redirects() {
    return [
      {
        source: '/apartments/rent',
        destination: '/apartments?dealType=rent',
        permanent: true,
      },
      {
        source: '/apartments/sale',
        destination: '/apartments?dealType=sale',
        permanent: true,
      },
    ];
  },

  // Rewrite /uploads/* to API route — сервер сохраняет в UPLOADS_DIR и API отдаёт оттуда же
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: '/api/uploads/:path*',
      },
    ];
  },
  
  // Headers for caching and security
  async headers() {
    // NEVER force immutable caching on Next's own asset routes in development.
    // Turbopack serves its JS chunks from /_next/static/* in dev; an `immutable`
    // Cache-Control makes the browser pin stale chunks forever, so after an edit
    // it keeps serving old chunks whose module factories no longer exist —
    // surfacing as "module factory is not available" (and a hard-reload can't
    // evict an `immutable` response). Next.js already sets the correct immutable
    // caching on /_next/static automatically in production, so these custom
    // rules are prod-only and redundant-but-harmless there.
    const isProd = process.env.NODE_ENV === 'production';
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            // Force HTTPS for 2 years incl. subdomains (only sent over HTTPS).
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self), interest-cohort=()'
          },
          {
            // Cross-origin window isolation (XS-Leaks / reverse-tabnabbing /
            // opener abuse). 'same-origin' is safe here: the site opens no
            // cross-origin auth/payment popups and keeps no window.open refs
            // (WhatsApp/social links are fire-and-forget _blank). NOT COEP:
            // require-corp would break Google Maps tiles/fonts and img-src https:.
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin'
          },
          {
            // Defense-in-depth against XSS/clickjacking/data exfiltration.
            // script-src keeps 'unsafe-inline'/'unsafe-eval' because the app
            // ships inline bootstrap scripts and uses the Google Maps JS API
            // without a nonce; object-src/base-uri/frame-ancestors are the
            // hard stops. Google Maps + self-hosted fonts are allowlisted.
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "base-uri 'self'",
              "object-src 'none'",
              "frame-ancestors 'self'",
              "form-action 'self'",
              "img-src 'self' data: blob: https:",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://maps.googleapis.com https://maps.gstatic.com https://www.googletagmanager.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' data: https://fonts.gstatic.com",
              "connect-src 'self' https://nominatim.openstreetmap.org https://maps.googleapis.com https://maps.gstatic.com https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com",
              "frame-src 'self' https://www.google.com https://maps.google.com",
              "worker-src 'self' blob:",
              "upgrade-insecure-requests",
            ].join('; ')
          }
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/uploads/:path*',
        headers: [
          {
            key: 'Cache-Control',
            // Для загруженных картинок не кешируем агрессивно:
            // браузер и прокси всегда могут проверить наличие обновления.
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*.mp4',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*.jpg',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000, immutable',
          },
        ],
      },
      {
        source: '/:path*.png',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000, immutable',
          },
        ],
      },
      {
        source: '/api/properties',
        headers: [
          {
            key: 'Cache-Control',
            // stale-while-revalidate let a browser serve a five-minute-old
            // listing after an admin edit. The route is force-dynamic, and
            // Cloudflare does not cache it, so nothing is gained by a stale
            // window — revalidate every time instead.
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
      // Prod-only: in dev these break Turbopack chunk revalidation (see note above).
      ...(isProd
        ? [
            {
              source: '/_next/static/:path*',
              headers: [
                {
                  key: 'Cache-Control',
                  value: 'public, max-age=31536000, immutable',
                },
              ],
            },
            {
              source: '/_next/image',
              headers: [
                {
                  key: 'Cache-Control',
                  value: 'public, max-age=31536000, immutable',
                },
              ],
            },
          ]
        : []),
    ];
  },
};

export default nextConfig;
