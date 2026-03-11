# project-baseframe-cli

## Goal

Provide a CLI tool that reads YAML design token definitions from `@cocso-ui/baseframe-sources` and generates CSS custom properties (`token.css`) and TailwindCSS v4 theme files (`tailwind4.css`) for use in the cocso UI design system.

## Path

```
ecosystem/baseframe/
```

## Runtime and Language

Node.js >= 22 (TypeScript, compiled to ESM via esbuild).

## Users

- Design system maintainers who regenerate `packages/css/token.css` and `packages/css/tailwind4.css` after updating YAML token definitions.

## In Scope

- `baseframe` CLI binary.
- `css-vars` command — generates CSS custom properties with a configurable prefix (`--ds-*`).
- `tailwindcss` command — generates TailwindCSS v4 `@theme` + `@utility` file using 2-layer pattern.
- Reads token definitions from `@cocso-ui/baseframe-sources` (installed via workspace link).

## Out of Scope

- Component scaffolding.
- Runtime component logic — owned by `@cocso-ui/react`.
- YAML source authoring — owned by `packages/baseframe` (`@cocso-ui/baseframe-sources`).

## Architecture

### 2-Layer Output Pattern

```
Layer 1 — token.css      :root { --ds-color-white: #ffffff; }
Layer 2 — tailwind4.css  @theme { --color-white: var(--ds-color-white); }
                         @utility z-* { z-index: --value(--z-index-*); }
```

`packages/react/` components reference `--ds-*` directly (Layer 1). Tailwind utilities use the standard `--color-*` namespace (Layer 2).

### Source Structure

```
ecosystem/baseframe/
├── src/
│   ├── cli/index.ts              # CLI entry (yargs commands)
│   └── core/
│       ├── builders/
│       │   ├── utils/naming.ts   # Shared createVarName utility
│       │   ├── css-vars.ts       # Layer 1 generator
│       │   └── tailwind.ts       # Layer 2 generator
│       ├── transforms/           # Token resolution (Map-based)
│       ├── parsers/              # Value parsing (hex lowercase)
│       └── types/
├── bin/index.js                  # Compiled output
└── build.js                      # esbuild build script
```

## Interfaces

### CLI Commands

| Command | Options | Description |
|---|---|---|
| `baseframe css-vars [dir]` | `--prefix <p>` | Generate CSS variables (default prefix: `ds`) |
| `baseframe tailwindcss [dir]` | | Generate TailwindCSS v4 theme file |

### Output Files

| File | Content |
|---|---|
| `token.css` | `:root { --ds-<token>: <value>; }` |
| `tailwind4.css` | `@theme { --<token>: var(--ds-<token>); }` + `@utility z-*` |

## Storage

- Reads: `@cocso-ui/baseframe-sources` YAML files from node_modules.
- Writes: CSS files to the specified output directory.
- No persistent state.

## Security

- Writes files to the specified output directory only.
- No network requests at runtime.
- Validates YAML input before generation.

## Logging

- CLI output uses ANSI color (banner + status) by default.
- Opt-out via `NO_COLOR=1`.

## Build and Test

```sh
# Build (esbuild)
pnpm --filter @cocso-ui/baseframe build

# Type check
pnpm --filter @cocso-ui/baseframe check-types

# Tests (vitest, 28+ tests including golden-file snapshots)
pnpm --filter @cocso-ui/baseframe test

# Lint
pnpm --filter @cocso-ui/baseframe lint
```

CI expects: `build`, `check-types`, `test`, `lint` to pass.

## Open Questions

- None at this time.
