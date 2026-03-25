## `@cocso-ui/cocso-mcp`

MCP server that helps AI assistants discover and reuse existing `@cocso-ui` components before generating new UI code.

### Why

When assistants generate pages without discovery, they often recreate components that already exist in `@cocso-ui/react`.
This server enforces a search-first workflow using the existing `llms.txt` + markdown docs published on `cocso-ui.com`.

### Tools

- `cocso_list_components`
- `cocso_search_components`
- `cocso_get_component_spec`
- `cocso_get_usage_guardrails`
- `cocso_plan_page_components`

### Usage

```bash
pnpm --filter @cocso-ui/cocso-mcp build
pnpm --filter @cocso-ui/cocso-mcp test

# stdio MCP server entrypoint
pnpm --filter @cocso-ui/cocso-mcp exec cocso-mcp
```
