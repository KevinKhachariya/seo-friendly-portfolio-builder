import { useMemo, useRef, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { build } from "@/lib/build";
import { configSchema, type Config } from "@/lib/config";
import { LivePreview } from "./LivePreview";

type DraftVideo = { kind: "video"; src: string; poster: string };
type DraftImage = { kind: "image"; src: string; alt: string };
type DraftMedia = DraftVideo | DraftImage;
type DraftItem = {
  id: string;
  title: string;
  description: string;
  media: DraftMedia;
  tags: string;
  link: string;
};
type Draft = {
  meta: { title: string; description: string; canonicalUrl: string; ogImage: string; lang: string; favicon: string; github: string; x: string; linkedin: string };
  contact: { email: string; label: string };
  templateId: "minimal" | "editorial" | "cartoony";
  items: DraftItem[];
};

const sample: Draft = {
  meta: {
    title: "Jane Doe Product Designer",
    description: "Selected work in product design and rapid prototyping.",
    canonicalUrl: "https://jane.design",
    ogImage: "https://placehold.co/1200x630/png",
    lang: "en",
    favicon: "",
    github: "",
    x: "",
    linkedin: "",
  },
  contact: { email: "hello@jane.design", label: "Get in touch" },
  templateId: "minimal",
  items: [
    {
      id: "item-1",
      title: "Fintech Dashboard",
      description: "Real-time analytics dashboard for a fintech client.",
      media: {
        kind: "video",
        src: "https://example.com/demo.mp4",
        poster: "https://placehold.co/1280x720/png",
      },
      tags: "design, fintech, react",
      link: "",
    },
  ],
};

function toConfig(d: Draft): { ok: true; config: Config } | { ok: false; error: string } {
  const raw = {
    meta: {
      title: d.meta.title,
      description: d.meta.description,
      lang: d.meta.lang || "en",
      ...(d.meta.canonicalUrl ? { canonicalUrl: d.meta.canonicalUrl } : {}),
      ...(d.meta.ogImage ? { ogImage: d.meta.ogImage } : {}),
      ...(d.meta.favicon ? { favicon: d.meta.favicon } : {}),
      ...(d.meta.github ? { github: d.meta.github } : {}),
      ...(d.meta.x ? { x: d.meta.x } : {}),
      ...(d.meta.linkedin ? { linkedin: d.meta.linkedin } : {}),
    },
    contact: { email: d.contact.email, label: d.contact.label || "Contact" },
    templateId: d.templateId,
    items: d.items.map((it) => ({
      id: it.id,
      title: it.title,
      description: it.description,
      media: it.media,
      tags: it.tags.split(",").map((s) => s.trim()).filter(Boolean),
      ...(it.link ? { link: it.link } : {}),
    })),
  };
  const parsed = configSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues
        .map((i) => `${i.path.join(".") || "root"}: ${i.message}`)
        .join(" · "),
    };
  }
  return { ok: true, config: parsed.data };
}

function configToDraft(c: Config): Draft {
  return {
    meta: {
      title: c.meta.title,
      description: c.meta.description,
      canonicalUrl: c.meta.canonicalUrl ?? "",
      ogImage: c.meta.ogImage ?? "",
      lang: c.meta.lang,
      favicon: c.meta.favicon ?? "",
      github: c.meta.github ?? "",
      x: c.meta.x ?? "",
      linkedin: c.meta.linkedin ?? "",
    },
    contact: { email: c.contact.email, label: c.contact.label },
    templateId: c.templateId,
    items: c.items.map((it) => ({
      id: it.id,
      title: it.title,
      description: it.description,
      media:
        it.media.kind === "video"
          ? { kind: "video", src: it.media.src, poster: it.media.poster }
          : { kind: "image", src: it.media.src, alt: it.media.alt ?? "" },
      tags: it.tags.join(", "),
      link: it.link ?? "",
    })),
  };
}

