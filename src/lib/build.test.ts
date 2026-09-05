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
    expect(html).toContain("playsinline");
    expect(html).toContain("charset=");
    expect(html).not.toMatch(/autoPlay=|playsInline=|charSet=/);
    // click-to-play loader present: video URL stays in data-src until click
    expect(html).toContain("pf-video");
    expect(html).toContain("data-src=");
    expect(html).toContain('addEventListener("click"');
    expect(html).not.toContain("IntersectionObserver");
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

  it("renders a poster + play-button facade, fetching video only on click", () => {
    const html = build(configSchema.parse(config));
    // facade: poster img + explicit play button, no <video> bytes upfront
    expect(html).toContain("pf-play");
    expect(html).toContain('aria-label="Play Dashboard"');
    expect(html).toContain("https://cdn.example.com/poster.webp");
    expect(html).toContain('data-src="https://cdn.example.com/demo.mp4"');
    expect(html).not.toContain("<video");
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

  it("accepts a locally embedded .ico favicon (data URL)", () => {
    const withIcon = {
      ...config,
      meta: { ...config.meta, favicon: "data:image/x-icon;base64,AAABAAEAAAAAAAEAAAABAAgAgAIAAA==" },
    };
    const parsed = configSchema.safeParse(withIcon);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      const html = build(parsed.data);
      expect(html).toContain('rel="icon"');
      expect(html).toContain("data:image/x-icon;base64");
    }
  });
});
