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

Semantic tokens follow the pattern `--cocso-color-{category}-{role}` and map to exactly one primitive token in light mode.

**Categories and roles:**

| Category | Role examples | Purpose |
|---|---|---|
| `text` | `primary`, `secondary`, `tertiary`, `disabled`, `on-primary`, `muted` | Text and label colors |
| `surface` | `primary`, `secondary`, `inverse`, `neutral` | Background layer hierarchy |
| `border` | `primary`, `secondary` | Container and separator strokes |
| `interactive` | `primary`, `primary-hover`, `primary-active`, `primary-muted`, `secondary`, `secondary-hover`, `danger`, `danger-hover`, `danger-active`, `danger-hover-subtle`, `success`/`warning`/`info` (same pattern) | Actionable element fills across state variants |
| `focus` | `ring` | Focus indicator colors |
| `feedback` | `danger`, `danger-subtle`, `danger-text`, `danger-border`, `success`/`warning`/`info` (same pattern), `success-muted` | Status communication (errors, warnings, confirmations) |
| `alpha` | `shadow1`, `shadow2`, `shadow3` | Semi-transparent overlay values |

**Status:** 52 semantic color tokens defined (6 text + 4 surface + 2 border + 20 interactive + 1 focus + 17 feedback + 1 transparent + 3 alpha). All 19 recipes reference semantic tokens exclusively (primitive direct reference: 0).

**Rules:**
- Roles must be descriptive: `primary`, `secondary`, `tertiary`, `inverse`, `hover`, `active`, `disabled`, `subtle`, `muted`, etc.
- Each semantic token maps to exactly one primitive token in light mode.
- Do not use numeric scales for semantic tokens (that is the primitive pattern).
- New recipes must use semantic tokens only — primitive direct references are not allowed.

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

- ~~Semantic token layer~~ — Complete. 52 semantic color tokens, all 19 recipes migrated.
- Document token inventory in `apps/website`.
- Add dark mode overrides for semantic tokens via `light-dark()` CSS function or `[data-theme="dark"]` attribute.

## Open Questions

- None at this time.
