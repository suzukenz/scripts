import {
  Client,
  expect,
  InMemoryTransport,
  McpServer,
  StdioServerTransport,
} from "./deps.ts";
import { registerAddTool } from "./mod.ts";

const server = new McpServer({
  name: "test-server",
  version: "1.0.0",
});
registerAddTool(server);
await server.connect(new StdioServerTransport());

Deno.test("add tool", async () => {
  const client = new Client(
    {
      name: "test client",
      version: "1.0",
    },
    {
      capabilities: {},
    },
  );
  const [clientTransport, serverTransport] = InMemoryTransport
    .createLinkedPair();
  await Promise.all([
    client.connect(clientTransport),
    server.connect(serverTransport),
  ]);

  const result = await client.callTool({
    name: "add",
    arguments: {
      a: 1,
      b: 2,
    },
  });
  expect(result).toEqual({
    content: [{ type: "text", text: "3" }],
  });
});
