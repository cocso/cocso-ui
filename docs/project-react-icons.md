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
- `@cocso-ui/react` — may import icons internally.
- `apps/storybook` — renders icon components for visual testing.

## In Scope

- SVG icon components as named React exports.
- Auto-generated barrel index from SVG sources via `scripts/generate-index-file.mjs`.
- Dual package output: CJS (`dist/cjs/`) and ESM (`dist/esm/`).
- Full tree-shaking support (`sideEffects: false`).

## Out of Scope

- Icon design or SVG authoring — managed externally.
- Non-React icon formats (sprite sheets, font icons).

## Architecture

```
packages/react-icons/
├── src/               # SVG → React component sources
├── scripts/
│   └── generate-index-file.mjs  # Generates src/index.ts from SVG sources
├── dist/
│   ├── cjs/           # CommonJS bundle
│   └── esm/           # ESM bundle
└── rollup.config.cjs  # Build configuration
```

Build pipeline: generate index → Rollup → Babel → CJS + ESM bundles + `.d.ts`.

## Interfaces

Public entry point: `@cocso-ui/react-icons`

All icons exported as named React components:

```ts
import { SomeIcon } from '@cocso-ui/react-icons'
```

## Storage

No runtime storage. Build output written to `dist/`.

## Security

- No network calls.
- No secrets or credentials handled.
- Peer dependency on React 19 and react-dom 19.

## Logging

Not applicable.

## Build and Test

```sh
# Build (generates index then runs Rollup)
pnpm --filter @cocso-ui/react-icons build

# Lint
pnpm --filter @cocso-ui/react-icons lint
```

CI expects: `build`, `lint` to pass.

## Roadmap

- Add visual snapshot tests for icons in Storybook.

## Open Questions

- None at this time.
