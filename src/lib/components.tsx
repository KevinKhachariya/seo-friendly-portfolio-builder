import type { ReactNode } from "react";
import type { Config, Item } from "./config";

export function Grid({ children }: { children: ReactNode }) {
  return <div className="pf-grid">{children}</div>;
}

export function ProjectCard({ item }: { item: Item }) {
  return (
    <article className="pf-card">
      {item.media.kind === "video" ? (
        <video
          className="pf-media"
          poster={item.media.poster}
          muted
          loop
          autoPlay
          playsInline
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
    </article>
  );
}

export function Contact({ contact }: { contact: Config["contact"] }) {
  return (
    <a className="pf-contact" href={`mailto:${contact.email}`}>
      {contact.label}
    </a>
  );
}
