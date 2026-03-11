# project-baseframe-cli

## Goal

Provide a CLI tool that reads component definitions from `@cocso-ui/baseframe-sources` and scaffolds component files directly into a consumer project, removing manual copy-paste overhead when adopting cocso UI components.

## Path

```
ecosystem/baseframe/
```

## Runtime and Language

Node.js >= 22 (TypeScript, compiled to ESM via esbuild).

## Users

- Frontend engineers in consumer projects who run `npx baseframe` or `bunx baseframe` to install components.

## In Scope

- `baseframe` CLI binary.
- Commands to list, add, and manage components from the YAML source registry.
- Reads component definitions from `@cocso-ui/baseframe-sources`.
- Writes generated component files into the consumer project.

## Out of Scope

- Component runtime logic — owned by `@cocso-ui/react`.
- YAML source authoring — owned by `packages/baseframe` (`@cocso-ui/baseframe-sources`).

## Architecture

```
ecosystem/baseframe/
├── src/
│   ├── cli/index.ts     # CLI entry point (yargs command definitions)
│   └── core/index.ts    # Core scaffolding logic
├── bin/index.js         # Compiled output (published binary)
├── build.js             # esbuild build script
└── package.json         # bin: { baseframe: bin/index.js }
```

Build pipeline: TypeScript source → esbuild → `bin/index.js` (single ESM bundle).

## Interfaces

### CLI Commands

| Command | Description |
|---|---|
| `baseframe add <component>` | Scaffold a component into the consumer project |
| `baseframe list` | List all available components |

### Binary

```sh
baseframe <command> [options]
```

Published as `@cocso-ui/baseframe` with `bin.baseframe` pointing to `bin/index.js`.

## Storage

- Reads: `@cocso-ui/baseframe-sources` YAML files from node_modules.
- Writes: Component files into the consumer project working directory.
- No persistent state between runs.

## Security

- Writes files to the current working directory only.
- No network requests at runtime.
- Validates YAML input before file generation.

## Logging

- CLI output uses ANSI color by default for readability.
- Opt-out via `NO_COLOR=1` environment variable.
- Structured log fields: `component`, `action`, `target_path`.

## Build and Test

```sh
# Build (esbuild)
pnpm --filter @cocso-ui/baseframe build

# Lint
pnpm --filter @cocso-ui/baseframe lint
```

CI expects: `build`, `lint` to pass.

## Roadmap

- Add `baseframe update` command to sync existing components to latest version.
- Add interactive TUI mode for component selection.

## Open Questions

- None at this time.
