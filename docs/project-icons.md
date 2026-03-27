# project-icons

## Goal

Provide a single source of truth for all SVG icons in the cocso design system, eliminating duplication between `@cocso-ui/react-icons` (React components) and `@cocso-ui/figma` (hardcoded SVG strings). All downstream consumers generate their icon representations from this canonical SVG source.

## Path

```
packages/icons/        (planned)
```

## Runtime and Language

Node.js (TypeScript). Build-time only — no runtime dependency.

## Users

- `@cocso-ui/react-icons` — consumes generated React icon components.
- `@cocso-ui/figma` — consumes generated SVG template strings for Figma plugin.
- `@cocso-ui/recipe` — references icons by canonical name in component specs.
- `apps/storybook` — renders icon catalog for visual testing.
- Frontend engineers — browse and discover available icons.

## In Scope

- Canonical SVG source files for all icons (semantic + brand).
- Icon metadata registry (name, category, source, tags).
- Build pipeline: SVG optimization via SVGO.
- Code generation: SVG to React components.
- Code generation: SVG to Figma-compatible SVG template strings.
- CLI script to add/update icons from Tabler Icons source.

## Out of Scope

- Icon design or SVG authoring.
- Non-React framework bindings (Vue, Angular, Svelte).
- Webfont or sprite sheet generation.
- Figma plugin icon sync (handled by `@cocso-ui/figma`).

## Architecture

### Current State (Problem)

```
@cocso-ui/react-icons
├── src/components/semantic/*.tsx   # 68 icons — SVG hardcoded in JSX
├── src/components/brand/*.tsx      # 15 icons — SVG hardcoded in JSX
└── (no raw SVG source files)

@cocso-ui/figma
└── src/generators/shared.ts
    └── ICON_SVGS = { ... }         # 10 icons — SVG strings with {color} placeholder
                                     # Maintained independently from react-icons
```

**Problems:**
1. No canonical SVG source — SVGs live only inside TSX and TS string literals.
2. `react-icons` and `figma` maintain overlapping icons independently.
3. Adding a new icon requires manual edits in multiple packages.
4. No icon optimization pipeline (SVGO).
5. No metadata or discovery mechanism for available icons.

### Proposed Architecture

```
packages/icons/                          # NEW — Single Source of Truth
├── svg/
│   ├── semantic/                        # Stroke-based UI icons (Tabler Icons origin)
│   │   ├── arrow-backward.svg
│   │   ├── arrow-down.svg
│   │   ├── check.svg
│   │   ├── chevron-down.svg
│   │   ├── close.svg
│   │   ├── search.svg
│   │   └── ... (68+ icons)
│   └── brand/                           # Fill-based brand logos
│       ├── cocso-logo.svg
│       ├── kakao-logo.svg
│       └── ... (15+ icons)
├── registry.json                        # Icon metadata registry
├── scripts/
│   ├── optimize.ts                      # SVGO optimization
│   ├── generate-react.ts                # SVG → React TSX components
│   ├── generate-figma.ts                # SVG → Figma SVG template strings
│   ├── fetch-tabler.ts                  # Fetch/update icons from Tabler Icons
│   └── validate.ts                      # Consistency checks
├── generated/
│   ├── react/                           # Output: React components
│   │   ├── semantic/
│   │   │   ├── ArrowBackwardIcon.tsx
│   │   │   └── ...
│   │   ├── brand/
│   │   │   ├── COCSOLogo.tsx
│   │   │   └── ...
│   │   └── index.ts
│   └── figma/                           # Output: Figma SVG strings
│       └── icon-svgs.ts                 # export const ICON_SVGS = { ... }
├── package.json
└── tsconfig.json
```

### Data Flow

```
                    ┌─────────────────┐
                    │  Tabler Icons   │  (upstream source for semantic icons)
                    └────────┬────────┘
                             │ fetch-tabler.ts
                             ▼
┌──────────────────────────────────────────────────┐
│              packages/icons/svg/                  │
│  semantic/*.svg          brand/*.svg              │
│  (stroke, 24x24)         (fill, custom viewBox)   │
└──────────┬───────────────────────┬───────────────┘
           │                       │
           ▼                       ▼
    ┌──────────────┐        ┌──────────────┐
    │  optimize.ts │        │  optimize.ts │
    │  (SVGO)      │        │  (SVGO)      │
    └──────┬───────┘        └──────┬───────┘
           │                       │
           ▼                       ▼
    ┌──────────────┐        ┌──────────────────┐
    │generate-react│        │ generate-figma   │
    │  .ts         │        │  .ts             │
    └──────┬───────┘        └──────┬───────────┘
           │                       │
           ▼                       ▼
┌────────────────────┐   ┌─────────────────────┐
│ @cocso-ui/         │   │ @cocso-ui/figma     │
│ react-icons        │   │ shared.ts imports   │
│ (re-exports from   │   │ ICON_SVGS from      │
│  generated/)       │   │ generated/figma/    │
└────────────────────┘   └─────────────────────┘
```

### Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| SVG storage | Flat files per category | Follows Tabler Icons pattern; git-friendly, easy to diff |
| Metadata | registry.json | Queryable, supports tooling; avoids SVG comment parsing |
| Optimization | SVGO | Industry standard; configurable preset |
| React generation | Custom script | Matches existing Icon/Child wrapper pattern |
| Figma generation | Custom script | Produces `{color}` template strings matching current format; maps kebab-case filenames to camelCase keys (e.g., `chevron-down.svg` → `chevronDown`) |
| Naming | kebab-case SVG files, PascalCase components | Consistent with repo conventions |

