/**
 * Defaults a component decides for itself, against the recipe that decides the
 * same thing.
 *
 * `Typography` is the case this was written for. The recipe says a heading
 * weighs 700, and `typography.tsx` says `weight = type === "heading" ? "bold"
 * : "normal"` — two sources for one decision. They agree today, and nothing
 * was holding them together: the component does not import the generated CSS
 * (`typography.css` is emitted and imported by nobody), so the recipe's value
 * never reaches the browser and a change to it would move iOS and Android
 * while the web stayed where it was.
 *
 * Wiring the component to the CSS would be the structural fix, and it changes
 * how a published component resolves its sizes. This holds the two together
 * until someone makes that call.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Typography } from "../components/typography/typography";

const GENERATED = join(
  import.meta.dirname,
  "..",
  "..",
  "..",
  "..",
  "ecosystem",
  "codegen",
  "generated"
);

/** The value the recipe emits for a rule, e.g. `type-heading`. */
function generatedValue(file: string, selector: string, property: string) {
  const css = readFileSync(join(GENERATED, file), "utf-8");
  const rule = css.match(new RegExp(`${selector}\\)\\s*\\{([^}]*)\\}`))?.[1];
  return rule?.match(new RegExp(`${property}:\\s*([^;]+);`))?.[1]?.trim();
}

describe("A component's default matches the recipe that states the same thing", () => {
  it("gives a heading the weight the typography recipe gives it", () => {
    const fromRecipe = generatedValue(
      "typography.css",
      "cocso-typography--type-heading",
      "--cocso-typography-font-weight"
    );
    expect(fromRecipe, "the recipe stopped stating a heading's weight").toBe(
      "700"
    );

    render(<Typography type="heading">Heading</Typography>);
    const style = screen.getByText("Heading").getAttribute("style") ?? "";
    expect(
      style,
      "the component's default weight and the recipe's have diverged"
    ).toContain(`--cocso-typography-font-weight: ${fromRecipe}`);
  });
});
