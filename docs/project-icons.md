# project-icons

## Goal

Provide a single source of truth for all SVG icons in the cocso design system. All downstream consumers (`@cocso-ui/react-icons`, `@cocso-ui/figma`) generate their icon representations from this canonical SVG source, eliminating duplication and synchronization bugs.

## Path

```
packages/icons/
```

## Runtime and Language

Node.js (TypeScript). Build-time only — no runtime dependency.

## Users

- `@cocso-ui/react-icons` — consumes generated React icon components via `@cocso-ui/icons/react`.
- `@cocso-ui/figma` — consumes generated SVG template strings via `@cocso-ui/icons/figma`.
- `@cocso-ui/recipe` — references icons by canonical name in component specs.
- Frontend engineers — browse and discover available icons via Storybook and documentation site.

## In Scope

- Canonical SVG source files for all icons (semantic + brand) in `svg/`.
- Icon metadata registry (`registry.json`): name, category, colorStrategy, componentName, source, tags, viewBox.
- SVGO optimization with conservative configuration (`scripts/optimize.ts`).
- Code generation: SVG to React TSX components (`scripts/generate-react.ts` → `dist/react/`).
- Code generation: SVG to Figma `{color}` template strings (`scripts/generate-figma.ts` → `dist/figma/`).
- CLI: fetch icons from Tabler Icons (`scripts/fetch-tabler.ts`).
- CLI: add custom SVG icons with metadata auto-detection (`scripts/add-icon.ts`).
- Cross-package validation (`scripts/validate.ts`, `scripts/validate-compat.ts`).

## Out of Scope

- Icon design or SVG authoring.
- Non-React framework bindings (Vue, Angular, Svelte).
- Webfont or sprite sheet generation.
- Figma plugin icon sync (handled by `@cocso-ui/figma`).

## Architecture

```
packages/icons/
├── svg/
│   ├── semantic/              # 69 UI icons (stroke/fill, all 24x24)
│   └── brand/                 # 15 brand logos (mixed color strategies, custom viewBox)
├── registry.json              # Icon metadata (84 entries)
├── templates/react/           # Shared React source files (icon.tsx, child.tsx, types.ts)
├── scripts/
│   ├── optimize.ts            # SVGO optimization
│   ├── generate-react.ts      # SVG → React TSX components
│   ├── generate-figma.ts      # SVG → Figma SVG template strings
│   ├── fetch-tabler.ts        # Fetch icons from Tabler Icons
│   ├── add-icon.ts            # Add custom SVG icons
│   ├── validate.ts            # Cross-package consistency checks
│   ├── validate-compat.ts     # Backward-compatibility import validation
│   └── types.ts               # Shared types (RegistryIcon, Registry)
├── dist/
│   ├── react/                 # Generated React components (committed to git)
│   │   ├── semantic/          # 69 TSX files
│   │   ├── brand/             # 15 TSX files
│   │   ├── icon.tsx           # Icon wrapper component
│   │   ├── child.tsx          # Child helper component
│   │   ├── types.ts           # IconProps type
│   │   └── index.ts           # Barrel export
│   └── figma/
│       └── icon-svgs.ts       # ICON_SVGS record (84 primary + 7 aliases)
└── package.json
```

### Data Flow

```
svg/semantic/*.svg + svg/brand/*.svg
    ↓ optimize.ts (SVGO)
    ├── generate-react.ts → dist/react/ → consumed by @cocso-ui/react-icons (re-export)
    └── generate-figma.ts → dist/figma/ → consumed by @cocso-ui/figma (import ICON_SVGS)
```

### Color Strategy

| Value | Meaning | React | Figma |
|-------|---------|-------|-------|
| `stroke` | `stroke="currentColor"` | Pass through | Replace `currentColor` with `{color}` |
| `fill` | `fill="currentColor"` | Pass through | Replace `currentColor` with `{color}` |
| `hardcoded` | All colors are hardcoded hex | Pass through | No color replacement |
| `mixed` | `currentColor` + hardcoded hex | Pass through | Replace only `currentColor` with `{color}` |

### Generated Output

- `dist/` is committed to the repository for zero-build consumption.
- CI validates that committed `dist/` matches a fresh build.
- Icons with `useStaticIds: true` (KakaoLogo, NaverLogo, NaverOutlineLogo, HuonsLogo) have deterministic static IDs in SVG source; the React generator restores `useId()` calls.

## Interfaces

Public package: `@cocso-ui/icons`

```ts
// React components (re-exported by @cocso-ui/react-icons)
import { SearchIcon, CheckIcon } from '@cocso-ui/icons/react';

// Figma SVG templates (consumed by @cocso-ui/figma)
import { ICON_SVGS } from '@cocso-ui/icons/figma';

// Icon metadata registry
import registry from '@cocso-ui/icons/registry.json';
```

### registry.json Schema

```json
{
  "icons": [{
    "name": "search",
    "category": "semantic",
    "componentName": "SearchIcon",
    "colorStrategy": "stroke",
    "source": "tabler",
    "tags": [],
    "viewBox": "0 0 24 24",
    "aliases": []
  }]
}
```

## Storage

No runtime storage. Build outputs written to `dist/` and committed to git.

## Security

- No network calls at runtime.
- `fetch-tabler.ts` fetches from `github.com/tabler/tabler-icons` at build time only.
- No secrets or credentials handled.

## Logging

Build scripts use structured console output with ANSI colors. Log icon count, optimization savings, generation results.

## Build and Test

```sh
# Full build (optimize + generate all)
pnpm --filter @cocso-ui/icons build

# Fetch/update icons from Tabler
pnpm --filter @cocso-ui/icons fetch:tabler -- --name <icon-name>

# Add custom SVG icon
pnpm --filter @cocso-ui/icons add-icon -- --file <path.svg> --name <name> --category <semantic|brand>

# Validate consistency
pnpm --filter @cocso-ui/icons validate

# Validate backward compatibility
pnpm --filter @cocso-ui/icons validate:compat

# Lint
pnpm --filter @cocso-ui/icons lint
```

CI expects: `build`, `lint`, `validate`, `validate:compat` to pass.

## Roadmap

- Add visual snapshot tests via Storybook.
- Consider Chromatic or Percy integration for automated visual regression.
- Add Figma export script for brand icon sync if churn is high.

## Open Questions

- None at this time.
