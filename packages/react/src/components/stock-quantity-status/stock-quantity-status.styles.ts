/**
 * StockQuantityStatus style functions — extracted for conformance testing.
 * NOT exported via the package barrel (index.ts). Internal only.
 */
import { match } from "ts-pattern";
import { colors } from "../../token";

export type QuantityStatus = "보통" | "여유" | "부족";

export const getColor = (quantity: QuantityStatus) =>
  match(quantity)
    .with("여유", () => colors.info500)
    .with("보통", () => colors.success400)
    .with("부족", () => colors.danger500)
    .exhaustive();
