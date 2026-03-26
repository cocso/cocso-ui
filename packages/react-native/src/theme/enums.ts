export const RN_MODAL_PRESENTATION = {
  FULL_SCREEN: "fullScreen",
  PAGE_SHEET: "pageSheet",
  FORM_SHEET: "formSheet",
  OVER_FULL_SCREEN: "overFullScreen",
} as const;

export type RNModalPresentation =
  (typeof RN_MODAL_PRESENTATION)[keyof typeof RN_MODAL_PRESENTATION];

export const GLASS_INTENSITY = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
} as const;

export type GlassIntensity =
  (typeof GLASS_INTENSITY)[keyof typeof GLASS_INTENSITY];

export const BUTTON_VARIANT = {
  PRIMARY: "primary",
  SECONDARY: "secondary",
  GHOST: "ghost",
} as const;

export type ButtonVariant =
  (typeof BUTTON_VARIANT)[keyof typeof BUTTON_VARIANT];
