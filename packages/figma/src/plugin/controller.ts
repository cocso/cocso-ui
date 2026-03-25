import { syncTokens } from "../core/variable-creator";
import tokenData from "../generated/tokens.json";
import {
  generateBadgeComponents,
  generateButtonComponents,
  generateInputComponents,
} from "../generators";
import type { FigmaTokenData } from "../types/token-schema";

const SUPPORTED_SCHEMA_VERSION = 1;
const COMPONENT_PAGE_NAME = "cocso-ui Components";

figma.showUI(__html__, { width: 360, height: 480 });

figma.ui.onmessage = async (msg: { type: string }) => {
  if (msg.type === "sync-tokens") {
    const data = tokenData as FigmaTokenData;

    if (data.schemaVersion !== SUPPORTED_SCHEMA_VERSION) {
      figma.ui.postMessage({
        type: "sync-error",
        error: `Unsupported schema version: ${data.schemaVersion}`,
      });
      return;
    }

    figma.ui.postMessage({ type: "sync-start" });

    try {
      const result = await syncTokens(data);
      figma.ui.postMessage({ type: "sync-complete", result });

      const summary = [
        `Created: ${result.created}`,
        `Updated: ${result.updated}`,
        `Skipped: ${result.skipped}`,
      ].join(", ");
      figma.notify(`Token sync complete — ${summary}`);
    } catch (err) {
      figma.ui.postMessage({
        type: "sync-error",
        error: err instanceof Error ? err.message : String(err),
      });
      figma.notify("Token sync failed", { error: true });
    }
  }

  if (msg.type === "generate-components") {
    figma.ui.postMessage({ type: "generate-start" });

    try {
      await figma.loadFontAsync({ family: "Inter", style: "Regular" });
      await figma.loadFontAsync({ family: "Inter", style: "Medium" });
      await figma.loadFontAsync({ family: "Inter", style: "Semi Bold" });
      await figma.loadFontAsync({ family: "Inter", style: "Bold" });
      await figma.loadFontAsync({ family: "Inter", style: "Light" });

      let page = figma.root.children.find(
        (p) => p.name === COMPONENT_PAGE_NAME
      );
      if (page) {
        for (const child of [...page.children]) {
          child.remove();
        }
      } else {
        page = figma.createPage();
        page.name = COMPONENT_PAGE_NAME;
      }

      let yOffset = 0;
      yOffset = generateButtonComponents(page, yOffset);
      yOffset = generateBadgeComponents(page, yOffset);
      yOffset = generateInputComponents(page, yOffset);

      figma.ui.postMessage({
        type: "generate-complete",
        result: { components: 3, page: COMPONENT_PAGE_NAME },
      });
      figma.notify(`Components generated on "${COMPONENT_PAGE_NAME}" page`);
    } catch (err) {
      figma.ui.postMessage({
        type: "generate-error",
        error: err instanceof Error ? err.message : String(err),
      });
      figma.notify("Component generation failed", { error: true });
    }
  }
};
