import type { Config } from "./config";

function buildJsonLd(config: Config) {
  const { meta, contact, items } = config;
  const graph: Record<string, unknown>[] = [];
  const sameAs = [meta.github, meta.x, meta.linkedin].filter(
    (u): u is string => Boolean(u),
  );

  graph.push({
    "@type": "Person",
    name: meta.title,
    description: meta.description,
    ...(meta.canonicalUrl ? { url: meta.canonicalUrl } : {}),
    email: contact.email,
    ...(meta.ogImage ? { image: meta.ogImage } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  });

  if (meta.canonicalUrl) {
    graph.push({
      "@type": "WebSite",
      name: meta.title,
      url: meta.canonicalUrl,
      description: meta.description,
    });
  }

  if (items.length) {
    graph.push({
      "@type": "ItemList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item:
          item.media.kind === "video"
            ? {
                "@type": "VideoObject",
                name: item.title,
                description: item.description,
                thumbnailUrl: item.media.poster,
                contentUrl: item.media.src,
                ...(item.link ? { url: item.link } : {}),
                ...(item.tags.length ? { keywords: item.tags.join(", ") } : {}),
              }
            : {
                "@type": "ImageObject",
                name: item.title,
                description: item.description,
                contentUrl: item.media.src,
                ...(item.link ? { url: item.link } : {}),
                ...(item.tags.length ? { keywords: item.tags.join(", ") } : {}),
              },
      })),
    });
  }

  return { "@context": "https://schema.org", "@graph": graph };
}

// Full SEO head, rendered natively by React 19. Returns a fragment — the
// <head> wrapper lives in build.tsx.
export function SeoHead({ config }: { config: Config }) {
  const { meta } = config;
  const jsonLd = JSON.stringify(buildJsonLd(config)).replace(/</g, "\\u003c");

  return (
    <>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <meta name="author" content={meta.title} />
      <meta name="robots" content="index, follow" />
      {meta.canonicalUrl ? <link rel="canonical" href={meta.canonicalUrl} /> : null}
      {meta.favicon ? <link rel="icon" href={meta.favicon} /> : null}

      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={meta.title} />
      {meta.canonicalUrl ? <meta property="og:url" content={meta.canonicalUrl} /> : null}
      {meta.ogImage ? <meta property="og:image" content={meta.ogImage} /> : null}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      {meta.ogImage ? <meta name="twitter:image" content={meta.ogImage} /> : null}

      <script type="application/ld+json">{jsonLd}</script>
    </>
  );
}
