import { parseValue, valueToString } from "../../parsers";
import type { TokenResolver } from "../../transforms/resolve";
import type { TokenRef, Value } from "../../types";

export function toCssValue(value: string | number | Value): string {
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number") {
    return value.toString();
  }
  return valueToString(value);
}

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
