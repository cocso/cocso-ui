import { registerTools, SERVER_NAME, SERVER_VERSION } from "@cocso-ui/mcp";
import { createMcpHandler } from "mcp-handler";

export const runtime = "nodejs";
export const maxDuration = 60;

const handler = createMcpHandler(
  (server) => {
    registerTools(server);
  },
  {
    serverInfo: {
      name: SERVER_NAME,
      version: SERVER_VERSION,
    },
  },
  {
    basePath: "/api",
    disableSse: true,
    maxDuration,
    verboseLogs:
      process.env.NODE_ENV === "development" ||
      process.env.MCP_VERBOSE === "true",
  }
);

export { handler as GET, handler as POST };
