import type { ReactElement } from "react";
import { Contact, Grid, ProjectCard } from "./components";
import type { Config, Item } from "./config";

type Ctx = { meta: Config["meta"]; items: Item[]; contact: Config["contact"] };

export type Template = {
  id: Config["templateId"];
  name: string;
  css: string;
  render: (ctx: Ctx) => ReactElement;
};

const minimal: Template = {
  id: "minimal",
  name: "Minimal",
  css: `
    :root { color-scheme: light; }
    * { box-sizing: border-box; margin: 0; }
    body { font-family: ui-sans-serif, system-ui, -apple-system, sans-serif; background: #fff; color: #171717; line-height: 1.6; }
    main { max-width: 1120px; margin: 0 auto; padding: 3rem 1.5rem; }
    header { margin-bottom: 3rem; }
    h1 { font-size: 2.25rem; letter-spacing: -0.03em; margin: 0 0 .5rem; }
    header p { color: #525252; font-size: 1.05rem; max-width: 56ch; }
    .pf-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 2rem; }
    .pf-card { display: flex; flex-direction: column; gap: .6rem; }
    .pf-media { width: 100%; aspect-ratio: 16/9; object-fit: cover; background: #f5f5f5; border-radius: 8px; display: block; }
    .pf-title { font-size: 1.05rem; font-weight: 600; }
    .pf-desc { font-size: .9rem; color: #525252; }
    .pf-tags { list-style: none; display: flex; flex-wrap: wrap; gap: .4rem; padding: 0; }
    .pf-tags li { font-size: .72rem; padding: .2rem .65rem; border: 1px solid #e5e5e5; border-radius: 999px; color: #404040; }
    .pf-contact { display: inline-block; margin-top: 3rem; padding: .65rem 1.5rem; background: #171717; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 500; }
    footer { margin-top: 4rem; padding-top: 1.5rem; border-top: 1px solid #e5e5e5; color: #a3a3a3; font-size: .85rem; }
  `,
  render({ meta, items, contact }) {
    return (
      <main>
        <header>
          <h1>{meta.title}</h1>
          <p>{meta.description}</p>
        </header>
        <Grid>
          {items.map((item) => (
            <ProjectCard key={item.id} item={item} />
          ))}
        </Grid>
        <Contact contact={contact} />
        <footer>© {new Date().getFullYear()} {meta.title}</footer>
      </main>
    );
  },
};

const editorial: Template = {
  id: "editorial",
  name: "Editorial",
  css: `
    :root { color-scheme: light; }
    * { box-sizing: border-box; margin: 0; }
    body { font-family: Georgia, "Times New Roman", serif; background: #faf7f2; color: #1c1917; line-height: 1.7; }
    main { max-width: 960px; margin: 0 auto; padding: 4rem 2rem; }
    header { margin-bottom: 4rem; border-bottom: 1px solid #d6d3d1; padding-bottom: 2rem; }
    h1 { font-size: 3rem; font-weight: 400; letter-spacing: -0.02em; margin: 0 0 .75rem; }
    header p { color: #57534e; font-size: 1.15rem; font-style: italic; max-width: 60ch; }
    .pf-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 3rem 2rem; }
    .pf-card { display: flex; flex-direction: column; gap: .75rem; }
    .pf-media { width: 100%; aspect-ratio: 4/3; object-fit: cover; background: #e7e5e4; display: block; }
    .pf-title { font-size: 1.35rem; font-weight: 500; }
    .pf-desc { font-size: .98rem; color: #44403c; }
    .pf-tags { list-style: none; display: flex; flex-wrap: wrap; gap: .5rem; padding: 0; }
    .pf-tags li { font-size: .75rem; font-style: italic; color: #78716c; }
    .pf-contact { display: inline-block; margin-top: 3rem; padding: .8rem 2rem; border: 1px solid #1c1917; color: #1c1917; text-decoration: none; font-style: italic; }
    footer { margin-top: 5rem; text-align: center; color: #a8a29e; font-size: .85rem; }
  `,
  render({ meta, items, contact }) {
    return (
      <main>
        <header>
          <h1>{meta.title}</h1>
          <p>{meta.description}</p>
        </header>
        <Grid>
          {items.map((item) => (
            <ProjectCard key={item.id} item={item} />
          ))}
        </Grid>
        <Contact contact={contact} />
        <footer>{meta.title} — {new Date().getFullYear()}</footer>
      </main>
    );
  },
};

export const templates: Record<Config["templateId"], Template> = {
  minimal,
  editorial,
};
