---
"@cocso-ui/react": patch
"@cocso-ui/css": minor
---

Make component surfaces follow the theme.

`theme-dark.css` redefines the semantic layer and deliberately leaves the raw scale alone, so a primitive color written into a CSS Module keeps its value when the theme flips. Six components did that, and two of them broke outright in the dark theme:

- **`Dialog`** painted its panel `--cocso-color-white` with a `neutral-100` border. The panel stayed white on a dark page while its text followed the theme to near-white, leaving the content unreadable.
- **`Switch`** painted its knob `--cocso-color-white`. The dark theme's checked track is near-white, so the knob sat at **1.09:1** and disappeared when the switch was on. It now uses `text-on-primary` — the foreground that belongs on a fill — which is 18.43:1 in light and 16.89:1 in dark.
- **`Input`**, **`Select`**, and **`InputTrigger`** painted a white field background, a `neutral-950` value, `neutral-100` and `danger-500` rings and a `neutral-50` read-only fill.
- **`Pagination`** hardcoded the active page's white label on a `primary-950` fill, overriding what its own recipe already declared semantically, plus `neutral-50`/`neutral-100` hover and pressed fills.
- **`DayPicker`** hardcoded `info-600` and `danger-600`.

Every one moves to the semantic token that resolves to the same value in the light theme, so light rendering is unchanged.

Two placeholders were also below WCAG AA in the light theme: `Input` and `InputTrigger` rendered placeholder text in `neutral-400`, which is 3.08:1 on white. Both now use `text-secondary` (6.30:1 light, 5.98:1 dark).

New `--cocso-color-border-strong` carries the field focus ring, which had no semantic token at its value. It is `neutral-400` in the light theme and `neutral-500` in the dark one — `neutral-600` would be 2.93:1 against the dark surface, under the 3:1 WCAG 1.4.11 asks of a focus indicator.

A test now scans every CSS Module for primitive colors — no exceptions — so this class of defect cannot be reintroduced silently.
