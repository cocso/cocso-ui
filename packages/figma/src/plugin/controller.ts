import { syncTokens } from "../core/variable-creator";
import tokenData from "../generated/tokens.json";
import type { FigmaTokenData } from "../types/token-schema";

figma.showUI(__html__, { width: 360, height: 420 });

figma.ui.onmessage = (msg: { type: string }) => {
  if (msg.type === "sync-tokens") {
    figma.ui.postMessage({ type: "sync-start" });

    try {
      const result = syncTokens(tokenData as FigmaTokenData);

      figma.ui.postMessage({
        type: "sync-complete",
        result,
      });

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
};
