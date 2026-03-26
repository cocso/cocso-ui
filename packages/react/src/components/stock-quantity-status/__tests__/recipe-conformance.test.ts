import { stockQuantityStatusRecipe } from "@cocso-ui/recipe/recipes/stock-quantity-status.recipe";
import { resolveForReact } from "@cocso-ui/recipe/resolvers/react";
import { describe, expect, it } from "vitest";
import { getColor, type QuantityStatus } from "../stock-quantity-status.styles";

const QUANTITIES: QuantityStatus[] = ["여유", "보통", "부족"];

describe("StockQuantityStatus recipe conformance", () => {
  describe("quantity → color", () => {
    for (const quantity of QUANTITIES) {
      it(`${quantity} color matches`, () => {
        const resolved = resolveForReact(stockQuantityStatusRecipe, {
          quantity,
        });
        expect(resolved["--cocso-stock-quantity-status-color"]).toBe(
          getColor(quantity)
        );
      });
    }
  });
});
