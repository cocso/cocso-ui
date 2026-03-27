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
- Icon metadata registry (name, category, colorStrategy, source, tags).
- Build pipeline: SVG optimization via SVGO with conservative configuration.
- Code generation: SVG to React components (preserving displayName, aria-hidden).
- Code generation: SVG to Figma-compatible SVG template strings.
- CLI script to add/update icons from Tabler Icons source.
- Backward-compatibility validation for existing consumers.

## Out of Scope

- Icon design or SVG authoring.
- Non-React framework bindings (Vue, Angular, Svelte).
- Webfont or sprite sheet generation.
- Figma plugin icon sync (handled by `@cocso-ui/figma`).

## Why Not a Simpler Alternative?

**Antithesis considered:** "Add `react-icons` as a `figma` dependency and write a small extraction script to pull SVG strings from the existing TSX components at build time."

**Rejection rationale:**

1. **Fragile parsing.** Extracting SVG from JSX at build time requires either regex parsing (brittle) or a full JSX-to-SVG transform. The TSX files use React-specific patterns (`useId()`, `{...props}`, JSX expressions for `clipPath` IDs) that do not map cleanly to raw SVG.
2. **No canonical source.** The extraction approach still leaves TSX as the de facto source of truth. Any future consumer (documentation site SVG sprites, native mobile icons, email templates) would need its own extraction script.
3. **No optimization layer.** Without raw SVG files, there is no place to run SVGO optimization, enforce naming conventions, or validate icon metadata.
4. **Multi-target generation.** The SVG-first approach supports React, Figma, and future targets from one canonical source, whereas extraction is inherently single-source-single-target.
5. **Industry alignment.** Tabler Icons, Lucide, Phosphor, and Heroicons all use SVG-first with code generation. This approach is well-understood and well-tooled.

The full approach requires more upfront work (Phase 1–2) but eliminates an entire class of synchronization bugs permanently.

## Architecture

### Current State (Problem)

```
@cocso-ui/react-icons
├── src/components/semantic/*.tsx   # 68 icons — SVG hardcoded in JSX
├── src/components/brand/*.tsx      # 15 icons — SVG hardcoded in JSX
├── scripts/generate-index-file.mjs # Auto-generates barrel index.ts files from TSX
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

### Icon Taxonomy

All 83 icons fall into one of four color strategies:

| Color Strategy | Count | Description | Examples |
|----------------|-------|-------------|----------|
| `stroke` | 62 | `stroke="currentColor"` with no fill. Standard Tabler-origin UI icons. | CheckIcon, SearchIcon, CloseIcon |
| `fill` | 13 | `fill="currentColor"` with no stroke. Includes 6 semantic icons and 7 brand logos. | ArrowDropDownIcon, COCSOLogo, KakaoOutlineLogo |
| `hardcoded` | 7 | All colors are hardcoded hex values. No `currentColor` usage. | KakaoLogo (`#FEE500`), NaverLogo (`#03C75A`), HMPLogo, HuonsLogo, COCSOColorLogo |
| `mixed` | 1 | Combination of `currentColor` and hardcoded hex values. | COCSOColorHorizontalLogo (`currentColor` + `#19C08E` + `#1987FF`) |

**Semantic icons (68):**
- 62 stroke-based (`stroke="currentColor"`, viewBox `0 0 24 24`)
- 6 fill-based (`fill="currentColor"`, viewBox `0 0 24 24`): ArrowDropDownIcon, ArrowDropUpIcon, CheckCircleIcon, RemoveCircleIcon, SideNavigationIcon, VerifiedIcon

**Brand icons (15):**
- 7 currentColor-only (fill): COCSOLogo, COCSOHorizontalLogo, COCSOTextLogo, COCSOUILogo, COCSOUITextLogo, KakaoOutlineLogo, NaverOutlineLogo
- 7 hardcoded hex: COCSOColorLogo, DrugInfoHorizontalLogo, HMPLogo, HuonsLogo, KakaoLogo, NaverLogo, SeoulPharmaLogo
- 1 mixed currentColor + hex: COCSOColorHorizontalLogo

**Icons using React `useId()` (4):** KakaoLogo, NaverLogo, NaverOutlineLogo, HuonsLogo — these generate unique IDs for `clipPath` and `linearGradient` elements at runtime.

### Proposed Architecture

