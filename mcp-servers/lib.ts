import { McpServer, z } from "./deps.ts";

export function registerAddTool(server: McpServer) {
  server.tool(
    "add",
    { a: z.number(), b: z.number() },
    async ({ a, b }: { a: number; b: number }) => ({
      content: [{ type: "text", text: String(a + b) }],
    }),
  );
}
