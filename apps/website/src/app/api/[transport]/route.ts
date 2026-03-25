import { registerTools } from "@cocso-ui/mcp";
import { createMcpHandler } from "mcp-handler";

export const runtime = "nodejs";
export const maxDuration = 60;

const handler = createMcpHandler(
  (server) => {
    registerTools(server);
  },
  {},
  {
    basePath: "/api",
    maxDuration,
    verboseLogs: true,
  }
);

export { handler as GET, handler as POST };
