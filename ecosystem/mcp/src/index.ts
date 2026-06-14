#!/usr/bin/env node

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { SERVER_NAME, SERVER_VERSION } from "./config.js";
import { LogStatus, log } from "./logger.js";
import { createCocsoMcpServer } from "./server.js";

async function main(): Promise<void> {
  const server = createCocsoMcpServer();

  const transport = new StdioServerTransport();
  await server.connect(transport);

  log({
    event: "server_started",
    status: LogStatus.SUCCESS,
    details: {
      name: SERVER_NAME,
      version: SERVER_VERSION,
      transport: "stdio",
    },
  });
}

main().catch((error: unknown) => {
  log({
    event: "server_start_failed",
    status: LogStatus.ERROR,
    details: {
      error: error instanceof Error ? error.message : String(error),
    },
  });
  process.exit(1);
});
