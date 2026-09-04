import { describe, expect, it } from "vitest";
import { build } from "./build";
import { configSchema } from "./config";
import { templates } from "./templates";

const config = {
  meta: {
    title: "Jane Doe — Designer",
    description: "Selected work.",
    canonicalUrl: "https://jane.design",
  },
  contact: { email: "hello@jane.design" },
  templateId: "minimal",
  items: [
    {
      id: "1",
      title: "Dashboard",
      description: "A dashboard.",
      media: {
        kind: "video",
        src: "https://cdn.example.com/demo.mp4",
        poster: "https://cdn.example.com/poster.webp",
      },
      tags: ["design"],
    },
  ],
};

describe("artifact build", () => {
  it("produces a canonical SEO-ready document", () => {
    const html = build(configSchema.parse(config));

    expect(html.startsWith("<!doctype html>")).toBe(true);
    expect(html).toContain("<title>Jane Doe — Designer</title>");
    expect(html).toContain('rel="canonical"');
    expect(html).toContain("application/ld+json");
    expect(html).toContain('"@type":"Person"');
    expect(html).toContain('"@type":"ItemList"');
    expect(html).toContain('"@type":"VideoObject"');
    expect(html).toContain('name="author"');
    expect(html).toContain('name="robots"');
    expect(html).toContain('property="og:site_name"');
    expect(html).toContain('name="twitter:title"');
    expect(html).toContain("mailto:hello@jane.design");
    // canonical attribute casing (React 19 normalizer)
    expect(html).toContain("playsinline=");
    expect(html).toContain("charset=");
    expect(html).not.toMatch(/autoPlay=|playsInline=|charSet=/);
    // lazy loader present
    expect(html).toContain("IntersectionObserver");
  });

  it("renders every template without throwing", () => {
    for (const id of Object.keys(templates) as Array<keyof typeof templates>) {
      const html = build(configSchema.parse({ ...config, templateId: id }));
      expect(html).toContain("pf-grid");
    }
  });

  it("includes the client-side tag filter", () => {
    const html = build(configSchema.parse(config));
    expect(html).toContain('data-tag="design"');
    expect(html).toContain('data-tags="design"');
    expect(html).toContain("addEventListener");
  });

  it("renders social profile links above the filter", () => {
    const withSocial = {
      ...config,
      meta: { ...config.meta, github: "https://github.com/jane", x: "https://x.com/jane" },
    };
    const html = build(configSchema.parse(withSocial));
    expect(html).toContain('href="https://github.com/jane"');
    expect(html).toContain(">GitHub</a>");
    expect(html).toContain(">X</a>");
  });

  it("renders an optional project link per item", () => {
    const withLink = {
      ...config,
      items: [{ ...config.items[0], link: "https://project.example.com" }],
    };
    const html = build(configSchema.parse(withLink));
    expect(html).toContain('href="https://project.example.com"');
    expect(html).toContain("View project");
    expect(html).toContain('"url":"https://project.example.com"');
  });

  it("renders videos muted with controls and no autoplay (click to play)", () => {
    const html = build(configSchema.parse(config));
    expect(html).toContain("controls");
    expect(html).toContain("muted");
    expect(html).not.toContain("autoplay");
  });
});

describe("config schema", () => {
  it("rejects non-https and unsafe media URLs", () => {
    const http = {
      ...config,
      items: [{ ...config.items[0], media: { ...config.items[0].media, src: "http://cdn.example.com/demo.mp4" } }],
    };
    expect(configSchema.safeParse(http).success).toBe(false);

    const js = {
      ...config,
      items: [{ ...config.items[0], media: { ...config.items[0].media, src: "javascript:alert(1)" } }],
    };
    expect(configSchema.safeParse(js).success).toBe(false);
  });

  it("requires alt text for image media", () => {
    const noAlt = {
      ...config,
      items: [{ ...config.items[0], media: { kind: "image", src: "https://cdn.example.com/x.jpg" } }],
    };
    expect(configSchema.safeParse(noAlt).success).toBe(false);
  });
});
