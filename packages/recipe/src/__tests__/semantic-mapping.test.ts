/**
 * The semantic-to-primitive table against the CSS it says it mirrors.
 *
 * `SEMANTIC_TO_PRIMITIVE` is hand-maintained and its own docblock says it
 * mirrors `token.css`. Nothing made that true. It is the third copy of a
 * mapping the YAML already owns — the first two were `cocso/mobile`'s
 * converter, which gave the same token two names, and the codegen's duplicated
 * resolver call site, which put `px` on a font weight.
 *
 * Moving `border-strong` from `neutral-400` to `neutral-500` broke this table
 * silently: the CSS, both mobile platforms and the Figma export all read from
 * the YAML, and only Figma's fallback chain kept the old value — so a Figma
 * spec would have shipped a border no other platform draws.
 */

import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { SEMANTIC_TO_PRIMITIVE } from "../utils/semantic-mapping";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const tokenCss = readFileSync(
  path.resolve(scriptDir, "../../../css/token.css"),
  "utf-8"
);

/** `--cocso-color-<name>: var(--cocso-color-<target>)` — the alias declarations. */
const aliases = new Map(
  [
    ...tokenCss.matchAll(
      /--cocso-color-([a-z0-9-]+):\s*var\(--cocso-color-([a-z0-9-]+)\)/g
    ),
  ].map(([, name, target]) => [name, target])
);

describe("The semantic mapping table mirrors the generated CSS", () => {
  it("has aliases to compare", () => {
    expect(aliases.size).toBeGreaterThan(50);
  });

  const entries = Object.entries(SEMANTIC_TO_PRIMITIVE);

  it.each(entries)("%s points where the CSS points", (name, primitive) => {
    expect(
      aliases.get(name),
      `${name} is \`${primitive}\` in the table; the CSS resolves it elsewhere`
    ).toBe(primitive);
  });

  it("names every token it claims to", () => {
    expect(
      entries.filter(([name]) => !aliases.has(name)).map(([n]) => n)
    ).toEqual([]);
  });
});
