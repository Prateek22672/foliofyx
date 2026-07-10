// client/src/components/SEO.jsx
// One SEO component for every page — title, description, canonical, Open Graph,
// Twitter cards and optional JSON-LD structured data, via react-helmet-async
// (HelmetProvider is already mounted in main.jsx).
//
// Usage:
//   <SEO
//     title="Free Portfolio Website Builder"
//     description="Build a stunning portfolio in minutes — free."
//     path="/free-portfolio-website"
//     jsonLd={{ "@type": "FAQPage", ... }}
//   />

import { Helmet } from "react-helmet-async";

const ORIGIN = "https://foliofyx.in";
const SITE_NAME = "FolioFYX";
const DEFAULT_IMAGE = `${ORIGIN}/og-cover.png`;
const DEFAULT_DESCRIPTION =
  "FolioFYX is a free AI website builder. Turn a prompt, resume or reference design into a polished portfolio or business website — then customize it in a Wix-style studio and publish on your own domain.";

export default function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "/",
  image = DEFAULT_IMAGE,
  type = "website",
  noindex = false,
  jsonLd = null,
}) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Free AI Website & Portfolio Builder`;
  const url = `${ORIGIN}${path === "/" ? "" : path}`;
  const blocks = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {blocks.map((block, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify({ "@context": "https://schema.org", ...block })}
        </script>
      ))}
    </Helmet>
  );
}

// Shared JSON-LD builders so pages stay consistent.
export const ORG_JSONLD = {
  "@type": "Organization",
  name: SITE_NAME,
  url: ORIGIN,
  logo: `${ORIGIN}/favicon.png`,
  sameAs: [],
};

export const WEBAPP_JSONLD = {
  "@type": "WebApplication",
  name: SITE_NAME,
  url: ORIGIN,
  applicationCategory: "DesignApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description: DEFAULT_DESCRIPTION,
};

export function faqJsonLd(faqs) {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map(([q, a]) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

export function breadcrumbJsonLd(crumbs) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map(([name, path], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: `${ORIGIN}${path}`,
    })),
  };
}
