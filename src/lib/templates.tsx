import type { ReactElement } from "react";
import { Contact, ProjectsSection, SiteHeader, SocialLinks } from "./components";
import type { Config, Item } from "./config";

type Ctx = { meta: Config["meta"]; items: Item[]; contact: Config["contact"]; resume?: Config["resume"] };

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
    * { box-sizing: border-box; margin: 0; }
    .pf-page { font-family: ui-sans-serif, system-ui, -apple-system, sans-serif; background: #fff; color: #171717; line-height: 1.6; min-height: 100%; }
    .pf-site-header { position: sticky; top: 0; z-index: 50; background: rgba(255,255,255,.9); backdrop-filter: blur(8px); border-bottom: 1px solid #e5e5e5; }
    .pf-site-inner { max-width: 1120px; margin: 0 auto; padding: .8rem 1.5rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
    .pf-brand { font-weight: 700; letter-spacing: -0.02em; text-decoration: none; color: #171717; font-size: .95rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 60%; }
    .pf-nav { display: flex; gap: 1.25rem; flex-shrink: 0; }
    .pf-nav a { font-size: .85rem; font-weight: 600; color: #525252; text-decoration: none; }
    .pf-nav a:hover { color: #171717; text-decoration: underline; }
    main { max-width: 1120px; margin: 0 auto; padding: 3rem 1.5rem; }
    .pf-hero { margin-bottom: 3rem; }
    h1 { font-size: clamp(1.6rem, 1.2rem + 2.5vw, 2.25rem); letter-spacing: -0.03em; margin: 0 0 .5rem; overflow-wrap: anywhere; word-break: break-word; text-wrap: balance; max-width: 100%; }
    .pf-hero p { color: #525252; font-size: clamp(0.95rem, 0.9rem + 0.5vw, 1.05rem); max-width: 56ch; overflow-wrap: anywhere; word-break: break-word; }
    .pf-projects { scroll-margin-top: 4.5rem; }
    .pf-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr)); gap: 2rem; }
    .pf-filter { display: flex; flex-wrap: wrap; align-items: center; gap: .5rem; margin-bottom: 2rem; }
    .pf-filter-label { font-size: .8rem; color: #525252; }
    .pf-filter-btn { font: inherit; font-size: .8rem; padding: .3rem .8rem; border: 1px solid #d4d4d4; border-radius: 999px; background: #fff; color: #171717; cursor: pointer; }
    .pf-filter-btn.active { background: #171717; color: #fff; border-color: #171717; }
    .pf-filter-btn[hidden] { display: none; }
    .pf-filter-more { font: inherit; font-size: .8rem; font-weight: 600; padding: .3rem .6rem; border: 0; background: transparent; color: #171717; text-decoration: underline; cursor: pointer; }
    .pf-social { display: flex; flex-wrap: wrap; gap: 1rem; margin-bottom: 1rem; }
    .pf-social a { color: #171717; text-decoration: none; font-size: 1.05rem; font-weight: 600; }
    .pf-social a:hover { text-decoration: underline; }
    .pf-card { display: flex; flex-direction: column; gap: .6rem; min-width: 0; }
    .pf-card { display: flex; flex-direction: column; gap: .6rem; min-width: 0; }
    .pf-media { width: 100%; aspect-ratio: 16/9; object-fit: cover; background: #f5f5f5; border-radius: 8px; display: block; }
    .pf-title { font-size: clamp(.95rem, .85rem + .8vw, 1.05rem); font-weight: 600; line-height: 1.3; overflow-wrap: anywhere; word-break: break-word; hyphens: auto; }
    .pf-desc { font-size: clamp(.82rem, .78rem + .4vw, .9rem); color: #525252; overflow-wrap: anywhere; word-break: break-word; }
    .pf-tags { list-style: none; display: flex; flex-wrap: wrap; gap: .4rem; padding: 0; }
    .pf-tags li { font-size: .72rem; padding: .2rem .65rem; border: 1px solid #e5e5e5; border-radius: 999px; color: #404040; }
    .pf-link { margin-top: auto; padding-top: .5rem; font-size: .85rem; font-weight: 600; color: #171717; }
    .pf-contact { display: inline-block; margin-top: 3rem; padding: .65rem 1.5rem; background: #171717; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 500; }
    @media (max-width: 640px) { main { padding: 2rem 1rem; } }
    footer { margin-top: 4rem; padding-top: 1.5rem; border-top: 1px solid #e5e5e5; color: #a3a3a3; font-size: .85rem; }
    @media (max-width: 640px) {
      main { padding: 2rem 1rem; }
      header { margin-bottom: 2rem; }
      .pf-grid { grid-template-columns: 1fr; gap: 1.5rem; }
      .pf-social a { font-size: .95rem; }
    }
    @media (min-width: 641px) and (max-width: 1024px) {
      .pf-grid { gap: 1.5rem; }
    }
  `,
  render({ meta, items, contact, resume }) {
    return (
      <>
        <SiteHeader meta={meta} resume={resume} />
        <main id="top">
          <header className="pf-hero">
            <h1>{meta.title}</h1>
            <p>{meta.description}</p>
          </header>
          <SocialLinks meta={meta} />
          <ProjectsSection items={items} />
          <Contact contact={contact} />
          <footer>© {new Date().getFullYear()} {meta.title}</footer>
        </main>
      </>
    );
  },
};

const editorial: Template = {
  id: "editorial",
  name: "Editorial",
  css: `
    * { box-sizing: border-box; margin: 0; }
    .pf-page { font-family: Georgia, "Times New Roman", serif; background: #faf7f2; color: #1c1917; line-height: 1.7; min-height: 100%; }
    .pf-site-header { position: sticky; top: 0; z-index: 50; background: rgba(250,247,242,.92); backdrop-filter: blur(8px); border-bottom: 1px solid #d6d3d1; }
    .pf-site-inner { max-width: 960px; margin: 0 auto; padding: .9rem 2rem; display: flex; align-items: baseline; justify-content: space-between; gap: 1rem; }
    .pf-brand { font-style: italic; text-decoration: none; color: #1c1917; font-size: 1rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 60%; }
    .pf-nav { display: flex; gap: 1.5rem; flex-shrink: 0; }
    .pf-nav a { font-size: .9rem; font-style: italic; color: #57534e; text-decoration: none; }
    .pf-nav a:hover { color: #1c1917; text-decoration: underline; }
    main { max-width: 960px; margin: 0 auto; padding: 4rem 2rem; }
    .pf-hero { margin-bottom: 4rem; border-bottom: 1px solid #d6d3d1; padding-bottom: 2rem; }
    h1 { font-size: clamp(1.8rem, 1.3rem + 3vw, 3rem); font-weight: 400; letter-spacing: -0.02em; margin: 0 0 .75rem; overflow-wrap: anywhere; word-break: break-word; text-wrap: balance; max-width: 100%; }
    .pf-hero p { color: #57534e; font-size: clamp(1rem, 0.92rem + 0.6vw, 1.15rem); font-style: italic; max-width: 60ch; overflow-wrap: anywhere; word-break: break-word; }
    .pf-projects { scroll-margin-top: 4.5rem; }
    .pf-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr)); gap: 3rem 2rem; }
    .pf-filter { display: flex; flex-wrap: wrap; align-items: center; gap: .75rem; margin-bottom: 3rem; }
    .pf-filter-label { font-size: .85rem; font-style: italic; color: #57534e; }
    .pf-filter-btn { font: inherit; font-size: .85rem; font-style: italic; padding: .25rem .9rem; border: 1px solid #d6d3d1; background: transparent; color: #1c1917; cursor: pointer; }
    .pf-filter-btn.active { background: #1c1917; color: #faf7f2; border-color: #1c1917; }
    .pf-filter-btn[hidden] { display: none; }
    .pf-filter-more { font: inherit; font-size: .85rem; font-style: italic; padding: .25rem .5rem; border: 0; background: transparent; color: #1c1917; text-decoration: underline; cursor: pointer; }
    .pf-social { display: flex; flex-wrap: wrap; gap: 1.5rem; margin-bottom: 2rem; }
    .pf-social a { color: #1c1917; text-decoration: none; font-style: italic; font-size: 1.15rem; }
    .pf-social a:hover { text-decoration: underline; }
    .pf-card { display: flex; flex-direction: column; gap: .75rem; min-width: 0; }
    .pf-card { display: flex; flex-direction: column; gap: .75rem; min-width: 0; }
    .pf-media { width: 100%; aspect-ratio: 4/3; object-fit: cover; background: #e7e5e4; display: block; }
    .pf-title { font-size: clamp(1.05rem, .9rem + 1vw, 1.35rem); font-weight: 500; line-height: 1.3; overflow-wrap: anywhere; word-break: break-word; hyphens: auto; }
    .pf-desc { font-size: clamp(.88rem, .82rem + .4vw, .98rem); color: #44403c; overflow-wrap: anywhere; word-break: break-word; }
    .pf-tags { list-style: none; display: flex; flex-wrap: wrap; gap: .5rem; padding: 0; }
    .pf-tags li { font-size: .75rem; font-style: italic; color: #78716c; }
    .pf-link { margin-top: auto; padding-top: .75rem; font-size: .9rem; font-style: italic; color: #1c1917; }
    .pf-contact { display: inline-block; margin-top: 3rem; padding: .8rem 2rem; border: 1px solid #1c1917; color: #1c1917; text-decoration: none; font-style: italic; }
    @media (max-width: 640px) { main { padding: 2.5rem 1rem; } }
    footer { margin-top: 5rem; text-align: center; color: #a8a29e; font-size: .85rem; }
    @media (max-width: 640px) {
      main { padding: 2.5rem 1rem; }
      header { margin-bottom: 2.5rem; }
      .pf-grid { grid-template-columns: 1fr; gap: 2rem 1rem; }
      .pf-social a { font-size: 1rem; }
    }
    @media (min-width: 641px) and (max-width: 1024px) {
      .pf-grid { gap: 2rem 1.5rem; }
    }
  `,
  render({ meta, items, contact, resume }) {
    return (
      <>
        <SiteHeader meta={meta} resume={resume} />
        <main id="top">
          <header className="pf-hero">
            <h1>{meta.title}</h1>
            <p>{meta.description}</p>
          </header>
          <SocialLinks meta={meta} />
          <ProjectsSection items={items} />
          <Contact contact={contact} />
          <footer>{meta.title} — {new Date().getFullYear()}</footer>
        </main>
      </>
    );
  },
};

const cartoony: Template = {
  id: "cartoony",
  name: "Cartoony",
  css: `
    * { box-sizing: border-box; margin: 0; }
    .pf-page {
      font-family: "Trebuchet MS", "Segoe UI", sans-serif;
      background: #f7f3e8;
      background-image: radial-gradient(#0000001a 1px, transparent 1px);
      background-size: 12px 12px;
      color: #151515;
      line-height: 1.5;
      min-height: 100%;
    }
    main { max-width: 1120px; margin: 0 auto; padding: 3rem 1.5rem; }
    .pf-site-header { position: sticky; top: 0; z-index: 50; background: #151515; border-bottom: 3px solid #151515; }
    .pf-site-inner { max-width: 1120px; margin: 0 auto; padding: .7rem 1.5rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
    .pf-brand { font-family: "Arial Black", Impact, sans-serif; font-size: .9rem; text-transform: uppercase; text-decoration: none; color: #f7f3e8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 60%; }
    .pf-nav { display: flex; gap: .6rem; flex-shrink: 0; }
    .pf-nav a { font-family: "Arial Black", Impact, sans-serif; font-size: .72rem; text-transform: uppercase; text-decoration: none; color: #151515; background: #fff; border: 2px solid #f7f3e8; padding: .25rem .65rem; box-shadow: 3px 3px 0 #e63900; }
    .pf-nav a:hover { background: #e63900; color: #fff; }
    .pf-projects { scroll-margin-top: 4.5rem; }
    .pf-hero { margin-bottom: 2.5rem; }
    h1 {
      font-family: "Arial Black", "Franklin Gothic Bold", Impact, sans-serif;
      font-size: clamp(1.6rem, 1.1rem + 2.8vw, 3rem);
      text-transform: uppercase;
      letter-spacing: .02em;
      line-height: 1.1;
      text-shadow: 3px 3px 0 #fff;
      transform: rotate(-1.5deg);
      margin: 0 0 .5rem;
      overflow-wrap: break-word;
      word-break: break-word;
    }
    header p { font-weight: bold; font-size: clamp(.92rem, .85rem + .5vw, 1.05rem); max-width: 60ch; overflow-wrap: break-word; }
    .pf-topbar { display: flex; justify-content: flex-end; margin-bottom: 1.5rem; }
    .pf-resume-btn {
      font-family: "Arial Black", Impact, sans-serif;
      font-size: .85rem;
      text-transform: uppercase;
      text-decoration: none;
      color: #fff;
      background: #e63900;
      border: 3px solid #151515;
      padding: .4rem 1rem;
      box-shadow: 4px 4px 0 #151515;
    }
    .pf-resume-btn:hover { background: #151515; color: #f7f3e8; }
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
    .pf-filter-btn[hidden] { display: none; }
    .pf-filter-more { font: inherit; font-weight: bold; text-transform: uppercase; font-size: .75rem; padding: .3rem .7rem; border: 2px dashed #151515; background: transparent; color: #151515; cursor: pointer; }
    .pf-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 2rem; }
    .pf-card {
      display: flex;
      flex-direction: column;
      gap: .6rem;
      background: #fff;
      border: 3px solid #151515;
      padding: 1rem;
      box-shadow: 6px 6px 0 #151515;
      min-width: 0;
      min-width: 0;
    }
    .pf-card:hover { transform: rotate(-.5deg); }
    .pf-media { width: 100%; aspect-ratio: 16/9; object-fit: cover; background: #e2e2e2; border: 3px solid #151515; display: block; }
    .pf-title { font-family: "Arial Black", Impact, sans-serif; font-size: clamp(.95rem, .85rem + .8vw, 1.15rem); text-transform: uppercase; line-height: 1.25; overflow-wrap: anywhere; word-break: break-word; hyphens: auto; }
    .pf-desc { font-size: clamp(.82rem, .78rem + .4vw, .9rem); overflow-wrap: anywhere; word-break: break-word; }
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
    @media (max-width: 640px) { main { padding: 2rem 1rem; } h1 { transform: none; } }
    footer { margin-top: 3.5rem; font-weight: bold; text-transform: uppercase; font-size: .8rem; }
    @media (max-width: 640px) {
      main { padding: 2rem 1rem; }
      h1 { transform: none; text-shadow: 2px 2px 0 #fff; }
      .pf-grid { grid-template-columns: 1fr; gap: 1.5rem; }
      .pf-card { padding: .85rem; }
      .pf-social a { font-size: .8rem; }
    }
    @media (min-width: 641px) and (max-width: 1024px) {
      .pf-grid { gap: 1.5rem; }
    }
  `,
  render({ meta, items, contact, resume }) {
    return (
      <>
        <SiteHeader meta={meta} resume={resume} />
        <main id="top">
          <header className="pf-hero">
            <h1>{meta.title}</h1>
            <p>{meta.description}</p>
          </header>
          <SocialLinks meta={meta} />
          <ProjectsSection items={items} />
          <Contact contact={contact} />
          <footer>© {new Date().getFullYear()} {meta.title}</footer>
        </main>
      </>
    );
  },
};

export const templates: Record<Config["templateId"], Template> = {
  minimal,
  editorial,
  cartoony,
};
