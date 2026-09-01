# project-css

## Goal

Provide a canonical set of design tokens as CSS custom properties and a Tailwind v4 configuration, so that all cocso apps and packages share a single visual language without JavaScript dependencies.

## Path

```
packages/css/
```

## Runtime and Language

Plain CSS. No build step required.

## Users

- `@cocso-ui/react` — consumes token variables in component stylesheets.
- `apps/storybook` — imports token CSS for accurate component rendering.
- `apps/website` — imports token CSS and Tailwind layer.
- Any external consumer of the `@cocso-ui/css` npm package.

## In Scope

- `token.css` — all design tokens as CSS custom properties (`--cocso-*` namespace).
- `tailwind4.css` — Tailwind v4 theme configuration referencing token variables.
- Token categories: color (primitive + semantic), spacing, typography, border radius, shadow.

## Out of Scope

- Component-level styles — owned by `@cocso-ui/react`.
- JavaScript token exports — not provided; use CSS custom properties directly.

## Architecture

```
packages/css/
├── token.css        # All design tokens (--cocso-* CSS custom properties)
├── tailwind4.css    # Tailwind v4 theme layer
└── package.json     # Exports map
```

Token prefix convention: `--cocso-<category>-<scale>` (e.g. `--cocso-color-neutral-500`, `--cocso-color-white`).

### Semantic Token Naming Convention

Semantic tokens follow the pattern `--cocso-{category}-{role}` and map to exactly one primitive token or direct value in light mode. Color semantic tokens include `color` in the category (e.g. `--cocso-color-text-primary`). Non-color semantic tokens omit it (e.g. `--cocso-shadow-card`, `--cocso-duration-fast`).

**Categories and roles:**

| Category | Role examples | Purpose |
|---|---|---|
| `text` | `primary`, `secondary`, `tertiary`, `disabled`, `muted`, `on-primary`, `on-success`, `on-danger`, `on-info`, `on-warning` | Text and label colors |
| `surface` | `primary`, `secondary`, `inverse`, `neutral` | Background layer hierarchy |
| `border` | `primary`, `secondary` | Container and separator strokes |
| `interactive` | `primary`, `primary-hover`, `primary-active`, `primary-muted`, `secondary`, `secondary-hover`, `danger`, `danger-hover`, `danger-active`, `danger-hover-subtle`, `success`/`warning`/`info` (same pattern) | Actionable element fills across state variants |
| `focus` | `ring` | Focus indicator colors |
| `feedback` | `danger`, `danger-subtle`, `danger-text`, `danger-border`, `success`/`warning`/`info` (same pattern), `success-muted` | Status communication (errors, warnings, confirmations) |
| `alpha` | `shadow1`, `shadow2`, `shadow3` | Semi-transparent overlay values |
| `shadow` | `thumb`, `card`, `dropdown`, `popover`, `dialog` | Surface elevation levels |
| `duration` | `fast`, `normal`, `slow`, `decorative`, `decorative-slow` | Transition/animation timing |
| `easing` | `default`, `soft`, `entrance`, `accordion` | Transition/animation curves |

**Status:** 70 semantic tokens defined (56 color + 5 shadow + 5 duration + 4 easing). All 19 recipes reference semantic color tokens exclusively (primitive direct reference: 0). All CSS module shadow and motion values reference semantic tokens.

**Rules:**
- Roles must be descriptive: `primary`, `secondary`, `tertiary`, `inverse`, `hover`, `active`, `disabled`, `subtle`, `muted`, etc.
- Each semantic token maps to exactly one primitive token in light mode.
- Do not use numeric scales for semantic tokens (that is the primitive pattern).
- New recipes must use semantic tokens only — primitive direct references are not allowed.

### Contrast

Measured against the light theme's `surface-primary` (`#ffffff`) and `surface-secondary` (`#f4f5f6`), and the dark theme's equivalents (`#131416`, `#1e2124`):

