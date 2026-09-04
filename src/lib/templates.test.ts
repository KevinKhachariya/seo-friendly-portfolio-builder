import { describe, expect, it } from "vitest";
import { build } from "./build";
import { configSchema, type Config } from "./config";
import { templates } from "./templates";

const base = {
  meta: { title: "T", description: "D" },
  contact: { email: "a@b.com" },
  templateId: "minimal",
  items: [
    {
      id: "1",
      title: "Item",
      description: "Desc",
      media: { kind: "video", src: "https://c.com/v.mp4", poster: "https://c.com/p.jpg" },
      tags: ["design"],
    },
  ],
};

// Derived from the schema — not hardcoded — so a new template added to the enum
// is covered automatically.
const templateIds = configSchema.shape.templateId.options as ReadonlyArray<
  Config["templateId"]
>;

describe("swappable template contract", () => {
  it("has a template registered for every templateId", () => {
    for (const id of templateIds) {
      expect(templates[id], `missing template "${id}"`).toBeDefined();
    }
  });

  it("every registered template is valid and matches its key", () => {
    for (const [key, tpl] of Object.entries(templates)) {
      expect(tpl.id, `registry key "${key}" must match template id`).toBe(key);
      expect(tpl.name.trim().length, `"${key}" needs a name`).toBeGreaterThan(0);
      expect(tpl.css.trim().length, `"${key}" needs css`).toBeGreaterThan(0);
      expect(typeof tpl.render, `"${key}" needs a render function`).toBe("function");
    }
  });

  it("every template renders the finite component set and injects its own css", () => {
    for (const [key, tpl] of Object.entries(templates)) {
      const html = build(configSchema.parse({ ...base, templateId: key }));
      expect(html).toContain("pf-grid");
      expect(html).toContain("pf-card");
      expect(html).toContain("mailto:");
      expect(html).toContain(tpl.css.trim());
    }
  });

  it("swapping templateId changes the output", () => {
    const ids = Object.keys(templates) as Config["templateId"][];
    const a = build(configSchema.parse({ ...base, templateId: ids[0] }));
    const b = build(configSchema.parse({ ...base, templateId: ids[1] }));
    expect(a).not.toBe(b);
  });
});
