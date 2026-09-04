import type { ReactNode } from "react";
import type { Config, Item } from "./config";

export function Grid({ children }: { children: ReactNode }) {
  return <div className="pf-grid">{children}</div>;
}

export function ProjectCard({ item }: { item: Item }) {
  return (
    <article className="pf-card" data-tags={item.tags.join(",")}>
      {item.media.kind === "video" ? (
        <video
          className="pf-media"
          title={item.title}
          poster={item.media.poster}
          muted
          playsInline
          controls
          preload="none"
          data-src={item.media.src}
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
