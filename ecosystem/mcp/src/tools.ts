import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod/v4";
import { DEFAULT_MAX_RESULTS, IMPORT_PACKAGE_BY_PLATFORM } from "./config.js";
import { getComponentMarkdown } from "./docs.js";
import { getUsageGuardrails } from "./guardrails.js";
import { LogStatus, log } from "./logger.js";
import {
  listComponents,
  rankComponentsForPrompt,
  searchComponents,
} from "./registry.js";
import { PlatformId } from "./types.js";

const platformSchema = z.enum([PlatformId.REACT, PlatformId.REACT_NATIVE]);

const listComponentsSchema = z.object({
  platform: platformSchema.default(PlatformId.REACT),
});

const searchComponentsSchema = z.object({
  platform: platformSchema.default(PlatformId.REACT),
  query: z.string().min(2),
  maxResults: z.number().int().min(1).max(20).default(DEFAULT_MAX_RESULTS),
});

const getComponentSpecSchema = z.object({
  platform: platformSchema.default(PlatformId.REACT),
  component: z.string().min(1),
});

const planPageComponentsSchema = z.object({
  platform: platformSchema.default(PlatformId.REACT),
  pageRequest: z.string().min(3),
  maxResults: z.number().int().min(1).max(20).default(DEFAULT_MAX_RESULTS),
});

const ToolContractId = {
  LIST_COMPONENTS: "cocso_ui_mcp_list_components",
  SEARCH_COMPONENTS: "cocso_ui_mcp_search_components",
  GET_COMPONENT_SPEC: "cocso_ui_mcp_get_component_spec",
  GET_USAGE_GUARDRAILS: "cocso_ui_mcp_get_usage_guardrails",
  PLAN_PAGE_COMPONENTS: "cocso_ui_mcp_plan_page_components",
} as const;

function asTextResult(
  text: string,
  structuredContent?: Record<string, unknown>,
  isError = false
) {
  return {
    isError,
    content: [{ type: "text" as const, text }],
    structuredContent,
  };
}

function normalizeName(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, "-");
}

