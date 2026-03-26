// ---------------------------------------------------------------------------
// Token Reference Types
// ---------------------------------------------------------------------------

/** Color token names matching baseframe YAML / CSS custom properties. */
export type ColorTokenRef =
  | "transparent"
  | "white"
  | "black"
  | `${"neutral" | "primary" | "danger" | "warning" | "success" | "info"}-${50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950}`
  | `${"white" | "black"}-alpha-${5 | 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90}`
  | "text-primary"
  | "text-secondary"
  | "text-tertiary";

/** Border radius token names. */
export type RadiusTokenRef =
  | "radius-1"
  | "radius-2"
  | "radius-3"
  | "radius-4"
  | "radius-5"
  | "radius-6"
  | "radius-full";

/** Spacing token names. */
export type SpacingTokenRef = `spacing-${number}` | "spacing-max";

/** Font weight names mapping to numeric values. */
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

// ---------------------------------------------------------------------------
// Literal and Compound Values
// ---------------------------------------------------------------------------

/** CSS literal values that pass through resolvers unchanged. */
export type CSSLiteral =
  | "none"
  | "transparent"
  | "currentColor"
  | "100%"
  | "inherit";

/** Compound border value (e.g., "1px solid neutral-100"). */
export interface CompoundBorder {
  color: ColorTokenRef;
  style: "solid";
  width: number;
}

/** Cross-component variant reference (e.g., Button → Spinner variant). */
export interface ComponentRef<T extends string = string> {
  component: string;
  variant: T;
}

// ---------------------------------------------------------------------------
// StyleValue — the full union of possible recipe style values
// ---------------------------------------------------------------------------

export type StyleValue =
  | ColorTokenRef
  | RadiusTokenRef
  | SpacingTokenRef
  | FontWeightRef
  | CSSLiteral
  | number
  | CompoundBorder
  | ComponentRef;

/** Style properties for a single slot. Keys are CSS custom property suffixes. */
export type SlotStyles = Record<string, StyleValue>;

// ---------------------------------------------------------------------------
// Recipe Definition
// ---------------------------------------------------------------------------

/** A single compound variant: applies styles when all conditions match. */
export interface CompoundVariant<
  V extends Record<string, Record<string, SlotStyles>>,
  S extends string,
> {
  conditions: {
    [K in keyof V]?: keyof V[K] | (keyof V[K])[];
  };
  styles: Partial<Record<S, SlotStyles>>;
}

/** Full recipe definition. */
export interface RecipeDefinition<
  V extends Record<string, Record<string, SlotStyles>> = Record<
    string,
    Record<string, SlotStyles>
  >,
  S extends string = string,
> {
  /** Base styles always applied to each slot. */
  base?: Partial<Record<S, SlotStyles>>;

  /** Styles applied when multiple variant conditions match simultaneously. */
  compoundVariants?: CompoundVariant<V, S>[];

  /** Default variant values. */
  defaultVariants?: { [K in keyof V]?: keyof V[K] };

  /** Component name (used as CSS custom property prefix). */
  name: string;

  /** Named sub-elements of the component. */
  slots: readonly S[];

  /** State overrides (hover, active, disabled, focus, error). */
  states?: Record<
    string,
    Partial<Record<keyof V[keyof V], Partial<Record<S, SlotStyles>>>>
  >;

  /** Variant dimensions. Each dimension maps variant values to slot styles. */
  variants: V;
}

// ---------------------------------------------------------------------------
// Token Catalog — maps canonical token names to CSS var references
// ---------------------------------------------------------------------------

/** Maps token names to their CSS custom property references. */
export interface TokenCatalog {
  resolveColor(name: ColorTokenRef): string;
  resolveFontWeight(name: FontWeightRef): number;
  resolveRadius(name: RadiusTokenRef): string;
  resolveSpacing(name: SpacingTokenRef): string;
}
