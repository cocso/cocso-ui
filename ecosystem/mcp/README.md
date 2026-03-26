## `@cocso-ui/mcp`

MCP server that helps AI assistants discover and reuse existing `@cocso-ui` components before generating new UI code.

### Why

When assistants generate pages without discovery, they often recreate components that already exist in `@cocso-ui/react`.
This server enforces a search-first workflow using the existing `llms.txt` + markdown docs published on `cocso-ui.com`.

### Tools

- `cocso_ui_mcp_list_components`
- `cocso_ui_mcp_search_components`
- `cocso_ui_mcp_get_component_spec`
- `cocso_ui_mcp_get_usage_guardrails`
- `cocso_ui_mcp_plan_page_components`

### Usage

```bash
pnpm --filter @cocso-ui/mcp build
pnpm --filter @cocso-ui/mcp test

# stdio MCP server entrypoint
pnpm --filter @cocso-ui/mcp exec cocso-ui-mcp
```
