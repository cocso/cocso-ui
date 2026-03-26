import { syncTokens } from "../core/variable-creator";
import tokenData from "../generated/tokens.json";
import { generateFromRecipes } from "../generators";
import { loadColorVariables, setupPageLayout } from "../generators/shared";
import type { FigmaTokenData } from "../types/token-schema";

const SUPPORTED_SCHEMA_VERSION = 1;
const COMPONENT_PAGE_NAME = "cocso-ui Components";

figma.showUI(__html__, { width: 360, height: 480 });

async function handleSyncTokens() {
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

async function prepareComponentPage(): Promise<FrameNode> {
  await figma.loadFontAsync({ family: "Pretendard", style: "Regular" });
  await figma.loadFontAsync({ family: "Pretendard", style: "Medium" });
  await figma.loadFontAsync({ family: "Pretendard", style: "SemiBold" });
  await figma.loadFontAsync({ family: "Pretendard", style: "Bold" });
  await figma.loadFontAsync({ family: "Pretendard", style: "Light" });
  await figma.loadFontAsync({ family: "Pretendard", style: "ExtraBold" });

  let page = figma.root.children.find((p) => p.name === COMPONENT_PAGE_NAME);
  if (page) {
    await page.loadAsync();
    for (const child of [...page.children]) {
      child.remove();
    }
  } else {
    page = figma.createPage();
    page.name = COMPONENT_PAGE_NAME;
  }

  return setupPageLayout(page);
}

async function handleGenerateComponents() {
  figma.ui.postMessage({ type: "generate-start" });

  try {
    const container = await prepareComponentPage();

    // Pre-load Figma color Variables for token-driven binding (Reshaped-like)
    await loadColorVariables();

    const count = generateFromRecipes(container);

    figma.ui.postMessage({
      type: "generate-complete",
      result: { components: count, page: COMPONENT_PAGE_NAME },
    });
    figma.notify(`${count} component sets generated from recipes`);
  } catch (err) {
    figma.ui.postMessage({
      type: "generate-error",
      error: err instanceof Error ? err.message : String(err),
    });
    figma.notify("Component generation failed", { error: true });
  }
}

figma.ui.onmessage = async (msg: { type: string }) => {
  if (msg.type === "sync-tokens") {
    await handleSyncTokens();
  }
  if (msg.type === "generate-components") {
    await handleGenerateComponents();
  }
};
