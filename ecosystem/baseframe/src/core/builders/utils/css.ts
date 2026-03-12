import { parseValue, valueToString } from "../../parsers";
import type { TokenResolver } from "../../transforms/resolve";
import type { TokenRef, Value } from "../../types";

/**
 * Converts a raw token value to its CSS string representation.
 *
 * Strings and numbers are returned as-is (numbers are stringified);
 * structured `Value` objects are serialised via `valueToString`.
 */
export function toCssValue(value: string | number | Value): string {
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number") {
    return value.toString();
  }
  return valueToString(value);
}

/**
 * Resolves a raw token value string to its final CSS representation.
 *
 * - If the value does not start with `$`, it is parsed and resolved through
 *   the resolver's `resolve` method (handles composite values such as shadows).
 * - If the value starts with `$`, it is treated as a token reference and
 *   resolved to a `var(--…)` expression via `resolveTokenRef`.
 *
 * Throws when the value is an invalid token reference syntax.
 */
export function resolveValueWithResolver(
  value: string | number,
  tokenResolver: TokenResolver
): string | number {
  const text = String(value);

  if (!text.startsWith("$")) {
    const parsed = parseValue(text);
    if (parsed.isValid && parsed.value) {
      return toCssValue(tokenResolver.resolve(parsed.value));
    }
    return value;
  }

  const parsed = parseValue(text);
  if (!(parsed.isValid && parsed.value)) {
    throw new Error(`Invalid token reference: ${text}`);
  }

  return tokenResolver.resolveTokenRef(parsed.value as TokenRef);
}
