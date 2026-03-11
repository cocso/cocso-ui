# project-baseframe-sources

## Goal

Provide a versioned YAML source registry of component definitions that serves as the single source of truth for the baseframe CLI to scaffold component code into consumer projects.

## Path

```
packages/baseframe/
```

## Runtime and Language

YAML (no runtime; data package only).

## Users

- `@cocso-ui/baseframe` CLI — reads YAML definitions to generate component files.
- Design system maintainers who author or update component definitions.

## In Scope

- `collections.yaml` — registry of all available component collections.
- `primitive/` and `semantic/` subdirectories — per-component YAML definition files.
- Published as `@cocso-ui/baseframe-sources` so the CLI can install and reference it.

## Out of Scope

- Runtime component code — owned by `@cocso-ui/react`.
- CLI implementation — owned by `@cocso-ui/baseframe` (ecosystem).

## Architecture

```
packages/baseframe/
├── collections.yaml     # Top-level registry of component collections
├── primitive/           # Primitive-level component YAML definitions
├── semantic/            # Semantic-level component YAML definitions
└── package.json         # Files: *.yaml, components/*.yaml
```

YAML files are the sole artifact. No transpilation or bundling.

## Interfaces

Consumed by `@cocso-ui/baseframe` CLI via filesystem reads after npm install.

File conventions:
- `collections.yaml` — lists available components with metadata.
- Per-component YAML — defines file templates, dependencies, and configuration.

## Storage

Static YAML files published to npm. No runtime state.

## Security

- No scripts or network access at runtime.
- YAML content is consumed by the CLI; authors must not include executable code in YAML.

## Logging

Not applicable.

## Build and Test

No build step. Files are published as-is.

```sh
# Lint
pnpm --filter @cocso-ui/baseframe-sources lint
```

## Roadmap

- Expand component definitions to cover all `@cocso-ui/react` components.
- Add validation schema for YAML files.

## Open Questions

- None at this time.
