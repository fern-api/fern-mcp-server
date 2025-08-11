# fern-mcp-server

Connect AI clients like Claude, Windsurf, and Cursor to the Fern MCP server for help with Fern's AI search (Ask Fern), documentation platform, and SDK generation.

Once configured, your AI client uses the `ask_fern_ai` command to query Fern's knowledge base, enabling contextual assistance with Fern's tools directly in your development environment.

> Note: These instructions assume you already have an MCP-compatible AI client installed (Claude Desktop, Cursor, Windsurf, etc.).

To get started with the Fern MCP server:

1. Clone this repository and navigate into the `fern-mcp-server` directory. 

1. Install dependencies and start the development server:

    ```shell
    npm install
    npm start
    ```

1. Add the MCP server configuration to your AI client's config file. The
   location of this file depends on which AI client you're using and your operating
   system. 
   
   More information on the exact location of this file and how to
   access or create it:

    * [Claude Desktop](https://modelcontextprotocol.io/quickstart/user)
    * [Cursor](https://docs.cursor.com/context/model-context-protocol)
    * [Windsurf](https://docs.windsurf.com/windsurf/mcp)

1. Add the following to your MCP config file:

    ```json
    {
      "mcpServers": {
        "fern": {
          "command": "node",
          "args": ["<PATH_TO_PROJECT>/fern-mcp-server/dist/index.js"]
        }
      }
    }
    ```
    Replace `PATH_TO_PROJECT` with your local path to the `fern-mcp-server` project. 

1. After saving the configuration file, restart your AI client. Once you
   restart, you can test the connection by asking questions like "What MCP servers are available?" or "Can you help me with Fern documentation?"

    ![Claude Desktop successfully integrated with Fern MCP](static/screenshot-1.png)
    ![How Claude Desktop uses Fern MCP to provide information](static/screenshot-2.png)
