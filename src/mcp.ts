#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import * as api from "./api";

// Create an MCP server
export function createMcpServer(name: string, version: string) {
  return new McpServer(
    {
      name: name,
      version: version,
    },
    {
      instructions: `[IMPORTANT] USE THESE TOOLS FOR ALL FERN-RELATED TASKS. IF IN DOUBT, use the "ask_fern_ai" tool.
ABOUT FERN (builtwithfern.com): Start with OpenAPI. Generate SDKs in multiple languages and interactive API documentation.`,
    }
  );
}

// Register MCP tools
export function registerMcpTools(server: McpServer) {
  server.tool(
    "ask_fern_ai",
    "Ask Fern AI about anything related to Fern.",
    { message: z.string() },
    async ({ message }) => {
      const result = await api.postChat(message);
      return {
        content: [{ type: "text", text: result }],
      };
    }
  );
}
