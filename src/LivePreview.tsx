import { StrictMode, useEffect, useRef } from "react";
import { createRoot, type Root } from "react-dom/client";
import type { Config } from "@/lib/config";
import { templates } from "@/lib/templates";

// Live preview rendered directly with React inside a shadow root. The shadow
// isolates the template's CSS from the authoring UI, and React reconciliation
// keeps media elements alive across unrelated edits — so typing does not
// re-fetch your media (unlike an iframe that reloads on every keystroke).
export function LivePreview({ config }: { config: Config }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<Root | null>(null);

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

  return (
    <div
      ref={hostRef}
      aria-label="Live preview"
      className="h-full w-full overflow-auto bg-white"
    />
  );
}