export default function App() {
  const [draft, setDraft] = useState<Draft>(sample);
  const fileRef = useRef<HTMLInputElement>(null);
  const iconRef = useRef<HTMLInputElement>(null);

  const result = useMemo(() => toConfig(draft), [draft]);
  const error = result.ok ? null : result.error;

  const setMeta = <K extends keyof Draft["meta"]>(k: K, v: Draft["meta"][K]) =>
    setDraft((d) => ({ ...d, meta: { ...d.meta, [k]: v } }));
  const setContact = <K extends keyof Draft["contact"]>(k: K, v: Draft["contact"][K]) =>
    setDraft((d) => ({ ...d, contact: { ...d.contact, [k]: v } }));

  const addItem = () =>
    setDraft((d) => ({
      ...d,
      items: [
        ...d.items,
        {
          id: crypto.randomUUID(),
          title: "",
          description: "",
          media: { kind: "video", src: "", poster: "" },
          tags: "",
          link: "",
        },
      ],
    }));

  const patchItem = (id: string, patch: Partial<DraftItem>) =>
    setDraft((d) => ({
      ...d,
      items: d.items.map((it) => (it.id === id ? { ...it, ...patch } : it)),
    }));

  const removeItem = (id: string) =>
    setDraft((d) => ({ ...d, items: d.items.filter((it) => it.id !== id) }));

  const download = (name: string, content: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportConfig = () => {
    if (result.ok) {
      download("portfolio.config.json", JSON.stringify(result.config, null, 2), "application/json");
    }
  };

  const importConfig = (file: File) => {
    file.text().then((txt) => {
      try {
        const parsed = configSchema.parse(JSON.parse(txt));
        setDraft(configToDraft(parsed));
      } catch (e) {
        alert(`Invalid config: ${e instanceof Error ? e.message : String(e)}`);
      }
    });
  };

  const uploadIcon = (file: File) => {
    if (file.size > 1_000_000) {
      alert("Favicon too large — keep it under 1 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setMeta("favicon", String(reader.result));
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b bg-background px-6 py-3">
        <h1 className="text-base font-semibold tracking-tight">Portfolio Builder</h1>
        <div className="flex items-center gap-2">
          <input
            ref={fileRef}
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) importConfig(f);
              e.target.value = "";
            }}
          />
          <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
            Import
          </Button>
          <Button variant="outline" size="sm" onClick={exportConfig}>
            Export config
          </Button>
          <Button
            size="sm"
            onClick={() =>
              result.ok && download("index.html", build(result.config), "text/html")
            }
            disabled={!result.ok}
          >
            Download index.html
          </Button>
        </div>
      </header>

      <main className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-2">
        {/* Form */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Template</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={draft.templateId}
                onValueChange={(v) =>
                  setDraft((d) => ({ ...d, templateId: v as Draft["templateId"] }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minimal">Minimal</SelectItem>
                  <SelectItem value="editorial">Editorial</SelectItem>
                  <SelectItem value="cartoony">Cartoony</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="meta-title">Title</Label>
                <Input
                  id="meta-title"
                  value={draft.meta.title}
                  onChange={(e) => setMeta("title", e.target.value)}
                  placeholder="Jane Doe Product Designer"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="meta-desc">Description</Label>
                <Textarea
                  id="meta-desc"
                  value={draft.meta.description}
                  onChange={(e) => setMeta("description", e.target.value)}
                  placeholder="Short description used in search results."
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="meta-canonical">Canonical URL (optional)</Label>
                  <Input
                    id="meta-canonical"
                    value={draft.meta.canonicalUrl}
                    onChange={(e) => setMeta("canonicalUrl", e.target.value)}
                    placeholder="https://…"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="meta-og">OG image URL (optional)</Label>
                  <Input
                    id="meta-og"
                    value={draft.meta.ogImage}
                    onChange={(e) => setMeta("ogImage", e.target.value)}
                    placeholder="https://…"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="meta-lang">Language</Label>
                  <Input
                    id="meta-lang"
                    value={draft.meta.lang}
                    onChange={(e) => setMeta("lang", e.target.value)}
                    placeholder="en"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Favicon (.ico / .png / .svg)</Label>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => iconRef.current?.click()}
                    >
                      Choose icon file
                    </Button>
                    {draft.meta.favicon ? (
                      <img
                        src={draft.meta.favicon}
                        alt=""
                        className="h-6 w-6 rounded object-contain"
                      />
                    ) : (
                      <span className="text-xs text-muted-foreground">none</span>
                    )}
                  </div>
                  <input
                    ref={iconRef}
                    type="file"
                    accept=".ico,image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) uploadIcon(f);
                      e.target.value = "";
                    }}
                  />
                  <p className="text-xs text-muted-foreground">
                    Stored inline (data URL) in the page — no hosting needed.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <Label htmlFor="meta-github">GitHub URL (optional)</Label>
                  <Input
                    id="meta-github"
                    value={draft.meta.github}
                    onChange={(e) => setMeta("github", e.target.value)}
                    placeholder="https://github.com/…"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="meta-x">X URL (optional)</Label>
                  <Input
                    id="meta-x"
                    value={draft.meta.x}
                    onChange={(e) => setMeta("x", e.target.value)}
                    placeholder="https://x.com/…"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="meta-linkedin">LinkedIn URL (optional)</Label>
                  <Input
                    id="meta-linkedin"
                    value={draft.meta.linkedin}
                    onChange={(e) => setMeta("linkedin", e.target.value)}
                    placeholder="https://linkedin.com/in/…"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="contact-email">Email</Label>
                <Input
                  id="contact-email"
                  value={draft.contact.email}
                  onChange={(e) => setContact("email", e.target.value)}
                  placeholder="hello@example.com"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="contact-label">Button label</Label>
                <Input
                  id="contact-label"
                  value={draft.contact.label}
                  onChange={(e) => setContact("label", e.target.value)}
                  placeholder="Get in touch"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Portfolio items ({draft.items.length})</h2>
            <Button variant="outline" size="sm" onClick={addItem}>
              <Plus className="h-4 w-4" /> Add item
            </Button>
          </div>

          {draft.items.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle className="text-sm">Item</CardTitle>
                <CardAction>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(item.id)}
                    aria-label="Delete item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardAction>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>Title</Label>
                    <Input
                      value={item.title}
                      onChange={(e) => patchItem(item.id, { title: e.target.value })}
                      placeholder="Project title"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Tags (comma separated)</Label>
                    <Input
                      value={item.tags}
                      onChange={(e) => patchItem(item.id, { tags: e.target.value })}
                      placeholder="design, react"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Description</Label>
                  <Textarea
                    value={item.description}
                    onChange={(e) => patchItem(item.id, { description: e.target.value })}
                    placeholder="What is it, what did you do?"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Project link (optional)</Label>
                  <Input
                    value={item.link}
                    onChange={(e) => patchItem(item.id, { link: e.target.value })}
                    placeholder="https://…/live-demo"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Media type</Label>
                  <Select
                    value={item.media.kind}
                    onValueChange={(v) => {
                      if (v === "video") {
                        patchItem(item.id, { media: { kind: "video", src: item.media.src, poster: "" } });
                      } else {
                        patchItem(item.id, { media: { kind: "image", src: item.media.src, alt: "" } });
                      }
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="video">Video (mp4/webm + poster)</SelectItem>
                      <SelectItem value="image">Image</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Media URL (https)</Label>
                  <Input
                    value={item.media.src}
                    onChange={(e) =>
                      patchItem(item.id, {
                        media:
                          item.media.kind === "video"
                            ? { kind: "video", src: e.target.value, poster: item.media.poster }
                            : { kind: "image", src: e.target.value, alt: item.media.alt ?? "" },
                      })
                    }
                    placeholder="https://…/demo.mp4"
                  />
                </div>
                {item.media.kind === "video" ? (
                  <div className="space-y-1.5">
                    <Label>Poster URL (https)</Label>
                    <Input
                      value={item.media.poster}
                      onChange={(e) =>
                        patchItem(item.id, { media: { kind: "video", src: item.media.src, poster: e.target.value } })
                      }
                      placeholder="https://…/poster.webp"
                    />
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <Label>Alt text</Label>
                    <Input
                      value={item.media.alt}
                      onChange={(e) =>
                        patchItem(item.id, { media: { kind: "image", src: item.media.src, alt: e.target.value } })
                      }
                      placeholder="Describe the image"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Preview */}
        <div className="h-[80vh] lg:sticky lg:top-16 lg:h-[calc(100vh-6rem)]">
          <div className="h-full overflow-hidden rounded-xl border bg-background shadow-sm">
            {result.ok ? (
              <LivePreview config={result.config} />
            ) : (
              <div className="flex h-full items-center justify-center p-8 text-center">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
