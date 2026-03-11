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

- Add semantic token layer (e.g. `--cocso-color-surface-primary`).
- Document token inventory in `apps/website`.

## Open Questions

- None at this time.
