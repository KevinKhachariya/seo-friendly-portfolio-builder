import { z } from "zod";

export const httpsUrl = z
  .string()
  .url("Must be a valid URL")
  .refine((u) => {
    try {
      const p = new URL(u);
      return p.protocol === "https:" && !p.username && !p.password;
    } catch {
      return false;
    }
  }, "Must be a clean https:// URL");

// Favicon is best kept local: accept a hosted https URL OR an inline data:image
// URL (the icon picker produces data URLs for .ico/.png/.svg).
const faviconUrl = z.string().refine((u) => {
  try {
    const p = new URL(u);
    if (p.protocol === "https:") return !p.username && !p.password;
    return p.protocol === "data:" && p.pathname.startsWith("image/");
  } catch {
    return false;
  }
}, "Favicon must be an https:// URL or a data:image URL");

export const mediaSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("video"),
    src: httpsUrl,
    poster: httpsUrl,
  }),
  z.object({
    kind: z.literal("image"),
    src: httpsUrl,
    alt: z.string().min(1, "Alt text is required for images"),
  }),
]);

export const itemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  media: mediaSchema,
  tags: z.array(z.string()).default([]),
  link: httpsUrl.optional(),
});

export const configSchema = z.object({
  meta: z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    lang: z.string().default("en"),
    canonicalUrl: httpsUrl.optional(),
    ogImage: httpsUrl.optional(),
    favicon: faviconUrl.optional(),
    github: httpsUrl.optional(),
    x: httpsUrl.optional(),
    linkedin: httpsUrl.optional(),
  }),
  contact: z.object({
    email: z.string().email("Invalid email"),
    label: z.string().default("Contact"),
  }),
  templateId: z.enum(["minimal", "editorial", "cartoony"]),
  items: z.array(itemSchema).min(1, "Add at least one item"),
});

export type Media = z.infer<typeof mediaSchema>;
export type Item = z.infer<typeof itemSchema>;
export type Config = z.infer<typeof configSchema>;
