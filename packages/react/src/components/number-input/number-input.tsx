"use client";

import type { ChangeEvent, FocusEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { Input, type InputProps } from "../input";

const NON_NUMERIC = /[^0-9.]/g;
const ALL_POINTS = /\./g;
const LEADING_ZEROS = /^0+(?=\d)/;
const THOUSANDS = /\B(?=(\d{3})+(?!\d))/g;
const GROUP_SEPARATORS = /,/g;
const NUMERIC_CHAR = /[0-9.]/;

/**
 * Keeps digits and the decimal point, plus a leading `-`.
 *
 * With `maxFractionDigits` 0 the point is dropped; otherwise only the first
 * point survives and the fraction is cut to length. Leading zeros on the
 * integer part go too, so typing after a prefilled `0` gives `5`, not `05`.
 */
function sanitizeNumeric(raw: string, maxFractionDigits: number) {
  const sign = raw.trimStart().startsWith("-") ? "-" : "";
  let cleaned = raw.replace(NON_NUMERIC, "");

  if (maxFractionDigits === 0) {
    cleaned = cleaned.replace(ALL_POINTS, "");
  } else {
    const dot = cleaned.indexOf(".");
    if (dot !== -1) {
      const integer = cleaned.slice(0, dot);
      const fraction = cleaned
        .slice(dot + 1)
        .replace(ALL_POINTS, "")
        .slice(0, maxFractionDigits);
      cleaned = `${integer}.${fraction}`;
    }
  }
  // "0123" becomes "123"; the zero in "0" and "0.5" stays.
  cleaned = cleaned.replace(LEADING_ZEROS, "");
  return `${sign}${cleaned}`;
}

/** Groups the integer part in thousands. The sign and fraction are kept as they are. */
function formatWithGrouping(numeric: string) {
  const sign = numeric.startsWith("-") ? "-" : "";
  const [integer = "", fraction] = numeric.slice(sign.length).split(".");
  const grouped = integer.replace(THOUSANDS, ",");
  return fraction === undefined
    ? `${sign}${grouped}`
    : `${sign}${grouped}.${fraction}`;
}

/** Display text to a number; `null` when it is empty or not yet a number. */
function parseNumeric(display: string): number | null {
  const numeric = display.replace(GROUP_SEPARATORS, "");
  if (numeric === "" || numeric === "." || numeric === "-") {
    return null;
  }
  const parsed = Number(numeric);
  return Number.isNaN(parsed) ? null : parsed;
}

function toDisplay(value: number | null | undefined) {
  return value == null ? "" : formatWithGrouping(String(value));
}

export interface NumberInputProps
  extends Omit<
    InputProps,
    "type" | "value" | "defaultValue" | "onChange" | "passwordToggle"
  > {
  /** Decimal places a user may type. `0`, the default, is a whole amount. */
  maxFractionDigits?: number;
  /** The parsed number on every edit, or `null` when the field is empty. */
  onValueChange: (value: number | null) => void;
  /** The current number. `null` or `undefined` shows an empty field. */
  value: number | null | undefined;
}

/**
 * An `Input` for amounts, grouped in thousands as the user types.
 *
 * It is a text field with `inputMode`, not `type="number"`: a native number
 * input cannot display a separator. The caret is put back after the same digit
 * when a comma is inserted or removed in front of it.
 *
 * Defaults to the `small` size and the full width of its container, the shape
 * the field had where it came from; both can be overridden.
 *
 * @example
 * <Controller
 *   control={control}
 *   name="amount"
 *   render={({ field }) => (
 *     <NumberInput
 *       aria-label="금액"
 *       onBlur={field.onBlur}
 *       onValueChange={field.onChange}
 *       value={field.value}
 *     />
 *   )}
 * />
 */
export function NumberInput({
  value,
  onValueChange,
  maxFractionDigits = 0,
  onBlur,
  size = "small",
  stretch = true,
  ...props
}: NumberInputProps) {
  // An external value is formatted as given; the fraction limit applies to
  // what is typed, not to what the caller supplies.
  const [draft, setDraft] = useState(() => toDisplay(value));
  // What this field last reported, to tell its own edits from a caller's reset.
  const lastEmitted = useRef<number | null>(value ?? null);
  const frame = useRef<number | null>(null);

  // Only a value that did not come from this field rewrites the text, so an
  // intermediate state like "1." survives the re-render its own edit causes.
  useEffect(() => {
    const next = value ?? null;
    if (next === lastEmitted.current) {
      return;
    }
    lastEmitted.current = next;
    setDraft(toDisplay(next));
  }, [value]);

  useEffect(
    () => () => {
      if (frame.current !== null) {
        cancelAnimationFrame(frame.current);
      }
    },
    []
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const el = event.currentTarget;
    const caret = el.selectionStart ?? el.value.length;
    // Count the digits before the caret, then put it back after the same digit
    // once the commas have moved.
    const digitsBeforeCaret = el.value
      .slice(0, caret)
      .replace(NON_NUMERIC, "").length;

    const numeric = sanitizeNumeric(el.value, maxFractionDigits);
    const formatted = formatWithGrouping(numeric);
    setDraft(formatted);

    const parsed = parseNumeric(numeric);
    lastEmitted.current = parsed;
    onValueChange(parsed);

    if (frame.current !== null) {
      cancelAnimationFrame(frame.current);
    }
    frame.current = requestAnimationFrame(() => {
      frame.current = null;
      let position = formatted.startsWith("-") ? 1 : 0;
      let count = 0;
      while (position < formatted.length && count < digitsBeforeCaret) {
        if (NUMERIC_CHAR.test(formatted.charAt(position))) {
          count += 1;
        }
        position += 1;
      }
      if (document.activeElement === el) {
        el.setSelectionRange(position, position);
      }
    });
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    // Tidy what typing leaves behind: a trailing point, a lone sign.
    setDraft((previous) => {
      const trimmed = previous.endsWith(".") ? previous.slice(0, -1) : previous;
      return trimmed === "-" ? "" : trimmed;
    });
    onBlur?.(event);
  };

  return (
    <Input
      autoComplete="off"
      data-cocso-component="number-input"
      inputMode={maxFractionDigits > 0 ? "decimal" : "numeric"}
      size={size}
      stretch={stretch}
      {...props}
      onBlur={handleBlur}
      onChange={handleChange}
      type="text"
      value={draft}
    />
  );
}
