---
"@cocso-ui/react": minor
"@cocso-ui/css": minor
---

Make selection and focus colors themable, and add the Button/Badge/Typography variants that consumers were reproducing with `!important` utilities.

**RadioGroup / Checkbox — tokens now actually reach the component**

`RadioGroup.Item`, `RadioGroup.Indicator`, and the Checkbox focus ring hardcoded `--cocso-color-primary-950` inside CSS Modules, so a `--cocso-color-primary-*` override in a consumer `:root` did not reach them. The values now come from component-scoped custom properties emitted by the recipe:

- `--cocso-radio-checked-color`, `--cocso-radio-border-color`, `--cocso-radio-bg-color`, `--cocso-radio-focus-ring-color`
- `--cocso-checkbox-focus-ring-color`

Both components also expose stable override hooks per the Component Override Contract: `data-cocso-component="radio-item"`, `"radio-indicator"`, `"checkbox"`, `"checkbox-control"`. Consumers matching content-hashed class names (`[class*='radio-group-module_item']`) can drop those selectors.

Button, Link, Switch, and Pagination focus outlines now read `--cocso-color-focus-ring` instead of `--cocso-color-primary-950`. Same value in the light theme; the dark theme now gets a visible ring.

**Button**

- New `variant="neutral"` — filled neutral surface for quiet actions.
- New `variant="error-ghost"` — destructive text/ghost action (transparent fill, danger text, tinted hover).
- New `shape="sharp"` — square corners for menu rows and list items.
- New `align` prop (`"center" | "start" | "between"`, default `"center"`) controlling label alignment.

**Badge**

- New `variant="primary-subtle"` — tinted background with primary-toned text, for lists where the filled primary badge is too loud.

**Typography**

- New `level` prop on `type="heading"` (`1`–`6`, default `2`) that selects the rendered `h1`–`h6` independently of the visual `size`, replacing `render={<h1>{title}</h1>}` for the common case.
- `type="heading"` now accepts any size from the font scale in addition to the named steps, so `size={18}` is a heading rather than a reason to fall back to `type="custom"`. The named steps are unchanged. The scale has no section-heading step — `small` is 16, the same size as `body` `medium` — so consumers were reaching for `type="custom" size={18} weight="bold"`, which renders a `<p>` and drops the text out of the document outline.
- Documented that Typography sets no colour of its own: without `color`, every mode inherits from the nearest ancestor that sets one. A consumer adding a dark theme found hardcoded ancestor colours surviving the switch at 1.14:1.

**Tokens (`@cocso-ui/css`)**

Added semantic tokens with light and dark values: `interactive-primary-subtle`, `interactive-primary-text`, `interactive-neutral`, `interactive-neutral-hover`, `interactive-neutral-active`, `interactive-danger-subtle-hover`, `interactive-danger-subtle-active`.

The `--cocso-color-primary-*` ramp keeps its default alias to `neutral-*` — this release documents it as the supported theming entry point rather than changing it.

**Floating positioner override hooks**

`Dropdown`, `Popover`, and `Tooltip` now set `data-cocso-component="dropdown-positioner"`, `"popover-positioner"`, and `"tooltip-positioner"` on their `Positioner`. The positioner owns the stacking context, so a `z-index` on the popup alone is ignored — previously the only way to escape the z-index scale was matching a content-hashed class name (`[class*='_positioner__']`).
