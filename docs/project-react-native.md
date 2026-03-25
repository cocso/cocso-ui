# project-react-native

## Goal

Provide a React Native-first component package for Expo environments that reuses cocso design tokens and interaction patterns, so mobile apps can ship a consistent design system without depending on web CSS runtime features.

## Path

```text
packages/react-native/
```

## Runtime and Language

React Native + Expo (TypeScript).

## Users

- Mobile engineers building Expo apps that need cocso design-system components.
- Teams sharing design language across `@cocso-ui/react` (web) and React Native.

## In Scope

- Token-driven React Native exports (`colors`, `spacing`, `radius`, `typography`, `shadow`, `zIndex`) derived from cocso token source.
- Foundational primitives for RN design systems: `Box`, `Text`, `Stack`.
- Core interactive components: `Button`, `Modal`, `GlassView`.
- React Native `Modal`-compatible presentation controls with explicit component-level semantics.
- Translucent glass surface with optional blur-component injection for apps that provide native blur.

## Out of Scope

- Porting every existing web component in `@cocso-ui/react` one-to-one.
- Web-only CSS module behavior and browser-specific styling patterns.
- App-level navigation logic and screen composition.

## Architecture

```text
packages/react-native/src/
├── components/
│   ├── box/
│   ├── button/
│   ├── glass-view/
│   ├── modal/
│   ├── stack/
│   └── text/
├── theme/
│   ├── tokens.generated.ts
│   ├── tokens.ts
│   └── index.ts
└── index.ts
```

Token architecture contract:

- Source of truth remains `@cocso-ui/css` (`token.css`).
- RN package consumes generated JS/TS token values (not CSS `var(...)` references).
- Token keys keep stable enum-like identifiers where possible (`neutral500`, `s8`, `r4`).

## Interfaces

Public package name: `@cocso-ui/react-native`

Public exports:

- `theme` tokens: `colors`, `spacing`, `radius`, `fontSize`, `fontWeight`, `lineHeight`, `shadows`, `zIndex`
- Components: `Box`, `Text`, `Stack`, `Button`, `Modal`, `GlassView`

Modal interfaces:

- `RN_MODAL_PRESENTATION`: `"fullScreen" | "pageSheet" | "formSheet" | "overFullScreen"`
- `GLASS_INTENSITY`: `"low" | "medium" | "high"`

## Storage

- No runtime persistence.
- Build artifacts generated into `dist/`.
- Generated token file committed for deterministic package builds.

## Security

- No network calls.
- No secret handling.
- Styling and UI utilities only.

## Logging

- No runtime logging by default.
- Development-only invariant errors for invalid token keys or unsupported presentation values.

## Build and Test

```sh
# Build package
pnpm --filter @cocso-ui/react-native build

# Lint package
pnpm --filter @cocso-ui/react-native lint

# Type check package
pnpm --filter @cocso-ui/react-native check-types
```

Repository validation should include:

```sh
pnpm check
pnpm build
```

## Roadmap

- Add higher-level RN components mapped from proven web component semantics.
- Add dark-mode semantic token aliases.
- Add visual regression examples in Storybook or Expo preview integration.

## Open Questions

- Whether to standardize on `expo-blur` as a hard dependency or keep it as optional peer dependency.
- Whether to add dedicated Expo Router integration helpers in a separate package layer.
