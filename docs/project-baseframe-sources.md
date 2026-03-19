# project-baseframe-sources

## Goal

Provide a versioned YAML source registry of design tokens (colors, shadows, spacing, z-index, font-weight) that serves as the single source of truth for the baseframe CLI to generate CSS custom properties and TailwindCSS theme files.

## Path

```
packages/baseframe/
```

## Runtime and Language

YAML (no runtime; data package only).

## Users

- `@cocso-ui/baseframe` CLI — reads YAML definitions to generate `token.css` and `tailwind4.css`.
- Design system maintainers who author or update token definitions.

## In Scope

- `collections.yaml` — defines token collections and modes.
- `primitive/` — raw value tokens (color, font-weight, shadow, spacing, z-index).
- `semantic/` — alias tokens that reference primitive tokens.
- Published as `@cocso-ui/baseframe-sources` so the CLI can install and reference it.

## Out of Scope

- Runtime component code — owned by `@cocso-ui/react`.
- CLI implementation — owned by `@cocso-ui/baseframe` (ecosystem).

### YAML Schema

### Token File

```yaml
kind: Tokens
metadata:
  id: <id>
  name: <display name>
  description: <description>
data:
  collection: global        # Must match a collection in collections.yaml
  tokens:
    $<collection>.<name>:   # Token name: dollar sign + collection + dot + name
      values:
        default: <value>    # Literal value or token reference
```

### Collections File

```yaml
kind: TokenCollections
metadata:
  id: collections
  name: collections
data:
  - name: global
    modes:
      - default
```

### Token Naming Rules

Token names follow the pattern `$<collection>.<rest>`:

| Pattern | Example | CSS variable |
|---|---|---|
| `$color.<name>` | `$color.neutral-950` | `--cocso-color-neutral-950` |
| `$font-weight.<name>` | `$font-weight.bold` | `--cocso-font-weight-bold` |
| `$shadow.<name>` | `$shadow.1` | `--cocso-shadow-1` |
| `$spacing.<name>` | `$spacing.8` | `--cocso-spacing-8` |
| `$z-index.<name>` | `$z-index.modal` | `--cocso-z-index-modal` |

Dots in token names become hyphens in CSS variables. Use hyphens (not dots) within name segments: `$color.neutral-950` not `$color.neutral.950`.

### Token References

Semantic tokens reference primitive tokens using the same `$<collection>.<name>` pattern:

```yaml
$color.text.primary:
  values:
    default: $color.neutral-950  # References $color.neutral-950 (hyphen, not dot)
```

The referenced token name must exactly match an existing token key. Use hyphens for multi-word names within a segment.

## Architecture

```
packages/baseframe/
├── collections.yaml        # Token collection registry (global / default mode)
├── primitive/              # Raw value tokens
│   ├── color.yaml          # $color.white, $color.neutral-*, $color.primary-*, ...
│   ├── font-weight.yaml    # $font-weight.thin through $font-weight.black
│   ├── shadow.yaml         # $shadow.1 through $shadow.4, shadow dimensions
│   ├── spacing.yaml        # $spacing.0 through $spacing.max
│   └── z-index.yaml        # $z-index.behind through $z-index.modal-content
└── semantic/               # Alias tokens
    └── color.yaml          # $color.alpha.*, $color.text.*
```

## Interfaces

Package interface:

| Surface | Description |
|---|---|
| `@cocso-ui/baseframe-sources` | Versioned token source package consumed by `@cocso-ui/baseframe` |
| `collections.yaml` | Collection/mode registry contract used by parsers |
| `primitive/*.yaml` | Primitive token definitions |
| `semantic/*.yaml` | Alias token definitions referencing primitive tokens |

## Storage

Static YAML files published to npm. No runtime state.

## Security

- No scripts or network access at runtime.
- YAML content is consumed by the CLI; authors must not include executable code in YAML.

## Logging

Not applicable. This package contains static YAML data and has no runtime process.

## Build and Test

No build step. Files are published as-is.

```sh
# Lint
pnpm --filter @cocso-ui/baseframe-sources lint

# Verify npm pack includes all YAML files
npm pack --dry-run
```

## Roadmap

- Expand primitive token categories (e.g. motion, opacity) as design system needs grow.
- Add schema validation tooling to catch contract drift before publish.

## Open Questions

- None at this time.
