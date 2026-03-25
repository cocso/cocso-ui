import { describe, expect, it } from "vitest";
import { parseLlmsIndex, rankComponentsForPrompt } from "../src/registry.js";
import { DocumentationSectionId } from "../src/types.js";

const SAMPLE_LLMS = `# COCSO UI

## Getting Started

- [Installation](https://cocso-ui.com/getting-started/installation.md): install guide

## Components

- [Button](https://cocso-ui.com/components/button.md): trigger action
- [Dialog](https://cocso-ui.com/components/dialog.md): modal interaction
`;

describe("parseLlmsIndex", () => {
  it("maps links with section context", () => {
    const links = parseLlmsIndex(SAMPLE_LLMS);
    expect(links).toHaveLength(3);
    expect(links[0]?.section).toBe(DocumentationSectionId.GETTING_STARTED);
    expect(links[1]?.section).toBe(DocumentationSectionId.COMPONENTS);
  });

  it("normalizes docs urls to canonical host", () => {
    const links = parseLlmsIndex(
      "## Components\n\n- [Button](https://www.cocso-ui.com/components/button.md): trigger action\n"
    );
    expect(links[0]?.url).toBe("https://cocso-ui.com/components/button.md");
  });
});

describe("rankComponentsForPrompt", () => {
  it("ranks best matches first", () => {
    const ranked = rankComponentsForPrompt(
      "Build a page with modal confirmation and actions",
      [
        {
          title: "Button",
          slug: "button",
          url: "https://cocso-ui.com/components/button.md",
          description: "trigger action",
          importPackage: "@cocso-ui/react",
        },
        {
          title: "Dialog",
          slug: "dialog",
          url: "https://cocso-ui.com/components/dialog.md",
          description: "modal interaction",
          importPackage: "@cocso-ui/react",
        },
      ],
      2
    );

    expect(ranked[0]?.slug).toBe("dialog");
  });
});
