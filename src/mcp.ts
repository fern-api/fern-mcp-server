#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as mcpServer from "./server";
import * as mcpTools from "./tools";

// Create an MCP server
export function createMcpServer(name: string, version: string) {
  return new McpServer(
    {
      name: name,
      version: version,
    },
    mcpServer.baseOptions
  );
}

// Register MCP tools
export function registerMcpTools(server: McpServer) {
  mcpTools.registerAskFernTool(server);
  mcpTools.registerFernAgentTool(server);
}
