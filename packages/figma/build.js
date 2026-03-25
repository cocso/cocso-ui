const { build } = require("esbuild");
const { cpSync } = require("node:fs");

async function main() {
  await build({
    entryPoints: ["src/plugin/controller.ts"],
    bundle: true,
    format: "iife",
    target: "es2017",
    outfile: "dist/controller.js",
    logLevel: "info",
  });

  cpSync("src/ui/index.html", "dist/ui.html");
  cpSync("manifest.json", "dist/manifest.json");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
