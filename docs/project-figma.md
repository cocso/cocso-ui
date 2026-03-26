# project-figma

## Goal

Sync cocso-ui design tokens from baseframe YAML definitions to Figma Variables via a Figma Plugin, enabling designers to use the design system's token palette directly inside Figma without manual entry.

## Path

```
packages/figma/
```

## Runtime and Language

Figma Plugin (TypeScript). Build output targets ES2017 IIFE for the Figma sandbox runtime.

## Users

- Designers using Figma who consume cocso-ui design tokens.
- Design system maintainers who update baseframe YAML token definitions.

## In Scope

- Pre-build script: parse baseframe YAML sources and generate structured JSON (`FigmaTokenData`).
- Figma Plugin controller: sync token data to Figma Variables via Plugin API.
- Figma Plugin UI: "Sync Tokens" button with progress and result display.
- Non-destructive upsert: create new variables, update existing, never delete.
- Token categories: color (HEX/RGBA), spacing, radius, font-size, font-weight, z-index, shadow primitives.
- Composite shadow detection and skip reporting.
- Unit tests for pure function layer (97%+ coverage).

## Out of Scope

- Figma Variable Alias (semantic → primitive reference preservation) — planned for Phase 2.
- Composite shadow tokens as Figma Effect Styles — planned for Phase 2.
- Component generation in Figma — planned for Phase 2.
- Dark mode / multi-mode support — planned for Phase 2 when collections.yaml adds modes.
- Figma REST API integration (Enterprise-only for Variables write).
- npm publishing (package is `private: true`).

## Architecture

### Pre-build Boundary

The package uses a pre-build boundary to decouple from `ecosystem/baseframe` core modules:

```
YAML sources (@cocso-ui/baseframe-sources)
    ↓ (pre-build: scripts/generate-tokens.ts)
FigmaTokenData JSON (src/generated/tokens.json)
    ↓ (esbuild: inlined into controller.js bundle)
Figma Plugin runtime (src/plugin/controller.ts)
    ↓ (Figma Plugin API)
Figma Variables
```

- **Pre-build** (`scripts/generate-tokens.ts`): Independent lightweight parser (~100 lines) reads YAML, resolves TokenRefs to final values, converts colors to 0-1 RGBA, strips px units, detects composite shadows. Outputs `FigmaTokenData` JSON.
- **Plugin runtime** (`src/plugin/controller.ts`): Loads inlined JSON, converts to Figma Variable creation parameters, performs non-destructive upsert via Figma Plugin API.
- **Plugin UI** (`src/ui/index.html`): Plain HTML/CSS/JS. Displays sync button, progress, results, and skipped token report.

### Module Responsibilities

| Module | Responsibility | Figma API dependency |
|--------|---------------|---------------------|
| `scripts/generate-tokens.ts` | YAML → JSON conversion | None |
| `src/core/token-converter.ts` | JSON → Figma params (pure function) | None |
| `src/core/color-converter.ts` | Color validation (pure function) | None |
| `src/core/variable-creator.ts` | Figma Variable upsert | Yes |
| `src/plugin/controller.ts` | Message handling, orchestration | Yes |

## Interfaces

### FigmaTokenData JSON Schema

The pre-build output conforms to `src/types/token-schema.ts`:

- `FigmaTokenData`: root type with `schemaVersion`, `collections`, `tokens`, `skipped`.
- `FigmaTokenDef`: individual token with `name`, `sourceTokenName`, `collection`, `resolvedType` (`COLOR` | `FLOAT`), `values`.
- `FigmaColorValue`: `{ r, g, b, a }` in 0-1 range.
- `FigmaSkippedToken`: `{ sourceTokenName, reason }`.

### Plugin Messages

- UI → Controller: `{ type: "sync-tokens" }`
- Controller → UI: `{ type: "sync-start" }`, `{ type: "sync-complete", result }`, `{ type: "sync-error", error }`

## Storage

- `src/generated/tokens.json`: Pre-build output, gitignored. Regenerated on every build.
- `dist/`: Build output (controller.js, ui.html, manifest.json), gitignored.

## Security

- No secrets or credentials required for Plugin API usage.
- No network requests from the plugin.
- Token data is read-only from YAML sources and embedded in the bundle.

## Logging

- Pre-build script logs generated/skipped token counts to stdout.
- Plugin UI displays sync results (created/updated/skipped counts) and error details.

## Build and Test

### Commands

| Command | Description |
|---------|-------------|
| `pnpm generate` | Run pre-build: YAML → `src/generated/tokens.json` |
| `pnpm build` | Pre-build + esbuild bundle + copy UI/manifest to `dist/` |
| `pnpm test` | Run unit tests (vitest) |
| `pnpm test:coverage` | Run tests with V8 coverage report |
| `pnpm lint` | Run Biome checks |
| `pnpm lint:fix` | Auto-fix Biome issues |
| `pnpm check-types` | TypeScript type check |

### Build Pipeline

1. `prebuild` → `pnpm generate` (tsx scripts/generate-tokens.ts)
2. `build` → `node build.js` (esbuild IIFE ES2017 + copy html/manifest)

### Test Strategy

- Pure function unit tests: `generate-tokens.test.ts`, `token-converter.test.ts`, `color-converter.test.ts`
- Coverage target: 80%+ on `scripts/` and `src/core/{token,color}-converter.ts`
- `variable-creator.ts` excluded from coverage (Figma API dependency, verified manually)
- Manual Figma verification: V1-V5 checklist (see Roadmap)

## Roadmap

### Phase 1 (current)

- [x] Package scaffolding and monorepo integration
- [x] Pre-build token generator with independent parser
- [x] Plugin runtime core (token-converter, color-converter, variable-creator)
- [x] Plugin controller and UI
- [x] Unit tests (97%+ coverage on pure function layer)
- [x] Documentation

### Phase 2 (planned)

- [ ] Figma Variable Alias for semantic → primitive token references
- [ ] Composite shadow tokens as Figma Effect Styles
- [ ] Component generation (Button, Badge, Input, Typography, etc.)
- [ ] Dark mode support (multi-mode collections)

## Open Questions

- Figma plan level (Free/Pro/Organization/Enterprise) affects REST API options for future CI integration.
- Phase 2 component generation may require additional YAML schema or React component code extraction.
- Parser drift risk: baseframe YAML format changes require manual sync to the independent parser.
