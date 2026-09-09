import type { Metadata, Viewport } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { siteConfig } from "@/lib/site";
import { siteGraphJsonLd } from "@/lib/jsonld";
import { OG_BG } from "@/lib/og/size";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600"],
});

// Tints the Android address bar and task switcher. manifest.ts declares the same
// colour for the installed/home-screen case. Note: `manifest` itself is emitted by
// Next from src/app/manifest.ts — do not add metadata.manifest here or it doubles up.
export const viewport: Viewport = {
  themeColor: OG_BG,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | The Business of Eye Care`,
    template: `%s · ${siteConfig.shortName}`,
  },
  description: siteConfig.description,
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": `${siteConfig.url}/feed.xml`,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: "en_US",
    title: `${siteConfig.name} | The Business of Eye Care`,
    description: siteConfig.description,
    url: siteConfig.url,
    // Belt-and-braces: the root opengraph-image.tsx already covers "/", but this
    // means any future route that forgets pageMetadata() still inherits a card.
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: siteConfig.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | The Business of Eye Care`,
    description: siteConfig.description,
    images: [{ url: "/opengraph-image", alt: siteConfig.name }],
  },
  // Tokens land at deploy time; see NEXT_PUBLIC_GSC_TOKEN / NEXT_PUBLIC_BING_TOKEN.
  ...(process.env.NEXT_PUBLIC_GSC_TOKEN || process.env.NEXT_PUBLIC_BING_TOKEN
    ? {
        verification: {
          ...(process.env.NEXT_PUBLIC_GSC_TOKEN
            ? { google: process.env.NEXT_PUBLIC_GSC_TOKEN }
            : {}),
          ...(process.env.NEXT_PUBLIC_BING_TOKEN
            ? { other: { "msvalidate.01": process.env.NEXT_PUBLIC_BING_TOKEN } }
            : {}),
        },
      }
    : {}),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${plexMono.variable} h-full antialiased`}
    >
      <Script
        id="ga4"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${siteConfig.ga4Id}`}
      />
      <Script
        id="ga4-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${siteConfig.ga4Id}');`,
        }}
      />
      <body className="flex min-h-full flex-col bg-canvas">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteGraphJsonLd()) }}
        />
        <SiteHeader />
        {/* Fixed floating nav: pages clear it via --header-offset; full-bleed heroes pull under with -mt-(--header-offset) */}
        <main id="main" className="flex-1 pt-(--header-offset)">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
