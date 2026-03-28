/** Design token reference for color values (e.g., `"primary-500"`, `"neutral-100"`). */
export type ColorTokenRef =
  | "transparent"
  | "white"
  | "black"
  | `${"neutral" | "primary" | "danger" | "warning" | "success" | "info"}-${50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950}`
  | `${"white" | "black"}-alpha-${5 | 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90}`
  | "text-primary"
  | "text-secondary"
  | "text-tertiary";

/** Design token reference for border radius values (e.g., `"radius-2"`, `"radius-full"`). */
export type RadiusTokenRef =
  | "radius-1"
  | "radius-2"
  | "radius-3"
  | "radius-4"
  | "radius-5"
  | "radius-6"
  | "radius-full";

/** Design token reference for spacing values (e.g., `"spacing-4"`, `"spacing-max"`). */
export type SpacingTokenRef = `spacing-${number}` | "spacing-max";

/** Design token reference for font weight values (e.g., `"semibold"`, `"bold"`). */
export type FontWeightRef =
  | "thin"
  | "extralight"
  | "light"
  | "normal"
  | "medium"
  | "semibold"
  | "bold"
  | "extrabold"
  | "black";

/** Raw CSS value string that passes through the resolver unchanged (e.g., `"1px"`, `"none"`, `"inherit"`). */
export type CSSLiteral =
  | "none"
  | "transparent"
  | "currentColor"
  | "100%"
  | "inherit"
  | "0"
  | "inline-flex"
  | "flex"
  | `${number}px`
  | `${number} ${number}px`
  | `${number}px ${number}px`;

/**
 * Compound border style combining a color token, CSS border style, and pixel width.
 * Use `_type: "border"` to distinguish this object from other style values.
 */
export interface CompoundBorder {
  readonly _type: "border";
  color: ColorTokenRef;
  style: "solid";
  width: number;
}

export interface ComponentRef<T extends string = string> {
  component: string;
  variant: T;
}

/** Union of all valid style values accepted by a recipe slot — token refs, CSS literals, numbers, borders, and component refs. */
export type StyleValue =
  | ColorTokenRef
  | RadiusTokenRef
  | SpacingTokenRef
  | FontWeightRef
  | CSSLiteral
  | number
  | CompoundBorder
  | ComponentRef;

/** Map of CSS custom property names to their assigned style token values for a single slot. */
export type SlotStyles = Record<string, StyleValue>;

/** Semantic category for a recipe style property key, used by resolvers to determine value interpretation. */
export type PropertyCategory =
  | "color"
  | "radius"
  | "dimension"
  | "string"
  | "unknown";

export interface CompoundVariant<
  V extends Record<string, Record<string, Partial<Record<S, SlotStyles>>>>,
  S extends string,
> {
  conditions: {
    [K in keyof V]?: keyof V[K] | (keyof V[K])[];
  };
  styles: Partial<Record<S, SlotStyles>>;
}

/**
 * Complete recipe definition describing a component's slots, variants, compound variants,
 * default variant selections, base styles, and interactive state overrides.
 */
export interface RecipeDefinition<
  V extends Record<
    string,
    Record<string, Partial<Record<S, SlotStyles>>>
  > = Record<string, Record<string, Partial<Record<string, SlotStyles>>>>,
  S extends string = string,
> {
  base?: Partial<Record<S, SlotStyles>>;
  compoundVariants?: CompoundVariant<V, S>[];
  defaultVariants?: { [K in keyof V]?: keyof V[K] };
  name: string;
  slots: readonly S[];
  states?: Record<
    string,
    Partial<{
      [K in keyof V]?: Partial<
        Record<string & keyof V[K], Partial<Record<S, SlotStyles>>>
      >;
    }>
  >;
  variants: V;
}
