import type { Host, Event, FreeResource } from "@/lib/schemas";
import { siteConfig } from "@/lib/site";

/**
 * Builders for JSON-LD structured data. Everything here emits absolute
 * `https://www.obacademy.org` URLs so search engines see one canonical origin.
 */

/** Stable node ids so every entity on the site joins one graph. */
export const ORG_ID = `${siteConfig.url}/#organization`;
export const WEBSITE_ID = `${siteConfig.url}/#website`;
export const PODCAST_SERIES_ID = `${siteConfig.url}/podcast#series`;

/**
 * Topics OBA demonstrably covers, drawn from the episode catalogue rather than
 * claimed. Used for entity disambiguation by search and answer engines.
 */
const KNOWS_ABOUT = [
  "Ophthalmology practice management",
  "Eye care practice ownership",
  "Cataract surgery workflow",
  "Premium intraocular lens conversion",
  "Office-based surgery",
  "Optometric co-management compliance",
  "Private equity in eye care",
  "Ophthalmology practice marketing",
  "Patient experience in eye care",
  "Staff recruitment and retention in medical practices",
];

/** Organization node for the site owner. Emitted once, in the root layout. */
export function organizationJsonLd() {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: siteConfig.name,
    alternateName: siteConfig.shortName,
    url: siteConfig.url,
    email: siteConfig.email,
    description: siteConfig.description,
    // TODO: swap for a square 1024x1024 asset once one exists — Google's logo
    // guidance wants a square/near-square image, and this wordmark is 3.6:1.
    logo: {
      "@type": "ImageObject",
      url: `${siteConfig.url}/images/oba-logo.webp`,
      width: 2278,
      height: 634,
    },
    sameAs: Object.values(siteConfig.socials),
    knowsAbout: KNOWS_ABOUT,
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "editorial",
        email: siteConfig.email,
        url: `${siteConfig.url}/contact`,
      },
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.line1,
      addressLocality: "Mississauga",
      addressRegion: "ON",
      postalCode: "L5G 2R4",
      addressCountry: "CA",
    },
  };
}

/**
 * WebSite node. No `potentialAction`/SearchAction — the site has no search, and
 * declaring one would be a false statement in structured data.
 */
export function webSiteJsonLd() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: "en",
    publisher: { "@id": ORG_ID },
  };
}

/** The site-wide entity graph: one script tag, two linked nodes. */
export function siteGraphJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [organizationJsonLd(), webSiteJsonLd()],
  };
}

type Crumb = { label: string; href?: string };

/** BreadcrumbList from a breadcrumb trail. The last crumb is the current page (no href). */
export function breadcrumbJsonLd(items: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: `${siteConfig.url}${item.href}` } : {}),
    })),
  };
}

/**
 * FAQPage from the visible Q&A blocks on a page. Only the plain-text `answer`
 * is read — never a rendered node — so markup can never leak into schema.
 */
export function faqJsonLd(faqs: readonly { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

/** WebPage-family node for a static page, linked to the site graph. */
export function pageJsonLd({
  type = "WebPage",
  name,
  description,
  path,
}: {
  type?: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage";
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": type,
    name,
    description,
    url: `${siteConfig.url}${path}`,
    inLanguage: "en",
    isPartOf: { "@id": WEBSITE_ID },
    ...(type === "AboutPage" ? { mainEntity: { "@id": ORG_ID } } : {}),
    ...(type === "ContactPage" ? { about: { "@id": ORG_ID } } : {}),
  };
}

/** ItemList of the downloadable guides on /resources/free-resources. */
export function freeResourceListJsonLd(resources: FreeResource[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: resources.map((r, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "DigitalDocument",
        name: r.title,
        description: r.description,
        author: { "@type": "Person", name: r.author },
        encodingFormat: "application/pdf",
        url: `${siteConfig.url}${r.pdfUrl}`,
        ...(r.image ? { image: `${siteConfig.url}${r.image}` } : {}),
        ...(r.tags.length ? { keywords: r.tags.join(", ") } : {}),
        publisher: { "@id": ORG_ID },
        isAccessibleForFree: true,
      },
    })),
  };
}

/** ItemList of Event entities for a page listing real events. */
export function eventListJsonLd(events: Event[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: events.map((event, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: eventJsonLd(event),
    })),
  };
}

/** Single Event entity for a scheduled panel on its own page. */
export function eventJsonLd(event: Event) {
  return {
    "@type": "Event",
    name: event.title,
    startDate: event.startDate,
    ...(event.endDate ? { endDate: event.endDate } : {}),
    ...(event.image ? { image: `${siteConfig.url}${event.image}` } : {}),
    ...(event.excerpt ? { description: event.excerpt } : {}),
    eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: { "@type": "VirtualLocation", url: `${siteConfig.url}/resources/events` },
    organizer: { "@id": ORG_ID },
    url: `${siteConfig.url}/resources/events/${event.slug}`,
  };
}

/** Full PodcastSeries entity for the podcast hub page. */
export function podcastSeriesJsonLd(hosts: Host[], description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "PodcastSeries",
    "@id": PODCAST_SERIES_ID,
    name: "The Ophthalmology Business Podcast",
    url: `${siteConfig.url}/podcast`,
    description,
    inLanguage: "en",
    genre: "Business",
    webFeed: `${siteConfig.url}/feed.xml`,
    publisher: { "@id": ORG_ID },
    host: hosts.map((h) => person(h, `${siteConfig.url}/podcast/hosts`)),
  };
}

/** ItemList of Person entities for the hosts page. */
export function personListJsonLd(hosts: Host[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: hosts.map((h, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: person(h, `${siteConfig.url}/podcast/hosts`),
    })),
  };
}

/** Minimal Person node; id is stable across the site so entities join together. */
export function person(host: Host, pageUrl: string) {
  return {
    "@type": "Person",
    "@id": `${siteConfig.url}/podcast/hosts#${host.slug}`,
    name: host.name,
    ...(host.title ? { jobTitle: host.title } : {}),
    ...(host.bio ? { description: host.bio } : {}),
    url: pageUrl,
    ...(host.avatar ? { image: `${siteConfig.url}${host.avatar}` } : {}),
    ...(Object.values(host.socials).filter(Boolean).length
      ? { sameAs: Object.values(host.socials).filter(Boolean) }
      : {}),
  };
}