### Research: External Design Systems

| System | Approach | Key Insight |
|--------|----------|-------------|
| **Tabler Icons** | SVG files → multi-framework codegen | Flat directory + metadata in SVG comments. Most relevant since cocso-ui already uses Tabler as source. |
| **Seed Design (Daangn)** | Figma-first → JS registry sync | Icons defined in Figma, synced to generated JS object. No SVG files in repo. |
| **Kumo-UI (Cloudflare)** | External library (@phosphor-icons) + inline brand SVGs | Simple but limits customization. Brand SVGs as TS constants. |

**Chosen approach:** SVG-first (like Tabler), adapted for our monorepo. This gives us:
- Version-controlled SVG sources (git diff friendly)
- Independence from Figma for icon storage
- Multi-target code generation (React + Figma)
- Easy to add new icons from Tabler or custom sources

## Interfaces

Public package: `@cocso-ui/icons`

```ts
// Generated React components (re-exported by @cocso-ui/react-icons)
import { SearchIcon, CheckIcon } from '@cocso-ui/icons/react';

// Generated Figma SVG templates (consumed by @cocso-ui/figma)
import { ICON_SVGS } from '@cocso-ui/icons/figma';

// Icon metadata registry
import registry from '@cocso-ui/icons/registry.json';
```

### registry.json Schema

```json
{
  "icons": [
    {
      "name": "search",
      "category": "semantic",
      "componentName": "SearchIcon",
      "source": "tabler",
      "tablerName": "search",
      "tags": ["find", "magnify", "lookup"],
      "viewBox": "0 0 24 24",
      "aliases": []
    },
    {
      "name": "cocso-logo",
      "category": "brand",
      "componentName": "COCSOLogo",
      "source": "custom",
      "tags": ["logo", "brand"],
      "viewBox": "0 0 280 280",
      "aliases": []
    }
  ]
}
```

## Storage

No runtime storage. Build outputs written to `generated/` (gitignored) and `dist/`.

## Security

- No network calls at runtime.
- `fetch-tabler.ts` fetches from `github.com/tabler/tabler-icons` at build time only.
- No secrets or credentials handled.

## Logging

Build scripts use structured console output with ANSI colors. Log icon count, optimization savings, generation results.

## Build and Test

```sh
# Optimize SVGs
pnpm --filter @cocso-ui/icons optimize

# Generate React components
pnpm --filter @cocso-ui/icons generate:react

# Generate Figma SVG templates
pnpm --filter @cocso-ui/icons generate:figma

# Full build (optimize + generate all)
pnpm --filter @cocso-ui/icons build

# Fetch/update icons from Tabler
pnpm --filter @cocso-ui/icons fetch:tabler

# Validate consistency
pnpm --filter @cocso-ui/icons validate

# Lint
pnpm --filter @cocso-ui/icons lint
```

CI expects: `build`, `lint`, `validate` to pass.

## Roadmap

### Phase 1: Foundation (Current PR)
- [ ] Create `packages/icons/` package skeleton.
- [ ] Extract SVG paths from brand TSX components into `svg/brand/*.svg`.
- [ ] Fetch canonical SVGs from Tabler Icons for semantic icons into `svg/semantic/*.svg`.
- [ ] Create `registry.json` with metadata for all icons.
- [ ] Implement SVGO optimization script.

Note: After Phase 1, `@cocso-ui/react-icons` still contains hardcoded TSX. Migration happens in Phase 2.

### Phase 2: Code Generation
- [ ] Implement `generate-react.ts` — SVG to React component generator.
- [ ] Implement `generate-figma.ts` — SVG to Figma template string generator.
- [ ] Wire `@cocso-ui/react-icons` to consume generated components.
- [ ] Wire `@cocso-ui/figma` shared.ts to import from generated Figma templates.

### Phase 3: Integration & Validation
- [ ] Add `validate.ts` script for cross-package consistency checks.
- [ ] Update Turborepo pipeline: add `@cocso-ui/icons` as `dependsOn` for `@cocso-ui/react-icons` and `@cocso-ui/figma` in `turbo.json`.
- [ ] Add Storybook icon catalog page.
- [ ] Update CI to include icon validation.

### Phase 4: Tooling & DX
- [ ] Implement `fetch-tabler.ts` CLI for adding new Tabler icons.
- [ ] Add script to add custom SVG icons with metadata prompts.
- [ ] Icon search/discovery in documentation site.

## Open Questions

- Should `generated/` output be committed to git (zero-build consumption) or gitignored (build-required)?
  - **Recommendation:** Commit generated output for zero-build consumption by downstream packages, similar to how Tabler Icons commits generated components.
- Should brand icons with custom viewBox sizes be normalized to a standard size?
  - **Recommendation:** Keep original viewBox; the Icon wrapper component handles sizing.
- Should we support icon variants (outline/filled) in the future?
  - **Recommendation:** Not in initial scope. Add when design team requests filled variants.
- How should custom brand icons updated in Figma be synced back to `svg/brand/`?
  - **Recommendation:** Manual export for now. Consider a Figma export script in Phase 4 if brand icon churn is high.
- If committing `generated/` output, how to handle merge conflicts on icon changes?
  - **Recommendation:** Use `.gitattributes` with `merge=ours` for generated files, and regenerate on conflict.
