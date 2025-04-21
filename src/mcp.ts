#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import * as api from "./api.js";
import { DB } from "./db.js";

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
export function registerMcpTools(server: McpServer, db: DB) {
  server.tool(
    "ask_fern_ai",
    `Ask Fern AI about anything related to Fern.
Don't include a threadId in your initial message.
If a message requires a follow-up, include the threadId in your follow-up messages until the thread is resolved.`,
    { question: z.string(), threadId: z.string().optional() },
    async ({ question, threadId: _threadId }) => {
      // Issue a new thread ID if none is provided
      const threadId = _threadId ?? uuidv4();
      await db.read();
      const thread = [...(db.data.threads[threadId] ?? [])];

      // Create a user message
      thread.push({ role: "user" as const, content: question });

      // Post the question to the API
      const answer = await api.postChat(thread);

      // Create an assistant message
      thread.push({ role: "assistant" as const, content: answer });

      console.error(thread);

      // Update the thread state
      db.update(({ threads }) => {
        threads[threadId] = thread;
      });

      // Return the answer (last message in the thread)
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              threadId: threadId,
              thread: thread,
            }),
          },
        ],
      };
    }
  );
}
