# project-react-icons

## Goal

Provide a tree-shakable set of SVG icons as React components, giving product teams a consistent icon vocabulary aligned with the cocso design system.

## Path

```
packages/react-icons/
```

## Runtime and Language

React 19 (TypeScript), bundled via Rollup into CJS and ESM.

## Users

- Frontend engineers consuming `@cocso-ui/react-icons` in product apps.
- `@cocso-ui/react` — imports icons internally for component implementations.
- `apps/storybook` — renders icon catalog for visual testing.
- `apps/website` — renders icon gallery with search.

## In Scope

- Re-export of all generated React icon components from `@cocso-ui/icons/react`.
- Dual package output: CJS (`dist/cjs/`) and ESM (`dist/esm/`).
- Full tree-shaking support (`sideEffects: false`).
- Storybook stories for icon catalog (`src/icons.stories.tsx`).

## Out of Scope

- Icon SVG sources, metadata, or code generation — owned by `@cocso-ui/icons`.
- Icon design or SVG authoring.
- Non-React icon formats (sprite sheets, font icons).

## Architecture

```
packages/react-icons/
├── src/
│   ├── index.ts              # Re-exports from @cocso-ui/icons/react
│   └── icons.stories.tsx     # Storybook icon catalog
├── dist/
│   ├── cjs/                  # CommonJS bundle (single file)
│   └── esm/                  # ESM bundle (single file)
└── rollup.config.cjs         # Build configuration
```

Build pipeline: `src/index.ts` re-exports `@cocso-ui/icons/react` → Rollup resolves and bundles all generated TSX components from `@cocso-ui/icons/dist/react/` → CJS + ESM + `.d.ts` output.

`@cocso-ui/icons` is a `devDependency` so Rollup bundles the components inline rather than marking them as external. Consumers of the published package do not need `@cocso-ui/icons` installed.

## Interfaces

Public entry point: `@cocso-ui/react-icons`

All icons exported as named React components:

```ts
import { SearchIcon, CheckIcon, COCSOLogo } from '@cocso-ui/react-icons';
```

Each component accepts `IconProps`:

```ts
type IconProps = {
  size?: number | string;
  width?: number | string;
  height?: number | string;
} & SVGAttributes<SVGElement>;
```

## Storage

No runtime storage. Build output written to `dist/`.

## Security

- No network calls.
- No secrets or credentials handled.
- Peer dependency on React 19.

## Logging

Not applicable.

## Build and Test

```sh
# Build (CJS + ESM)
pnpm --filter @cocso-ui/react-icons build

# Lint
pnpm --filter @cocso-ui/react-icons lint
```

CI expects: `build`, `lint` to pass.

## Roadmap

- Add visual snapshot tests for icons in Storybook.

## Open Questions

- None at this time.
