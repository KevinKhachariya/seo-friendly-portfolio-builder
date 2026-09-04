import type { ReactElement } from "react";
import { Contact, Grid, ProjectCard, SocialLinks, TagFilter } from "./components";
import type { Config, Item } from "./config";

type Ctx = { meta: Config["meta"]; items: Item[]; contact: Config["contact"] };

// A swappable body template. To add your own:
//   1. add its id to the templateId enum in config.ts
//   2. define a Template below (id, name, css, render) using the finite components
//   3. add it to the `templates` record
// templates.test.ts verifies this contract automatically.
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
    .pf-filter { display: flex; flex-wrap: wrap; align-items: center; gap: .5rem; margin-bottom: 2rem; }
    .pf-filter-label { font-size: .8rem; color: #525252; }
    .pf-filter-btn { font: inherit; font-size: .8rem; padding: .3rem .8rem; border: 1px solid #d4d4d4; border-radius: 999px; background: #fff; color: #171717; cursor: pointer; }
    .pf-filter-btn.active { background: #171717; color: #fff; border-color: #171717; }
    .pf-social { display: flex; flex-wrap: wrap; gap: 1rem; margin-bottom: 1rem; }
    .pf-social a { color: #171717; text-decoration: none; font-size: 1.05rem; font-weight: 600; }
    .pf-social a:hover { text-decoration: underline; }
    .pf-card { display: flex; flex-direction: column; gap: .6rem; }
    .pf-media { width: 100%; aspect-ratio: 16/9; object-fit: cover; background: #f5f5f5; border-radius: 8px; display: block; }
    .pf-title { font-size: 1.05rem; font-weight: 600; }
    .pf-desc { font-size: .9rem; color: #525252; }
    .pf-tags { list-style: none; display: flex; flex-wrap: wrap; gap: .4rem; padding: 0; }
    .pf-tags li { font-size: .72rem; padding: .2rem .65rem; border: 1px solid #e5e5e5; border-radius: 999px; color: #404040; }
    .pf-link { margin-top: auto; padding-top: .5rem; font-size: .85rem; font-weight: 600; color: #171717; }
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
        <SocialLinks meta={meta} />
        <TagFilter items={items} />
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
    .pf-filter { display: flex; flex-wrap: wrap; align-items: center; gap: .75rem; margin-bottom: 3rem; }
    .pf-filter-label { font-size: .85rem; font-style: italic; color: #57534e; }
    .pf-filter-btn { font: inherit; font-size: .85rem; font-style: italic; padding: .25rem .9rem; border: 1px solid #d6d3d1; background: transparent; color: #1c1917; cursor: pointer; }
    .pf-filter-btn.active { background: #1c1917; color: #faf7f2; border-color: #1c1917; }
    .pf-social { display: flex; flex-wrap: wrap; gap: 1.5rem; margin-bottom: 2rem; }
    .pf-social a { color: #1c1917; text-decoration: none; font-style: italic; font-size: 1.15rem; }
    .pf-social a:hover { text-decoration: underline; }
    .pf-card { display: flex; flex-direction: column; gap: .75rem; }
    .pf-media { width: 100%; aspect-ratio: 4/3; object-fit: cover; background: #e7e5e4; display: block; }
    .pf-title { font-size: 1.35rem; font-weight: 500; }
    .pf-desc { font-size: .98rem; color: #44403c; }
    .pf-tags { list-style: none; display: flex; flex-wrap: wrap; gap: .5rem; padding: 0; }
    .pf-tags li { font-size: .75rem; font-style: italic; color: #78716c; }
    .pf-link { margin-top: auto; padding-top: .75rem; font-size: .9rem; font-style: italic; color: #1c1917; }
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
        <SocialLinks meta={meta} />
        <TagFilter items={items} />
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

const cartoony: Template = {
  id: "cartoony",
  name: "Cartoony",
  css: `
    :root { color-scheme: light; }
    * { box-sizing: border-box; margin: 0; }
    body {
      font-family: "Trebuchet MS", "Segoe UI", sans-serif;
      background: #f7f3e8;
      background-image: radial-gradient(#0000001a 1px, transparent 1px);
      background-size: 12px 12px;
      color: #151515;
      line-height: 1.5;
    }
    main { max-width: 1120px; margin: 0 auto; padding: 3rem 1.5rem; }
    header { margin-bottom: 2.5rem; }
    h1 {
      font-family: "Arial Black", "Franklin Gothic Bold", Impact, sans-serif;
      font-size: 3rem;
      text-transform: uppercase;
      letter-spacing: .02em;
      text-shadow: 3px 3px 0 #fff;
      transform: rotate(-1.5deg);
      margin: 0 0 .5rem;
    }
    header p { font-weight: bold; font-size: 1.05rem; max-width: 60ch; }
    .pf-social { display: flex; flex-wrap: wrap; gap: .75rem; margin-bottom: 1.5rem; }
    .pf-social a {
      font-family: "Arial Black", Impact, sans-serif;
      font-size: .95rem;
      text-transform: uppercase;
      text-decoration: none;
      color: #151515;
      background: #fff;
      border: 3px solid #151515;
      padding: .35rem .8rem;
      box-shadow: 4px 4px 0 #151515;
    }
    .pf-social a:hover { background: #e63900; color: #fff; }
    .pf-filter { display: flex; flex-wrap: wrap; align-items: center; gap: .6rem; margin-bottom: 2rem; }
    .pf-filter-label { font-weight: bold; text-transform: uppercase; font-size: .75rem; }
    .pf-filter-btn {
      font: inherit;
      font-weight: bold;
      text-transform: uppercase;
      font-size: .75rem;
      padding: .3rem .7rem;
      border: 2px solid #151515;
      background: #ffffff;
      color: #151515;
      cursor: pointer;
      box-shadow: 2px 2px 0 #151515;
    }
    .pf-filter-btn.active { background: #151515; color: #ffffff; }
    .pf-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 2rem; }
    .pf-card {
      display: flex;
      flex-direction: column;
      gap: .6rem;
      background: #fff;
      border: 3px solid #151515;
      padding: 1rem;
      box-shadow: 6px 6px 0 #151515;
    }
    .pf-card:hover { transform: rotate(-.5deg); }
    .pf-media { width: 100%; aspect-ratio: 16/9; object-fit: cover; background: #e2e2e2; border: 3px solid #151515; display: block; }
    .pf-title { font-family: "Arial Black", Impact, sans-serif; font-size: 1.15rem; text-transform: uppercase; }
    .pf-desc { font-size: .9rem; }
    .pf-tags { list-style: none; display: flex; flex-wrap: wrap; gap: .4rem; padding: 0; }
    .pf-tags li { font-size: .72rem; font-weight: bold; text-transform: uppercase; padding: .15rem .55rem; background: #e63900; color: #fff; border: 2px solid #151515; }
    .pf-link { margin-top: auto; padding-top: .5rem; font-family: "Arial Black", Impact, sans-serif; font-size: .8rem; text-transform: uppercase; color: #e63900; text-decoration: underline; }
    .pf-contact {
      display: inline-block;
      margin-top: 2.5rem;
      font-family: "Arial Black", Impact, sans-serif;
      text-transform: uppercase;
      font-size: 1rem;
      padding: .7rem 1.6rem;
      background: #e63900;
      color: #fff;
      text-decoration: none;
      border: 3px solid #151515;
      box-shadow: 5px 5px 0 #151515;
    }
    .pf-contact:hover { background: #151515; color: #f7f3e8; }
    footer { margin-top: 3.5rem; font-weight: bold; text-transform: uppercase; font-size: .8rem; }
  `,
  render({ meta, items, contact }) {
    return (
      <main>
        <header>
          <h1>{meta.title}</h1>
          <p>{meta.description}</p>
        </header>
        <SocialLinks meta={meta} />
        <TagFilter items={items} />
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

export const templates: Record<Config["templateId"], Template> = {
  minimal,
  editorial,
  cartoony,
};
