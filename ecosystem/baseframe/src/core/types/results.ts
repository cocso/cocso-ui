import type { Value } from "./domain";

/**
 * The outcome of attempting to parse a raw token value string.
 * On success `isValid` is `true` and `value` holds the structured result.
 * On failure `isValid` is `false` and `error` describes the problem.
 */
export interface ParseResult {
  /** Human-readable error message when parsing fails. */
  error?: string;
  /** `true` when the input was recognised and parsed successfully. */
  isValid: boolean;
  /** Structured value produced by a successful parse. */
  value?: Value;
}

/**
 * A single validation failure produced during schema or token validation.
 * The `type` discriminant identifies the failure category; the remaining
 * fields provide context for error reporting.
 */
export interface ValidationError {
  /** Name of the collection in which the error occurred, if applicable. */
  collection?: string;
  /** Human-readable description of the error. */
  message: string;
  /** Mode name where the error was detected, if applicable. */
  mode?: string;
  /** Name of the token that triggered the error, if applicable. */
  tokenName?: string;
  /**
   * Machine-readable error category:
   * - `INVALID_COLLECTION` — the collection name is unrecognised or malformed.
   * - `MISSING_MODE` — a required mode is absent from a token's value map.
   * - `INVALID_TOKEN_FORMAT` — the token name does not conform to the expected format.
   * - `INVALID_VALUE_FORMAT` — the raw value string could not be parsed.
   * - `INVALID_PRIMITIVE_TOKEN` — the token references an unknown primitive.
   */
  type:
    | "INVALID_COLLECTION"
    | "MISSING_MODE"
    | "INVALID_TOKEN_FORMAT"
    | "INVALID_VALUE_FORMAT"
    | "INVALID_PRIMITIVE_TOKEN";
  /** The raw value that caused the error, if applicable. */
  value?: string | number;
}

/**
 * The aggregate result of validating a set of token declarations.
 * Consumers should check `isValid` first; if `false`, inspect `errors`.
 * Non-fatal issues are surfaced through `warnings`.
 */
export interface ValidationResult {
  /** All validation errors found; empty when `isValid` is `true`. */
  errors: ValidationError[];
  /** `true` when no errors were found (warnings may still be present). */
  isValid: boolean;
  /** Non-fatal advisory messages that do not fail validation. */
  warnings: string[];
}
