/**
 * Variable sync — the step that actually puts tokens into Figma
 *
 * This file had no tests, and the gap showed. `getOrCreateCollection` forced
 * the collection to a single mode named `default`, from when the sources had
 * one. Once the semantic layer moved to a `light`/`dark` collection, every
 * lookup in the mode map missed: `toUpsertParams` writes a value only for a
 * mode it can find an id for, so the sync would have created every variable
 * with no values at all — and reported success, because nothing threw.
 *
 * The generator tests could not see it. They check the JSON that comes out of
 * the YAML, and the JSON was correct; what was wrong was the thing that reads
 * it.
 */

import { beforeEach, describe, expect, it, vi } from "vitest";
import { syncTokens } from "../core/variable-creator";
import type { FigmaTokenData } from "../types/token-schema";

interface FakeMode {
  modeId: string;
  name: string;
}

/** Enough of Figma's plugin API for the sync path, and no more. */
function fakeFigma() {
  const created: Record<string, Record<string, unknown>> = {};
  let modeSeq = 0;

  const collection = {
    id: "collection-1",
    name: "cocso-ui",
    modes: [{ modeId: "mode-0", name: "Mode 1" }] as FakeMode[],
    renameMode(modeId: string, name: string) {
      const mode = this.modes.find((m) => m.modeId === modeId);
      if (mode) {
        mode.name = name;
      }
    },
    addMode(name: string) {
      modeSeq += 1;
      const modeId = `mode-${modeSeq}`;
      this.modes.push({ modeId, name });
      return modeId;
    },
  };

  return {
    collection,
    created,
    api: {
      variables: {
        getLocalVariableCollectionsAsync: async () => [],
        createVariableCollection: () => collection,
        getLocalVariablesAsync: async () => [],
        createVariable: (name: string) => {
          created[name] = {};
          return {
            name,
            variableCollectionId: collection.id,
            setValueForMode(modeId: string, value: unknown) {
              created[name][modeId] = value;
            },
          };
        },
      },
    },
  };
}

const DATA: FigmaTokenData = {
  collections: [{ modes: ["light", "dark"], name: "cocso-ui" }],
  generatedAt: "2026-01-01T00:00:00.000Z",
  schemaVersion: 1,
  skipped: [],
  tokens: [
    {
      collection: "cocso-ui",
      name: "color/feedback/danger",
      resolvedType: "COLOR",
      sourceTokenName: "$color.feedback.danger",
      values: {
        dark: { a: 1, b: 0.25, g: 0.37, r: 0.94 },
        light: { a: 1, b: 0.07, g: 0.2, r: 0.87 },
      },
    },
  ],
};

let fake: ReturnType<typeof fakeFigma>;

beforeEach(() => {
  fake = fakeFigma();
  vi.stubGlobal("figma", fake.api);
});

describe("syncTokens creates the modes the export declares", () => {
  it("names the collection's modes after the declared ones", async () => {
    await syncTokens(DATA);
    expect(fake.collection.modes.map((mode) => mode.name)).toEqual([
      "light",
      "dark",
    ]);
  });

  it("writes a value for every declared mode", async () => {
    await syncTokens(DATA);

    const values = fake.created["color/feedback/danger"];
    expect(
      values,
      "the variable was created with no values at all"
    ).toBeDefined();

    const byMode = Object.fromEntries(
      fake.collection.modes.map((mode) => [mode.name, values[mode.modeId]])
    );
    expect(Object.keys(byMode).sort()).toEqual(["dark", "light"]);
    expect(byMode.light).toBeDefined();
    expect(byMode.dark).toBeDefined();
    expect(byMode.light).not.toEqual(byMode.dark);
  });

  it("reuses a mode the collection already has", async () => {
    fake.collection.modes = [{ modeId: "mode-existing", name: "light" }];
    await syncTokens(DATA);

    expect(fake.collection.modes.map((mode) => mode.name)).toEqual([
      "light",
      "dark",
    ]);
    expect(
      fake.created["color/feedback/danger"]["mode-existing"]
    ).toBeDefined();
  });
});
