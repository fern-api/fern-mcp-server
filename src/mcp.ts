#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import * as api from "./api";

// Create an MCP server
export function createMcpServer(name: string, version: string) {
  return new McpServer({
    name: name,
    version: version,
  });
}

// Register MCP tools
export function registerMcpTools(server: McpServer) {
  server.tool("chat", { message: z.string() }, async ({ message }) => {
    const result = await api.postChat(message);
    return {
      content: [{ type: "text", text: result }],
    };
  });
}
