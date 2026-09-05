import { StrictMode, useEffect, useRef } from "react";
import { createRoot, type Root } from "react-dom/client";
import type { Config } from "@/lib/config";
import { templates } from "@/lib/templates";
import { VIDEO_FACADE_CSS } from "@/lib/components";

// Live preview rendered directly with React inside a shadow root. The shadow
// isolates the template's CSS from the authoring UI, and React reconciliation
// keeps media elements alive across unrelated edits — so typing does not
// re-fetch your media (unlike an iframe that reloads on every keystroke).
// Video click-to-play works via the same VideoFacade state as the artifact,
// and the tag filter below mirrors FILTER_SCRIPT so preview matches the
// built page instead of appearing dead on click.
export function LivePreview({ config }: { config: Config }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<Root | null>(null);
  const selectedRef = useRef<Record<string, true>>({});

  useEffect(() => {
    const host = hostRef.current;
    if (!host || rootRef.current) return;
    const shadow = host.attachShadow({ mode: "open" });
    rootRef.current = createRoot(shadow);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const template = templates[config.templateId];
    root.render(
      <StrictMode>
        <style>{template.css}</style>
        <style>{VIDEO_FACADE_CSS}</style>
        <div className="pf-page">
          {template.render({
            meta: config.meta,
            items: config.items,
            contact: config.contact,
          })}
        </div>
      </StrictMode>,
    );
  }, [config]);

  // Tag filter for the preview: same toggle/AND semantics as FILTER_SCRIPT in
  // the shipped artifact. Delegated on the shadow root so it survives React
  // re-renders; selection is re-applied after each render.
  useEffect(() => {
    const host = hostRef.current;
    const shadow = host?.shadowRoot;
    if (!shadow) return;

    const applyFilter = () => {
      const keys = Object.keys(selectedRef.current);
      shadow.querySelectorAll("[data-tag]").forEach((el) => {
        const tag = el.getAttribute("data-tag") ?? "";
        el.classList.toggle("active", Boolean(selectedRef.current[tag]));
      });
      shadow.querySelectorAll("[data-tags]").forEach((el) => {
        const tags = (el.getAttribute("data-tags") || "").split(",");
        const match =
          keys.length === 0 || keys.every((k) => tags.indexOf(k) !== -1);
        (el as HTMLElement).style.display = match ? "" : "none";
      });
    };

    const onClick = (e: Event) => {
      const btn = (e.target as HTMLElement).closest?.("[data-tag]");
      if (!btn || !shadow.contains(btn)) return;
      const tag = btn.getAttribute("data-tag") ?? "";
      if (!tag) return;
      if (selectedRef.current[tag]) {
        delete selectedRef.current[tag];
      } else {
        selectedRef.current[tag] = true;
      }
      applyFilter();
    };

    // Drop selections for tags that no longer exist so a removed tag can't
    // leave every card hidden after an edit.
    const available = new Set(config.items.flatMap((item) => item.tags));
    for (const key of Object.keys(selectedRef.current)) {
      if (!available.has(key)) delete selectedRef.current[key];
    }
    applyFilter();
    shadow.addEventListener("click", onClick);
    return () => {
      shadow.removeEventListener("click", onClick);
    };
  }, [config]);

  return (
    <div
      ref={hostRef}
      aria-label="Live preview"
      className="h-full w-full overflow-auto bg-white"
    />
  );
}