```
packages/icons/                          # NEW — Single Source of Truth
├── svg/
│   ├── semantic/                        # UI icons (62 stroke + 6 fill, all 24x24)
│   │   ├── arrow-backward.svg
│   │   ├── arrow-drop-down.svg          # fill-based
│   │   ├── check.svg
│   │   ├── chevron-down.svg
│   │   ├── close.svg
│   │   ├── search.svg
│   │   └── ... (68 icons)
│   └── brand/                           # Brand logos (mixed color strategies, custom viewBox)
│       ├── cocso-logo.svg               # fill, currentColor
│       ├── cocso-color-logo.svg         # hardcoded: #19C08E + #1987FF
│       ├── kakao-logo.svg               # hardcoded: #FEE500 + black
│       ├── huons-logo.svg               # hardcoded: white + #0068B7 + gradients
│       └── ... (15 icons)
├── registry.json                        # Icon metadata registry
├── scripts/
│   ├── optimize.ts                      # SVGO optimization (conservative config)
│   ├── generate-react.ts                # SVG → React TSX components
│   ├── generate-figma.ts                # SVG → Figma SVG template strings
│   ├── fetch-tabler.ts                  # Fetch/update icons from Tabler Icons
│   ├── validate.ts                      # Consistency checks
│   └── validate-compat.ts              # Backward-compatibility import validation
├── dist/
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
│  semantic/*.svg              brand/*.svg          │
│  (62 stroke + 6 fill,        (7 currentColor,    │
│   all 24x24)                  7 hardcoded hex,    │
│                               1 mixed)            │
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
│ @cocso-ui/          │   │ @cocso-ui/figma     │
│ react-icons         │   │ shared.ts imports   │
│ (re-exports from    │   │ ICON_SVGS from      │
│  dist/)             │   │ dist/figma/         │
└────────────────────┘   └─────────────────────┘
```

### Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| SVG storage | Flat files per category | Follows Tabler Icons pattern; git-friendly, easy to diff |
| Metadata | registry.json with colorStrategy | Queryable, supports tooling; colorStrategy enables correct generation per icon |
| Optimization | SVGO with conservative preset | Industry standard; conservative config prevents stripping viewBox, clipPath, gradients |
| React generation | Custom script | Matches existing Icon/Child wrapper pattern; must preserve displayName + aria-hidden |
| Figma generation | Custom script | Produces `{color}` template strings matching current format; maps kebab-case filenames to camelCase keys (e.g., `chevron-down.svg` → `chevronDown`) |
| Naming | kebab-case SVG files, PascalCase components | Consistent with repo conventions |
| Output directory | `dist/` | Matches existing Turborepo output configuration (`lib/**`, `dist/**`) |
| Generated output | Committed to git | Zero-build consumption by downstream packages; `.gitattributes` with `merge=ours` for conflict resolution |
| useId handling | Deterministic static IDs in SVG source | SVG files use stable IDs (e.g., `kakao-logo-clip-1`); React generator restores `useId()` calls; Figma generator keeps static IDs |

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
      "colorStrategy": "stroke",
      "source": "tabler",
      "tablerName": "search",
      "tags": ["find", "magnify", "lookup"],
      "viewBox": "0 0 24 24",
      "aliases": []
    },
    {
      "name": "arrow-drop-down",
      "category": "semantic",
      "componentName": "ArrowDropDownIcon",
      "colorStrategy": "fill",
      "source": "tabler",
      "tablerName": "caret-down-filled",
      "tags": ["arrow", "dropdown", "caret"],
      "viewBox": "0 0 24 24",
      "aliases": []
    },
    {
      "name": "cocso-logo",
      "category": "brand",
      "componentName": "COCSOLogo",
      "colorStrategy": "fill",
      "source": "custom",
      "tags": ["logo", "brand", "cocso"],
      "viewBox": "0 0 280 280",
      "aliases": []
    },
    {
      "name": "kakao-logo",
      "category": "brand",
      "componentName": "KakaoLogo",
      "colorStrategy": "hardcoded",
      "source": "custom",
      "tags": ["logo", "brand", "kakao", "social"],
      "viewBox": "0 0 20 20",
      "aliases": [],
      "useStaticIds": true
    },
    {
      "name": "cocso-color-horizontal-logo",
      "category": "brand",
      "componentName": "COCSOColorHorizontalLogo",
      "colorStrategy": "mixed",
      "source": "custom",
      "tags": ["logo", "brand", "cocso", "color", "horizontal"],
      "viewBox": "0 0 493 96",
      "aliases": []
    },
    {
      "name": "huons-logo",
      "category": "brand",
      "componentName": "HuonsLogo",
      "colorStrategy": "hardcoded",
      "source": "custom",
      "tags": ["logo", "brand", "huons"],
      "viewBox": "0 0 339 300",
      "aliases": [],
      "useStaticIds": true
    }
  ]
}
```

### colorStrategy Values

| Value | Meaning | Figma Generation | React Generation |
|-------|---------|-----------------|-----------------|
| `stroke` | Uses `stroke="currentColor"`. No fill on paths. | Replace `currentColor` with `{color}` in stroke attributes. | Pass through as-is. |
| `fill` | Uses `fill="currentColor"`. No stroke on paths. | Replace `currentColor` with `{color}` in fill attributes. | Pass through as-is. |
| `hardcoded` | All colors are hardcoded hex values. | No color replacement. Export as static SVG string without `{color}` templating. | Pass through as-is. |
| `mixed` | Combination of `currentColor` and hardcoded hex. | Replace only `currentColor` with `{color}`, preserve hardcoded hex values. | Pass through as-is. |

### useStaticIds

Icons with `"useStaticIds": true` require unique IDs for `clipPath`, `linearGradient`, or `mask` elements. In the canonical SVG source, these use deterministic static IDs (e.g., `kakao-logo-clip-1`, `huons-logo-grad-1`). The React generator replaces these with `useId()` calls. The Figma generator keeps the static IDs as-is (Figma does not render multiple instances simultaneously).

**Icons requiring static IDs:** KakaoLogo, NaverLogo, NaverOutlineLogo, HuonsLogo.

## Backward-Compatibility Contract

The following icons are imported by `@cocso-ui/react` production code. Their component names, prop signatures, and visual output MUST remain identical after migration.

### Production Imports (from `@cocso-ui/react` components)

| Icon | Consumer | File |
|------|----------|------|
| SelectorIcon | Select | `packages/react/src/components/select/select.tsx` |
| KeyboardArrowDownIcon | Accordion | `packages/react/src/components/accordion/accordion.tsx` |
| CheckIcon | Checkbox | `packages/react/src/components/checkbox/checkbox.tsx` |
| CheckIndeterminateSmallIcon | Checkbox | `packages/react/src/components/checkbox/checkbox.tsx` |
| CloseIcon | Dialog | `packages/react/src/components/dialog/dialog.tsx` |
| ExternalLinkIcon | Link | `packages/react/src/components/link/link.tsx` |
| ArrowIOSBackwardIcon | MonthPicker, DayPicker, Pagination | `month-picker.tsx`, `day-picker.tsx`, `pagination.tsx` |
| ArrowIOSForwardIcon | MonthPicker, DayPicker, Pagination | `month-picker.tsx`, `day-picker.tsx`, `pagination.tsx` |
| MoreHorizIcon | Pagination | `packages/react/src/components/pagination/pagination.tsx` |

### Story/Example Imports

| Icon | Consumer |
|------|----------|
| ContentCopyIcon | dropdown.stories.tsx, website examples |
| DeleteIcon | dropdown.stories.tsx, website examples |
| PencilIcon | dropdown.stories.tsx, website examples |
| PersonIcon | dropdown.stories.tsx |
| SettingsIcon | dropdown.stories.tsx |
| SearchIcon | website icons.mdx |
| CalendarMonthIcon | website day-picker/month-picker examples |
| PlusIcon | website button examples |
| ArrowForwardIcon | website button examples |
| MenuIcon | website mobile-sidebar.tsx |
| MoreHorizIcon | website dropdown examples |

### Validation Script (validate-compat.ts)

The `validate-compat.ts` script ensures backward compatibility:
1. Parse all `@cocso-ui/react` and `apps/` source files for `@cocso-ui/react-icons` imports.
2. Verify every imported component name exists in `registry.json`.
3. Render each production icon to a string (`renderToStaticMarkup`) and compare SVG output against a snapshot baseline.
4. Normalize dynamic IDs (from `useId()`) before diffing to avoid false negatives on the 4 icons that use runtime ID generation.
5. Fail CI if any imported icon is missing or has changed its SVG output.

## Storage

No runtime storage. Build outputs written to `dist/` and committed to git for zero-build consumption.

**Git strategy for generated files:**
- `dist/` is committed to the repository.
- `.gitattributes` marks `dist/` files with `merge=ours` to prevent merge conflicts on generated output.
- CI validates that committed `dist/` matches a fresh build (`pnpm build && git diff --exit-code dist/`). If stale, the build step fails.

## Security

- No network calls at runtime.
- `fetch-tabler.ts` fetches from `github.com/tabler/tabler-icons` at build time only.
- No secrets or credentials handled.

## Logging

Build scripts use structured console output with ANSI colors. Log icon count, optimization savings, generation results.

## SVGO Configuration

SVGO must use a conservative configuration to avoid breaking icons with complex structures:

- Keep `viewBox` on all icons (icons rely on it for sizing).
- Keep `clipPath` elements (used by KakaoLogo, NaverLogo, NaverOutlineLogo) and `linearGradient` elements (used by HuonsLogo).
- Do not merge paths in brand icons (visual fidelity).
- Do not remove `fill="none"` attributes (intentional in stroke-based icons).
- Icons with `colorStrategy: "hardcoded"` or `"mixed"` must skip any color conversion plugins to preserve hex values.
- Icons with `useStaticIds: true` must skip ID cleanup plugins to preserve deterministic IDs.

## React Generation Requirements

The `generate-react.ts` script must produce components that exactly match the existing contract:

1. **displayName**: Every generated component MUST set `ComponentName.displayName = "ComponentName"`.
2. **aria-hidden**: Every SVG element MUST include `aria-hidden="true"`.
3. **Icon wrapper**: Every component MUST wrap the SVG in the `<Icon {...props}>` wrapper from `../../icon`.
4. **IconProps type**: Every component MUST accept `IconProps` from `../../types`.
5. **useId restoration**: Icons with `useStaticIds: true` in the registry MUST have their deterministic IDs replaced with `useId()` calls in the generated React code.
6. **SVG attributes**: Convert kebab-case SVG attributes to camelCase JSX equivalents (e.g., `clip-path` → `clipPath`, `fill-rule` → `fillRule`, `stroke-linecap` → `strokeLinecap`).

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

# Validate backward compatibility
pnpm --filter @cocso-ui/icons validate:compat

# Lint
pnpm --filter @cocso-ui/icons lint
```