function matchComponentName(
  componentInput: string,
  slug: string,
  title: string
): boolean {
  const normalizedInput = normalizeName(componentInput);
  return (
    normalizedInput === normalizeName(slug) ||
    normalizedInput === normalizeName(title)
  );
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    ToolContractId.LIST_COMPONENTS,
    {
      title: "List cocso-ui components",
      description:
        "List available design-system components for a platform. Use this before generating any custom component.",
      inputSchema: listComponentsSchema,
    },
    async ({ platform }) => {
      const startedAt = Date.now();
      const components = await listComponents(platform);

      const lineItems = components.map(
        (component) =>
          `- ${component.title} (${component.slug}) from ${component.importPackage}`
      );

      log({
        event: "tool_completed",
        tool: ToolContractId.LIST_COMPONENTS,
        status: LogStatus.SUCCESS,
        durationMs: Date.now() - startedAt,
        details: { platform, count: components.length },
      });

      return asTextResult(
        lineItems.length > 0
          ? lineItems.join("\n")
          : "No components are registered for this platform yet.",
        {
          platform,
          importPackage: IMPORT_PACKAGE_BY_PLATFORM[platform],
          components,
        }
      );
    }
  );

  server.registerTool(
    ToolContractId.SEARCH_COMPONENTS,
    {
      title: "Search cocso-ui components",
      description:
        "Search existing design-system components by intent keywords before writing UI code.",
      inputSchema: searchComponentsSchema,
    },
    async ({ platform, query, maxResults }) => {
      const startedAt = Date.now();
      const matches = await searchComponents(query, platform, maxResults);

      const lineItems = matches.map(
        (component) =>
          `- ${component.title}: ${component.description} (${component.slug})`
      );

      log({
        event: "tool_completed",
        tool: ToolContractId.SEARCH_COMPONENTS,
        status: LogStatus.SUCCESS,
        durationMs: Date.now() - startedAt,
        details: { platform, query, count: matches.length },
      });

      return asTextResult(
        lineItems.length > 0
          ? lineItems.join("\n")
          : "No matching components found. If this remains true after list+search, propose extending @cocso-ui package instead of local duplication.",
        {
          platform,
          query,
          importPackage: IMPORT_PACKAGE_BY_PLATFORM[platform],
          matches,
        }
      );
    }
  );

  server.registerTool(
    ToolContractId.GET_COMPONENT_SPEC,
    {
      title: "Get cocso-ui component spec",
      description:
        "Get the canonical markdown spec for a design-system component, including usage and API details.",
      inputSchema: getComponentSpecSchema,
    },
    async ({ platform, component }) => {
      const startedAt = Date.now();
      const components = await listComponents(platform);
      const target = components.find((entry) =>
        matchComponentName(component, entry.slug, entry.title)
      );

      if (!target) {
        log({
          event: "tool_completed",
          tool: ToolContractId.GET_COMPONENT_SPEC,
          status: LogStatus.WARNING,
          durationMs: Date.now() - startedAt,
          details: { component, platform },
        });

        return asTextResult(
          `Component not found: ${component}. Run ${ToolContractId.LIST_COMPONENTS} or ${ToolContractId.SEARCH_COMPONENTS} first.`,
          {
            platform,
            component,
            found: false,
          }
        );
      }

      let markdown: string;
      try {
        markdown = await getComponentMarkdown(target);
      } catch (error) {
        log({
          event: "tool_completed",
          tool: ToolContractId.GET_COMPONENT_SPEC,
          status: LogStatus.ERROR,
          durationMs: Date.now() - startedAt,
          details: {
            component: target.slug,
            platform,
            reason: error instanceof Error ? error.message : String(error),
          },
        });

        return asTextResult(
          `Failed to load component spec for ${target.slug}. Please retry or check documentation availability.`,
          {
            found: false,
            platform,
            component: target,
          },
          true
        );
      }

      log({
        event: "tool_completed",
        tool: ToolContractId.GET_COMPONENT_SPEC,
        status: LogStatus.SUCCESS,
        durationMs: Date.now() - startedAt,
        details: { component: target.slug, platform },
      });

      return asTextResult(markdown, {
        found: true,
        platform,
        component: target,
      });
    }
  );

  server.registerTool(
    ToolContractId.GET_USAGE_GUARDRAILS,
    {
      title: "Get cocso-ui usage guardrails",
      description:
        "Return anti-duplication and package-first rules that AI should follow when generating UI.",
      inputSchema: listComponentsSchema,
    },
    ({ platform }) => {
      const startedAt = Date.now();
      const rules = getUsageGuardrails(platform);

      log({
        event: "tool_completed",
        tool: ToolContractId.GET_USAGE_GUARDRAILS,
        status: LogStatus.SUCCESS,
        durationMs: Date.now() - startedAt,
        details: { platform, ruleCount: rules.length },
      });

      return asTextResult(
        rules.map((rule) => `- [${rule.id}] ${rule.rule}`).join("\n"),
        {
          platform,
          importPackage: IMPORT_PACKAGE_BY_PLATFORM[platform],
          rules,
        }
      );
    }
  );

  server.registerTool(
    ToolContractId.PLAN_PAGE_COMPONENTS,
    {
      title: "Plan cocso-ui components for page request",
      description:
        "Map a natural language page request to existing cocso-ui components to avoid duplicate custom implementation.",
      inputSchema: planPageComponentsSchema,
    },
    async ({ platform, pageRequest, maxResults }) => {
      const startedAt = Date.now();
      const components = await listComponents(platform);
      const picks = rankComponentsForPrompt(
        pageRequest,
        components,
        maxResults
      );

      const lines = picks.map(
        (component) =>
          `- ${component.title} (${component.slug})\n  - import: ${component.importPackage}\n  - reason: ${component.description}`
      );

      log({
        event: "tool_completed",
        tool: ToolContractId.PLAN_PAGE_COMPONENTS,
        status: LogStatus.SUCCESS,
        durationMs: Date.now() - startedAt,
        details: { platform, pickCount: picks.length },
      });

      return asTextResult(
        lines.length > 0
          ? lines.join("\n")
          : `No direct matches found. Use ${ToolContractId.SEARCH_COMPONENTS} with narrower keywords before proposing a new component.`,
        {
          platform,
          pageRequest,
          importPackage: IMPORT_PACKAGE_BY_PLATFORM[platform],
          picks,
        }
      );
    }
  );
}
