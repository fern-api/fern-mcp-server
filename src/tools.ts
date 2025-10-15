import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { postChat } from "./api";
import { runWorkflow } from "./agent";

// Shared tool registration logic for both MCP server and API handler
export function registerAskFernTool(server: McpServer) {
  server.tool(
    "ask_fern_ai",
    "Ask Fern AI about anything related to Fern.",
    { message: z.string() },
    async ({ message }: { message: string }) => {
      try {
        const result = await postChat(message);
        return {
          content: [{ type: "text", text: result }],
        };
      } catch (error: any) {
        return {
          content: [{ type: "text", text: "[ERROR] " + error.message }],
          isError: true,
        };
      }
    }
  );
}

export function registerFernAgentTool(server: McpServer) {
  server.tool(
    "fern_agent",
    "Run the Fern agent workflow to answer questions about Fern, explore analytics, edit docs sites, or handle general queries.",
    { input_as_text: z.string() },
    async ({ input_as_text }: { input_as_text: string }) => {
      try {
        const result = await runWorkflow({ input_as_text });
        return {
          content: [{ type: "text", text: result.output_text }],
        };
      } catch (error: any) {
        return {
          content: [{ type: "text", text: "[ERROR] " + error.message }],
          isError: true,
        };
      }
    }
  );
}
