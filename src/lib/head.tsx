import type { Config } from "./config";

// SEO meta tags, rendered natively by React 19 (hoisted/document-safe).
// Returns a fragment — the <head> wrapper lives in build.tsx.
export function SeoHead({ meta }: { meta: Config["meta"] }) {
  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Person",
    name: meta.title,
    description: meta.description,
    ...(meta.canonicalUrl ? { url: meta.canonicalUrl } : {}),
  }).replace(/</g, "\\u003c");

  return (
    <>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      {meta.canonicalUrl ? <link rel="canonical" href={meta.canonicalUrl} /> : null}
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:type" content="website" />
      {meta.canonicalUrl ? <meta property="og:url" content={meta.canonicalUrl} /> : null}
      {meta.ogImage ? <meta property="og:image" content={meta.ogImage} /> : null}
      <meta name="twitter:card" content="summary_large_image" />
      <script type="application/ld+json">{jsonLd}</script>
    </>
  );
}