CI expects: `build`, `lint`, `validate`, `validate:compat` to pass.

## Roadmap

### Phase 1: Foundation

- [ ] Create `packages/icons/` package skeleton (package.json, tsconfig.json, SVGO config).
- [ ] Extract SVG content from all 15 brand TSX components into `svg/brand/*.svg`.
  - For icons using `useId()` (KakaoLogo, NaverLogo, NaverOutlineLogo, HuonsLogo): replace dynamic IDs with deterministic static IDs (e.g., `kakao-logo-clip-1`, `huons-logo-grad-1`).
- [ ] Fetch canonical SVGs from Tabler Icons for semantic icons into `svg/semantic/*.svg`.
  - For the 6 fill-based semantic icons, verify Tabler origin and extract correct variant.
- [ ] Create `registry.json` with metadata for all 83 icons, including `colorStrategy` and `useStaticIds` fields.
- [ ] Implement SVGO optimization script with conservative configuration.

**Acceptance Criteria:**
1. `svg/semantic/` contains exactly 68 SVG files, each valid and parseable.
2. `svg/brand/` contains exactly 15 SVG files, each valid and parseable.
3. `registry.json` contains 83 entries, each with a valid `colorStrategy` value.
4. `pnpm --filter @cocso-ui/icons optimize` runs without error and produces optimized SVGs.
5. Every SVG retains its original `viewBox` after optimization.
6. Brand SVGs with clipPath/gradients retain those elements after optimization.

Note: After Phase 1, `@cocso-ui/react-icons` still contains handwritten TSX. Migration happens in Phase 2.

### Phase 2: Code Generation (Additive)

Phase 2 uses an additive-before-subtractive approach: generated output runs alongside existing handwritten icons with validation before switching consumers.

- [ ] Implement `generate-react.ts` — SVG to React component generator.
  - Must produce components with displayName, aria-hidden, Icon wrapper, IconProps type.
  - Must restore `useId()` calls for icons with `useStaticIds: true`.
  - Must convert SVG attributes to JSX camelCase equivalents.
- [ ] Implement `generate-figma.ts` — SVG to Figma template string generator.
  - Must produce `{color}` placeholder strings matching current `ICON_SVGS` format and camelCase key naming.
  - Must respect `colorStrategy`: only replace `currentColor` with `{color}`, never hardcoded hex.
  - Minimum viable output: the 10 icons currently in `ICON_SVGS` (check, indeterminate, close, selector, chevronDown/Up, chevronLeft/Right, arrowLeft/Right).
- [ ] **Parallel-run validation**: Generate output to `dist/` and compare against existing handwritten components:
  - Render both old (handwritten) and new (generated) components to static markup via `renderToStaticMarkup`.
  - Normalize dynamic IDs (from `useId()`) before diffing to prevent false negatives.
  - Diff the SVG output — they must be semantically identical (attribute order may differ).
  - Run this comparison as a CI step before proceeding to Phase 3.
