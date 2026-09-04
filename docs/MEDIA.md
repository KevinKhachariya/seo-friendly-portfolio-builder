# Media input standard

The builder **never downloads, processes, or re-hosts your media.** You produce it with
whatever tools you like, host it anywhere, and paste an **HTTPS URL** into
`portfolio.config.json` (or the UI). The builder only embeds that URL and makes it load lazily.

## What you provide (per demo item)

| Field | Required | Meaning |
|---|---|---|
| `src` | ✅ | The demo itself. **MP4** (universal) or **WebM** (smaller on modern browsers). |
| `poster` | recommended | A still image (WebP/JPEG/PNG) shown instantly before the video plays — this is what makes first paint feel instant. |
| `alt` | optional | Text description for images (accessibility + SEO). |

For a **static image** demo, provide `src` (the image URL) + optional `alt` instead of a video.

## Audio — one rule you can't change

Videos do **not autoplay** and start **muted**. The poster shows instantly; the visitor clicks
**play** to watch (muted), and the **speaker icon** to hear audio if the demo has any. No flag,
no config — it just works.

## The only thing the builder enforces: a safe URL

- URLs must be **`https://`**.
- Rejected at build time: `http://`, `javascript:`, `data:`, `file:`, and URLs containing
  embedded credentials (`user:pass@`).
- The builder does not fetch the URL, so it cannot verify the file is actually a video —
  it only guarantees the URL is a safe, well-formed HTTPS link.

## How the builder makes it load instantly

1. **Images** → `<img loading="lazy">` (browser-native, zero JS).
2. **Videos** → `<video muted playsinline controls preload="none" data-src="…">` plus a
   **~10-line inline script** (IntersectionObserver) that sets `src` only when the video is about
   to enter the viewport. No autoplay; the poster paints instantly and the visitor clicks play
   (starts muted — click the speaker icon to hear audio if the file has any).

This is the **only JavaScript** in the entire output.

## Optional: free tools if you want copy-paste commands

The builder is tool-agnostic, but if you want a quick, free way to produce
MP4 + WebM + poster, these are the common ones:

| Tool | Type | Use when |
|---|---|---|
| **ffmpeg** | CLI, free | you're comfortable pasting commands |
| **HandBrake** | GUI, free | visual, no terminal |
| **Shutter Encoder** | GUI, free | visual, more codec control |
| **Squoosh** | Browser, free | compressing the poster to WebP/AVIF |
| **ezgif** | Browser, free | one-off GIF → MP4/WebP |

Reference commands — `ffmpeg`:

```bash
# MP4 — with audio (H.264 + AAC)
ffmpeg -i input.mp4 -vf "fps=30,scale=1280:-2" -c:v libx264 -crf 23 -preset slow -c:a aac -b:a 128k -movflags +faststart -pix_fmt yuv420p demo.mp4

# WebM — with audio (VP9 + Opus)
ffmpeg -i input.mp4 -vf "fps=30,scale=1280:-2" -c:v libvpx-vp9 -crf 32 -b:v 0 -c:a libopus -b:a 96k demo.webm

# MP4 — no audio (drop the -c:a flag, add -an)
ffmpeg -i input.mp4 -vf "fps=30,scale=1280:-2" -an -c:v libx264 -crf 23 -preset slow -movflags +faststart -pix_fmt yuv420p demo.mp4

# GIF -> MP4 (GIFs have no audio)
ffmpeg -i input.gif -vf "fps=30,scale=trunc(iw/2)*2:trunc(ih/2)*2" -an -c:v libx264 -crf 23 -pix_fmt yuv420p -movflags +faststart demo.mp4

# Poster (first frame, then compress in Squoosh -> WebP)
ffmpeg -i demo.mp4 -frames:v 1 -vf "scale=1280:-2" -q:v 4 poster.jpg
```

> **OBS:** to capture audio, enable **Desktop Audio** (and/or **Mic**) in OBS before recording.
> The commands above keep it — AAC for MP4, Opus for WebM.

## Optional: where to host

Any HTTPS static host works. Common free options:

- **Cloudflare R2** — free 10 GB, pairs with the CDN (recommended for video).
- **Cloudflare Pages** — free, but 25 MiB per-file limit.
- Any S3-compatible bucket, GitHub Releases, or CDN you already use.

The builder does not care where the URL points, as long as it's `https://`.
