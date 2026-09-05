import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Config, Item } from "./config";

// Shared click-to-play facade styling. Injected alongside each template's css
// (see build.tsx / LivePreview.tsx) so the play button looks the same in all
// templates while inheriting each template's .pf-media sizing.
export const VIDEO_FACADE_CSS = `
  .pf-video { position: relative; overflow: hidden; padding: 0; cursor: pointer; }
  .pf-video img { width: 100%; height: 100%; object-fit: cover; display: block; border: 0; }
  .pf-play {
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 68px; height: 68px; border-radius: 999px; border: 0;
    background: rgba(0, 0, 0, 0.65); color: #fff;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: transform .15s ease, background .15s ease;
  }
  .pf-video:hover .pf-play, .pf-play:focus-visible {
    background: rgba(0, 0, 0, 0.85);
    transform: translate(-50%, -50%) scale(1.06);
    outline: 2px solid #fff; outline-offset: 2px;
  }
  .pf-play svg { width: 28px; height: 28px; fill: currentColor; margin-left: 2px; }
`;

export function Grid({ children }: { children: ReactNode }) {
  return <div className="pf-grid">{children}</div>;
}

// Poster + play-button facade. No video bytes load until click: the real URL
// lives only in data-src. In LivePreview (React) the click flips local state;
// in the static artifact the vanilla script in lazy.ts swaps in the <video>.
function VideoFacade({ title, src, poster }: { title: string; src: string; poster: string }) {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Same as the static artifact's script: the click is a user gesture, so
  // explicitly start playback instead of relying on the autoplay attribute.
  useEffect(() => {
    if (playing) {
      videoRef.current?.play()?.catch(() => {});
    }
  }, [playing]);

  if (playing) {
    return (
      <video
        ref={videoRef}
        className="pf-media"
        title={title}
        src={src}
        poster={poster}
        controls
        playsInline
        autoPlay
        preload="metadata"
      />
    );
  }

  const play = () => setPlaying(true);

  return (
    <div
      className="pf-media pf-video"
      data-src={src}
      data-title={title}
      onClick={play}
    >
      <img src={poster} alt="" loading="lazy" />
      <button
        type="button"
        className="pf-play"
        aria-label={`Play ${title}`}
        onClick={(e) => {
          e.stopPropagation();
          play();
        }}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8 5v14l11-7z" />
        </svg>
      </button>
    </div>
  );
}

export function ProjectCard({ item }: { item: Item }) {
  return (
    <article className="pf-card" data-tags={item.tags.join(",")}>
      {item.media.kind === "video" ? (
        <VideoFacade
          title={item.title}
          src={item.media.src}
          poster={item.media.poster}
        />
      ) : (
        <img
          className="pf-media"
          src={item.media.src}
          alt={item.media.alt ?? ""}
          loading="lazy"
        />
      )}
      <h2 className="pf-title">{item.title}</h2>
      <p className="pf-desc">{item.description}</p>
      {item.tags.length > 0 && (
        <ul className="pf-tags">
          {item.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      )}
      {item.link ? (
        <a className="pf-link" href={item.link} target="_blank" rel="noopener noreferrer">
          View project ↗
        </a>
      ) : null}
    </article>
  );
}

export function TagFilter({ items }: { items: Item[] }) {
  const tags = [...new Set(items.flatMap((item) => item.tags))];
  if (tags.length === 0) return null;
  return (
    <div className="pf-filter" role="group" aria-label="Filter by tag">
      <span className="pf-filter-label">Filter by tag:</span>
      {tags.map((tag) => (
        <button key={tag} type="button" className="pf-filter-btn" data-tag={tag}>
          {tag}
        </button>
      ))}
    </div>
  );
}

export function SocialLinks({ meta }: { meta: Config["meta"] }) {
  const links = [
    meta.github ? { href: meta.github, label: "GitHub" } : null,
    meta.x ? { href: meta.x, label: "X" } : null,
    meta.linkedin ? { href: meta.linkedin, label: "LinkedIn" } : null,
  ].filter((l): l is { href: string; label: string } => l !== null);

  if (links.length === 0) return null;
  return (
    <nav className="pf-social" aria-label="Social profiles">
      {links.map((link) => (
        <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">
          {link.label}
        </a>
      ))}
    </nav>
  );
}

export function Contact({ contact }: { contact: Config["contact"] }) {
  return (
    <a className="pf-contact" href={`mailto:${contact.email}`}>
      {contact.label}
    </a>
  );
}
