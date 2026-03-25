# project-react-native-icons

## Goal

Provide a React Native icon package with full parity to `@cocso-ui/react-icons`, so Expo and React Native apps can consume the same icon names without web SVG runtime dependencies.

## Path

```text
packages/react-native-icons/
```

## Runtime and Language

React Native + TypeScript (`react-native-svg`).

## Users

- Mobile engineers consuming `@cocso-ui/react-native`.
- Teams that need icon-name parity between web (`@cocso-ui/react-icons`) and native.

## In Scope

- Full icon parity for all semantic and brand icons from `@cocso-ui/react-icons`.
- RN icon rendering through generated `react-native-svg` component trees.
- Grouped exports by `semantic` and `brand`, plus top-level barrel export.
- Automated source sync script from `packages/react-icons/src/components/**/*.tsx`.

## Out of Scope

- Replacing `@cocso-ui/react-icons` as the source package.
- Introducing a new global SVG truth source in this PR.
- Web icon runtime behavior changes.

## Architecture

```text
packages/react-native-icons/
├── scripts/
│   └── generate-icons.mjs
├── src/
│   ├── components/
│   │   ├── semantic/
│   │   └── brand/
│   ├── icon.tsx
│   ├── types.ts
│   └── index.ts
└── package.json
```

## Interfaces

- Package name: `@cocso-ui/react-native-icons`
- Public icon props: `size`, `width`, `height`, `color` plus `SvgProps`
- Export parity contract: all icon component names from `@cocso-ui/react-icons` must exist with the same export names.

## Storage

- Generated TSX icon files committed in repository.
- No runtime storage.

## Security

- No network calls.
- No secret handling.

## Logging

- Script-level console output for generated file counts and sync status.

## Build and Test

```sh
pnpm --filter @cocso-ui/react-native-icons lint
pnpm --filter @cocso-ui/react-native-icons check-types
pnpm --filter @cocso-ui/react-native-icons build
```

## Roadmap

- Evaluate a shared raw-SVG source of truth for web/native generation.
- Add visual snapshot checks for high-risk brand icons.

## Open Questions

- Whether to move all icon generation to an `ecosystem/` pipeline in a dedicated follow-up.
