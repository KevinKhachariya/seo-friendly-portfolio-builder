import { renderToStaticMarkup } from "react-dom/server";
import type { Config } from "./config";
import { templates } from "./templates";
import { SeoHead } from "./head";
import { VIDEO_FACADE_CSS } from "./components";
import { LAZY_MEDIA_SCRIPT } from "./lazy";
import { FILTER_SCRIPT } from "./filter";
import { normalizeHtml } from "./normalize";

// Pure function: Config -> complete static HTML string.
// Used by the UI (in-browser) and the CLI (Node) — same output both ways.
export function build(config: Config): string {
  const template = templates[config.templateId];

  const html = renderToStaticMarkup(
    <html lang={config.meta.lang}>
      <head>
        <SeoHead config={config} />
        <style>{template.css}</style>
        <style>{VIDEO_FACADE_CSS}</style>
      </head>
      <body className="pf-page">
        {template.render({ meta: config.meta, items: config.items, contact: config.contact })}
        <script>{LAZY_MEDIA_SCRIPT}</script>
        <script>{FILTER_SCRIPT}</script>
      </body>
    </html>,
  );

  return normalizeHtml(`<!doctype html>${html}`);
}