- [ ] Implement `validate-compat.ts` — backward-compatibility import validation script.
- [ ] Prepare `generate-index-file.mjs` migration:
  - The existing `packages/react-icons/scripts/generate-index-file.mjs` auto-generates barrel `index.ts` files from TSX filenames.
  - `generate-react.ts` takes over barrel file generation as part of its output.
  - `generate-index-file.mjs` is removed in Phase 3 when `react-icons` switches to consuming generated output.

**Acceptance Criteria:**
1. `pnpm --filter @cocso-ui/icons generate:react` produces 83 TSX files in `dist/react/`.
2. `pnpm --filter @cocso-ui/icons generate:figma` produces `dist/figma/icon-svgs.ts` with at least the 10 currently consumed keys.
3. Every generated React component has `.displayName` set and `aria-hidden="true"` on the SVG.
4. The 4 `useStaticIds` icons (KakaoLogo, NaverLogo, NaverOutlineLogo, HuonsLogo) correctly import and call `useId()`.
5. Parallel-run comparison shows zero semantic SVG differences between handwritten and generated components.
6. `validate:compat` passes — all 9 production imports and all story imports are present and correct.
7. Existing `pnpm build` and `pnpm test` continue to pass (no consumer breakage).

### Phase 3: Integration and Consumer Switchover

Only proceeds after Phase 2 parallel-run validation is green.

- [ ] Wire `@cocso-ui/react-icons` to re-export generated components from `@cocso-ui/icons/dist/react/`.
  - Remove handwritten TSX files from `packages/react-icons/src/components/`.
  - Remove `packages/react-icons/scripts/generate-index-file.mjs`.
- [ ] Wire `@cocso-ui/figma` shared.ts to import `ICON_SVGS` from `@cocso-ui/icons/dist/figma/`.
- [ ] Add `@cocso-ui/icons` as a workspace dependency of `@cocso-ui/react-icons` and `@cocso-ui/figma`.
- [ ] Update Turborepo pipeline if needed (the existing `"dependsOn": ["^build"]` should handle the new dependency automatically).
- [ ] Add `validate.ts` script for cross-package consistency checks.
- [ ] Update CI to include icon validation (`validate`, `validate:compat`).

**Acceptance Criteria:**
1. `@cocso-ui/react-icons` re-exports all icons from `@cocso-ui/icons` with zero handwritten TSX remaining.
2. `@cocso-ui/figma` imports `ICON_SVGS` from `@cocso-ui/icons/dist/figma/icon-svgs.ts`.
3. `generate-index-file.mjs` is deleted.
4. `@cocso-ui/react-icons` and `@cocso-ui/figma` declare `@cocso-ui/icons` as a workspace dependency.
5. Full `pnpm build` passes across all packages.
6. All existing tests pass without modification.
7. `validate:compat` passes in CI.

### Phase 4: Tooling and DX

- [ ] Implement `fetch-tabler.ts` CLI for adding new Tabler icons (fetch SVG, add to `svg/semantic/`, update `registry.json`).
- [ ] Add script to add custom SVG icons with metadata prompts.
- [ ] Add Storybook icon catalog page (visual gallery with search).
- [ ] Icon search/discovery in documentation site.

**Acceptance Criteria:**
1. `pnpm --filter @cocso-ui/icons fetch:tabler -- --name search` fetches and adds the icon.
2. Storybook icon catalog renders all 83 icons with their names and categories.
3. Website icon page supports text search across icon names and tags.

## Visual Verification Strategy

To catch visual regressions that semantic string comparison might miss:

1. **Render-to-string snapshots** (Phase 2): `renderToStaticMarkup` for every generated React component, stored as `.snap` files. CI fails on any diff.
2. **Figma string comparison** (Phase 2): Generated `ICON_SVGS` keys and values compared against the current `shared.ts` for the 10 overlapping icons. Must be identical after `{color}` replacement.
3. **Storybook visual review** (Phase 4): Icon catalog page enables manual visual inspection. Consider adding Chromatic or Percy integration for automated visual regression in a future phase.

## Open Questions

- Should brand icons with custom viewBox sizes be normalized to a standard size?
  - **Recommendation:** Keep original viewBox; the Icon wrapper component handles sizing.
- Should we support icon variants (outline/filled) in the future?
  - **Recommendation:** Not in initial scope. Add when design team requests filled variants.
- How should custom brand icons updated in Figma be synced back to `svg/brand/`?
  - **Recommendation:** Manual export for now. Consider a Figma export script in Phase 4 if brand icon churn is high.
- Should Figma generation in Phase 2 cover all 83 icons or only the 10 currently consumed?
  - **Recommendation:** Start with the 10 currently consumed icons as the minimum viable output. Expand to all themeable icons (stroke + fill) in a follow-up. Hardcoded brand icons are excluded from `{color}` templating.