| Token | Light on primary | Light on secondary | Dark on primary | Dark on secondary |
|---|---|---|---|---|
| `text-primary` | 18.43 | 16.89 | 16.89 | 14.82 |
| `text-secondary` | 6.30 | 5.77 | 5.98 | 5.25 |
| `text-tertiary` | 3.08 | 2.82 | 4.09 | 3.59 |
| `text-muted` | 4.51 | 4.13 | 4.09 | 3.59 |
| `feedback-*` 500-level | ~4.6 | ~4.2 | — | — |
| `feedback-*` 600-level | ~6.0 | ~5.5 | — | — |

**Rules:**
- Body-size text (anything under 24px, or under 18.66px bold) may only use `text-primary` or `text-secondary`. Those are the only tiers that clear WCAG AA (4.5:1) on every surface in both themes.
- `text-tertiary` and `text-muted` do not clear AA for body text on any surface. They are for large text (3:1) and for non-text graphics such as spinner blades and progress fills, where WCAG 1.4.11 asks for 3:1. Components MUST NOT use them for essential text.
- `text-disabled` is exempt: WCAG 1.4.3 excludes inactive components.
- Status colors: use the 600-level token for text (`feedback-danger-text` and friends) and reserve the 500-level for filled surfaces, where the contrast that matters is against the white foreground on top. The 500 level clears AA on white by a margin under 0.1 and drops below it on `surface-secondary`.
- A foreground for a fill MUST NOT flip with the theme unless its fill flips too. `text-on-primary` flips because `interactive-primary` flips; the fixed-hue fills (`interactive-success`, `-danger`, `-info`, `-warning`) keep their value in both themes, so they have their own `text-on-*` foregrounds that are identical in light and dark. Pairing a flipping foreground with a fixed fill put near-white text on bright amber at 1.67:1.
- An interactive state that darkens a fill without moving its foreground walks the pairing toward the threshold. `button` `secondary` crossed it on hover and again when pressed, so its label steps to `text-primary` for both.
- The neutral ramp has no step that would give a third AA-conformant text tier: in the light theme it would have to be at least `neutral-600` (already `text-secondary`), and in the dark theme at most `neutral-400` (already `text-secondary`). Adding one means extending the ramp, not remapping the semantic layer — see Roadmap.

## Interfaces

Package exports:

| Export path | File | Description |
|---|---|---|
| `@cocso-ui/css/token.css` | `token.css` | Design token custom properties |
| `@cocso-ui/css/tailwind4.css` | `tailwind4.css` | Tailwind v4 theme |
| `@cocso-ui/css/*.css` | `*.css` | Any CSS file in package root |

## Storage

Static CSS files only. No runtime state.

## Security

No scripts or network access. Pure CSS file distribution.

## Logging

Not applicable.

## Build and Test

No build step. Files are published as-is.

```sh
# Lint
pnpm --filter @cocso-ui/css lint
```

## Roadmap

- ~~Semantic color token layer~~ — Complete. 52 semantic color tokens, all 19 recipes migrated.
- ~~Semantic shadow + motion token layer~~ — Complete. 5 shadow tokens + 9 motion tokens (5 duration + 4 easing). All CSS modules migrated.
- Typography semantic tokens — requires recipe type system changes (`fontSize: TypographyTokenRef | number`). Separate PR.
- Document token inventory in `apps/website`.
- Add dark mode overrides for semantic tokens via `light-dark()` CSS function or `[data-theme="dark"]` attribute.
- Input/select/OTP ring+elevation composite shadow patterns — needs dedicated semantic tokens (follow-up).
- A third AA-conformant text tier. `text-tertiary` and `text-muted` cannot carry body text in either theme, and no existing neutral step can replace them without collapsing into `text-secondary`. Requires new primitive steps between `neutral-400` and `neutral-600` (light) and around `neutral-450` (dark), so it is a ramp change with consumer impact, not a semantic remap.

## Open Questions

- None at this time.
