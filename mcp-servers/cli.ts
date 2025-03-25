import { McpServer, StdioServerTransport } from "./deps.ts";
import { registerAddTool } from "./mod.ts";

if (import.meta.main) {
  const server = new McpServer({
    name: "add-server",
    version: "1.0.0",
  });
  registerAddTool(server);
  await server.connect(new StdioServerTransport());
  console.error("MCP Server started");
}
