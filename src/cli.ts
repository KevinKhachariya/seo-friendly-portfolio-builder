import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { configSchema } from "./lib/config";
import { build } from "./lib/build";

const root = process.cwd();
const config = configSchema.parse(
  JSON.parse(readFileSync(resolve(root, "portfolio.config.json"), "utf8")),
);
const html = build(config);
mkdirSync(resolve(root, "dist"), { recursive: true });
writeFileSync(resolve(root, "dist/index.html"), html);
console.log("✓ Built dist/index.html");
