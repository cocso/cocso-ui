# project-react

## Goal

Provide a React component library that implements the cocso design system, giving product teams a consistent, accessible, and composable set of UI primitives built on React 19.

## Path

```
packages/react/
```

## Runtime and Language

React 19 (TypeScript), bundled via Rollup into CJS and ESM.

## Users

- Frontend engineers consuming `@cocso-ui/react` in product apps.
- Storybook and website apps within this monorepo.

## In Scope

- UI components: Accordion, Badge, Button, Checkbox, DayPicker, Dropdown, Link, Modal, MonthPicker, OneTimePasswordField, Pagination, Popover, RadioGroup, Select, Spinner, StockQuantityStatus, Switch, Tab, Toast, Typography.
- Design token integration via CSS custom properties from `@cocso-ui/css`.
- Utility: `cn` helper for conditional className composition (clsx + tailwind-merge).
- Dual package output: CJS (`dist/cjs/`) and ESM (`dist/esm/`).
- Bundled CSS stylesheet exported at `@cocso-ui/react/styles.css`.

## Out of Scope

- Application-level business logic or state management.
- Icon components — handled by `@cocso-ui/react-icons`.
- Design tokens — owned by `@cocso-ui/css`.

## Architecture

```
packages/react/src/
├── components/           # Styled components (one directory per component)
│   └── <component>/
│       ├── index.ts      # Public export
│       ├── *.tsx         # Component implementation
│       └── *.module.css  # CSS Modules styling
├── primitives/           # Headless library re-exports (@base-ui/react)
│   ├── accordion.ts      # export { Accordion } from "@base-ui/react/accordion"
│   └── ...               # One file per primitive module
├── token/                # Design token type declarations (typography, color, radius, spacing)
├── cn.ts                 # className utility (clsx + tailwind-merge)
└── index.ts              # Barrel export
```

Components import headless primitives via `../../primitives/*`, never directly from `@base-ui/react`. This indirection isolates the headless library dependency so that switching providers only requires updating the `primitives/` directory.

Build pipeline: Rollup → Babel (React + TypeScript presets) → CJS + ESM bundles + `.d.ts` declarations.

## Interfaces

Public entry point: `@cocso-ui/react`

```ts
// Named exports
export { Button } from './components/button'
export { Modal } from './components/modal'
// ... all components
export { cn } from './cn'
```

CSS entry point: `@cocso-ui/react/styles.css`

## Storage

No runtime storage. Build output written to `dist/`.

## Security

- No network calls.
- No secrets or credentials handled.
- Peer dependency on React 19 — consumers must supply their own React runtime.

## Logging

No runtime logging. Development warnings surfaced via React prop-types patterns or TypeScript types.

## Build and Test

```sh
# Build (CJS + ESM)
pnpm --filter @cocso-ui/react build

# Run tests (Vitest + Testing Library)
pnpm --filter @cocso-ui/react test

# Lint
pnpm --filter @cocso-ui/react lint
```

CI expects: `build`, `test`, `lint` to all pass.

## Roadmap

- Expand component coverage aligned with design system updates.
- Add visual regression tests via Storybook.

## Open Questions

- None at this time.
