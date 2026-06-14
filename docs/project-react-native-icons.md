# project-react-native-icons

## Goal

Provide a tree-shakable set of SVG icons as React Native components using `react-native-svg`, giving mobile product teams a consistent icon vocabulary aligned with the cocso design system.

## Path

```
packages/react-native-icons/
```

## Runtime and Language

React Native (TypeScript), bundled via Rollup into CJS and ESM. Requires `react-native-svg` as a peer dependency.

## Users

- Mobile engineers consuming `@cocso-ui/react-native-icons` in React Native apps.
- Expo projects using `react-native-svg`.

## In Scope

- Re-export of all generated React Native icon components from `@cocso-ui/icons/react-native`.
- Dual package output: CJS (`dist/cjs/`) and ESM (`dist/esm/`).
- Full tree-shaking support (`sideEffects: false`).

## Out of Scope

- Icon SVG sources, metadata, or code generation — owned by `@cocso-ui/icons`.
- Icon design or SVG authoring.
- Web React icon components — owned by `@cocso-ui/react-icons`.
- Expo vector icon font integration.

## Architecture

```
packages/react-native-icons/
├── src/
│   └── index.ts              # Re-exports from @cocso-ui/icons/react-native
├── dist/
│   ├── cjs/                  # CommonJS bundle (single file)
│   └── esm/                  # ESM bundle (single file)
├── rollup.config.cjs         # Build configuration
└── tsconfig.json
```

Build pipeline: `src/index.ts` re-exports `@cocso-ui/icons/react-native` → Rollup resolves and bundles all generated TSX components from `@cocso-ui/icons/dist/react-native/` → CJS + ESM + `.d.ts` output.

`@cocso-ui/icons` is a `devDependency` so Rollup bundles the components inline rather than marking them as external. Consumers of the published package do not need `@cocso-ui/icons` installed.

## Interfaces

Public entry point: `@cocso-ui/react-native-icons`

All icons exported as named React Native components:

```tsx
import { SearchIcon, CheckIcon, COCSOLogo } from '@cocso-ui/react-native-icons';

<SearchIcon size={24} color="#000" />
```

Each component accepts `IconProps`:

```ts
import type { SvgProps } from 'react-native-svg';

type IconProps = {
  size?: number | string;
  width?: number | string;
  height?: number | string;
} & Omit<SvgProps, 'width' | 'height'>;
```

The `color` prop (inherited from `SvgProps`) controls `currentColor` resolution in child SVG elements.

## Storage

No runtime storage. Build output written to `dist/`.

## Security

- No network calls.
- No secrets or credentials handled.
- Peer dependencies: `react >=18.0.0`, `react-native >=0.72.0`, `react-native-svg >=13.0.0`.

## Logging

Not applicable.

## Build and Test

```sh
# Build (CJS + ESM)
pnpm --filter @cocso-ui/react-native-icons build

# Lint
pnpm --filter @cocso-ui/react-native-icons lint
```

CI expects: `build`, `lint` to pass.

## Roadmap

- Add example app or Storybook React Native integration for visual testing.
- Consider Expo Snack examples for documentation.

## Open Questions

- None at this time.
