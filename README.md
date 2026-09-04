# seo-friendly-portfolio-builder

**Live production portfolio made using this tool → [kevinkhachariya.qzz.io](https://kevinkhachariya.qzz.io)**

A zero-friction, SEO-ready portfolio builder. Author your portfolio in a UI, then download a
single static `index.html` ready to drop into Cloudflare Pages (or any static host).

## How it works

- **Authoring UI** — `npm run dev`. Forms for SEO meta, contact email, a template picker, and
  portfolio items (add/remove/reorder). The live preview is the *actual artifact*, rendered in
  an iframe.
- **Artifact** — one static HTML file: fixed SEO head + swappable body template + lazy-loaded
  media. Zero framework JS (only a ~10-line lazy loader).
- **CLI** — `npm run gen` builds `dist/index.html` headlessly from `portfolio.config.json`.

## Quick start

```bash
npm install
npm run dev         # open the authoring UI
npm run gen         # build dist/index.html from portfolio.config.json
npm run typecheck   # tsc --noEmit
```

## Media

The builder only accepts `https://` URLs. It never downloads or re-hosts media. See
`docs/MEDIA.md` for the pre-processing guidance (free tools, near-instant loads).

## Structure

- `src/lib/` — the shared core: schema, components, templates, head, build, normalize
- `src/App.tsx` — the authoring UI
- `src/components/ui/` — shadcn components (added as-you-go)
- `src/cli.ts` — headless build
- `docs/MEDIA.md` — the media input standard
