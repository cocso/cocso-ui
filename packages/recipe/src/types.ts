export type ColorTokenRef =
  | "transparent"
  | "white"
  | "black"
  | `${"neutral" | "primary" | "danger" | "warning" | "success" | "info"}-${50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950}`
  | `${"white" | "black"}-alpha-${5 | 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90}`
  | "text-primary"
  | "text-secondary"
  | "text-tertiary";

export type RadiusTokenRef =
  | "radius-1"
  | "radius-2"
  | "radius-3"
  | "radius-4"
  | "radius-5"
  | "radius-6"
  | "radius-full";

export type SpacingTokenRef = `spacing-${number}` | "spacing-max";

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

export type StyleValue =
  | ColorTokenRef
  | RadiusTokenRef
  | SpacingTokenRef
  | FontWeightRef
  | CSSLiteral
  | number
  | CompoundBorder
  | ComponentRef;

export type SlotStyles = Record<string, StyleValue>;

export interface CompoundVariant<
  V extends Record<string, Record<string, Partial<Record<S, SlotStyles>>>>,
  S extends string,
> {
  conditions: {
    [K in keyof V]?: keyof V[K] | (keyof V[K])[];
  };
  styles: Partial<Record<S, SlotStyles>>;
}

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
