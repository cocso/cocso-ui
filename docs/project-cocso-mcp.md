# project-cocso-mcp

## Goal

Provide an MCP server dedicated to `@cocso-ui` so AI coding assistants can discover existing design-system components first and avoid generating duplicate custom components.

## Path

```
ecosystem/cocso-mcp/
```

## Runtime and Language

Node.js 22+ (TypeScript, ESM).

## Users

- Frontend engineers using AI assistants to generate React UI code.
- Design system maintainers who want consistent `@cocso-ui` usage.
- AI agents that need machine-readable component discovery and documentation access.

## In Scope

- MCP stdio server for local AI client integration.
- Component discovery tools (`list`, `search`, `spec`).
- Documentation retrieval from existing `llms.txt` and component markdown endpoints.
- Guardrail guidance that enforces `@cocso-ui/react` usage before custom implementation.
- Extensible platform model for React now and React Native later.

## Out of Scope

- Hosting a remote MCP server in this phase.
- Automatic code rewriting in consumer repositories.
- New component authoring pipeline.
- Full React Native component registry before `@cocso-ui/react-native` is available.

## Architecture

```
ecosystem/cocso-mcp/
├── src/
│   ├── config.ts              # Stable endpoint and package constants
│   ├── registry.ts            # llms.txt parser and component registry cache
│   ├── docs.ts                # Markdown document fetch helpers
│   ├── guardrails.ts          # Usage and anti-duplication guidance
│   ├── tools.ts               # MCP tool registration
│   └── index.ts               # MCP server bootstrap (stdio transport)
├── package.json
└── tsconfig.json
```

- Server bootstrap uses MCP SDK `McpServer` + `StdioServerTransport`.
- Registry layer fetches and caches component metadata from `https://www.cocso-ui.com/llms.txt`.
- Tool layer exposes search-first APIs so agents query existing components before generating UI.

## Interfaces

### Platform Enum

- `PlatformId.REACT`
- `PlatformId.REACT_NATIVE` (planned behavior until package exists)

### Tool Contracts

- `cocso_list_components`: return all components with canonical import package.
- `cocso_search_components`: return ranked components by query text.
- `cocso_get_component_spec`: return markdown spec for one component.
- `cocso_get_usage_guardrails`: return stable anti-duplication rules.
- `cocso_plan_page_components`: suggest reusable `@cocso-ui` components from a page request.

### Integration Contracts

- Docs index source: `https://www.cocso-ui.com/llms.txt`
- Component spec source: `https://cocso-ui.com/components/<slug>.md`
- Primary package contract: `@cocso-ui/react`
- Planned package contract: `@cocso-ui/react-native`

## Storage

- In-memory LRU-like cache (process-local Map with TTL) for:
  - Parsed component registry
  - Component markdown payloads
- No persistent storage in v1.

## Security

- Read-only network access to public `cocso-ui.com` docs endpoints.
- No secrets, tokens, or private API credentials required.
- Input validation for all tool arguments before network requests.

## Logging

- Structured logs to stderr for operational troubleshooting.
- Minimum fields: `event`, `tool`, `durationMs`, `status`, `details`.
- ANSI color by default; opt-out controlled by `NO_COLOR`.

## Build and Test

```sh
pnpm --filter @cocso-ui/cocso-mcp lint
pnpm --filter @cocso-ui/cocso-mcp check-types
pnpm --filter @cocso-ui/cocso-mcp build
pnpm --filter @cocso-ui/cocso-mcp test
```

Repository-level validation:

```sh
pnpm check
pnpm build
```

CI expects package lint/type/build/tests to pass.

## Roadmap

- Add React Native registry once `@cocso-ui/react-native` is available.
- Add design-token query tools (`colors`, `typography`, `spacing`).
- Add optional local workspace introspection tool to detect duplicate custom components.
- Add remote transport mode for centralized team-wide MCP deployment.

## Open Questions

- Should React Native docs be served from the same domain or a separate endpoint?
- Which AI clients (Cursor, Claude Desktop, others) will be officially supported first?
