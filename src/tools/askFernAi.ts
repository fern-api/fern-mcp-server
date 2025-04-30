import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as api from "../core/api";
import { askFernAiRequest } from "../schemas";
import z, { ZodRawShape } from "zod";

export const name = "ask_fern_ai";
export const description = "Ask Fern AI about anything related to Fern.";
export const paramsSchema = askFernAiRequest.shape;

export function register(server: McpServer) {
  return server.tool(name, description, paramsSchema, async (params) => {
    const result = await api.askFernAi(params);
    return {
      content: [{ type: "text", text: result }],
    };
  });
}
