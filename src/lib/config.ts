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

export const mediaSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("video"),
    src: httpsUrl,
    poster: httpsUrl,
  }),
  z.object({
    kind: z.literal("image"),
    src: httpsUrl,
    alt: z.string().optional(),
  }),
]);

export const itemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  media: mediaSchema,
  tags: z.array(z.string()).default([]),
});

export const configSchema = z.object({
  meta: z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    canonicalUrl: httpsUrl.optional(),
    ogImage: httpsUrl.optional(),
  }),
  contact: z.object({
    email: z.string().email("Invalid email"),
    label: z.string().default("Contact"),
  }),
  templateId: z.enum(["minimal", "editorial"]),
  items: z.array(itemSchema).min(1, "Add at least one item"),
});

export type Media = z.infer<typeof mediaSchema>;
export type Item = z.infer<typeof itemSchema>;
export type Config = z.infer<typeof configSchema>;
