# Media Standard — near-instant demo load times

This is the **only** accepted way to put a demo video in a portfolio built with this tool.
It is a guidance document: the builder **never touches your media**. You pre-process with
**free tools**, then paste the resulting URLs into `portfolio.config.json`.

## The rule

- **GIF is never served.** A GIF can be 10× larger than the same demo as MP4/WebM.
- Every demo ships **exactly three files**: an MP4, a WebM, and a poster image.
- The builder emits the optimal HTML so the page stays near-instant.

## The three files

| File | Format | Purpose |
|---|---|---|
| `demo.mp4` | H.264, **no audio**, `+faststart`, 16:9 | universal hardware decode |
| `demo.webm` | VP9, **no audio**, 16:9 | ~30–50% smaller, served to modern browsers |
| `poster.webp` | WebP/AVIF still frame, 16:9, ≤ 50 KB | instant first paint while video lazy-loads |

## Free tools (all of them)

| Tool | Type | Use when |
|---|---|---|
| **ffmpeg** | CLI, free | you're comfortable pasting commands (fastest) |
| **HandBrake** | GUI, free | you want a visual tool, no terminal |
| **Shutter Encoder** | GUI, free | visual tool with more codec control |
| **Squoosh** | Browser, free | compressing the poster to WebP/AVIF |
| **ezgif** | Browser, free | one-off GIF → MP4/WebP conversions |

## Exact commands (copy-paste)

### Any video / screen recording → MP4

```bash
ffmpeg -i input.mp4 -vf "fps=30,scale=1280:-2" -an -c:v libx264 -crf 23 -preset slow -movflags +faststart -pix_fmt yuv420p demo.mp4
```

### → WebM (VP9)

```bash
ffmpeg -i input.mp4 -vf "fps=30,scale=1280:-2" -an -c:v libvpx-vp9 -crf 32 -b:v 0 demo.webm
```

### GIF → MP4

```bash
ffmpeg -i input.gif -vf "fps=30,scale=trunc(iw/2)*2:trunc(ih/2)*2" -an -c:v libx264 -crf 23 -pix_fmt yuv420p -movflags +faststart demo.mp4
```

### Poster (first frame → then Squoosh)

```bash
ffmpeg -i demo.mp4 -frames:v 1 -vf "scale=1280:-2" -q:v 4 poster.jpg
```

Open `poster.jpg` in [Squoosh](https://squoosh.app) → export **WebP (quality 70)** or
**AVIF (quality 50)**. Target ≤ 50 KB.

## Upload (Cloudflare free tier)

1. Put the three files in **R2** (free 10 GB) or as **Pages assets**.
2. Enable **Image Resizing** so posters are auto-served as AVIF/WebP per browser.
3. Serve everything through Cloudflare's CDN with **immutable cache** headers.

## What the builder emits

```html
<video poster="poster.webp" muted loop autoplay playsinline preload="none"
       data-src="demo.mp4" data-src-webm="demo.webm" fetchpriority="low"></video>
```

…plus **one ~10-line inline script** (IntersectionObserver) that sets `src` when the video
is ~200 px from entering the viewport. This is the **only JavaScript** in the entire output,
and it is the single reason the page stays near-instant.

## Hard budgets (never exceeded)

| Thing | Limit |
|---|---|
| Full page HTML + CSS (inline) | < 20 KB |
| Poster | ≤ 50 KB |
| Demo video (MP4 + WebM combined) | ≤ 5 MB |
| JavaScript | only the 10-line lazy loader |

## Why this is near-instant

1. Tiny HTML → first paint in one round trip.
2. Poster (≤ 50 KB) paints instantly.
3. Video downloads only when scrolled near (IntersectionObserver + `preload="none"`).
4. Cloudflare serves immutable, cached files from the nearest edge.
5. Two codecs → the smallest file each browser can decode.
