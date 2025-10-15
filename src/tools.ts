import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { postChat } from "./api";

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
