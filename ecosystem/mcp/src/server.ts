import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SERVER_NAME, SERVER_VERSION } from "./config.js";
import { registerTools as registerCocsoTools } from "./tools.js";

export function createCocsoMcpServer(): McpServer {
  const server = new McpServer({
    name: SERVER_NAME,
    version: SERVER_VERSION,
  });

  registerCocsoTools(server);

  return server;
}

export { SERVER_NAME, SERVER_VERSION } from "./config.js";
export { registerTools } from "./tools.js";
