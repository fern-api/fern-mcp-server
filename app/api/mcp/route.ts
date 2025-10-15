import { createMcpHandler } from "mcp-handler";
import * as mcpServer from "../../../src/server";
import * as mcpTools from "../../../src/tools";

const handler = createMcpHandler(
  (server) => {
    mcpTools.registerAskFernTool(server);
  },
  mcpServer.baseOptions,
  { basePath: "/api" }
);

export { handler as GET, handler as POST, handler as DELETE };
