// 標準ライブラリの依存関係
export * as path from "jsr:@std/path";
export { parseArgs } from "jsr:@std/cli/parse-args";

// zod は型検証に使用
export { z } from "npm:zod@3.24.2";

// MCP SDK（npm経由で使用）
export {
  McpServer,
  ResourceTemplate,
} from "npm:@modelcontextprotocol/sdk@1.7.0/server/mcp.js";
export { StdioServerTransport } from "npm:@modelcontextprotocol/sdk@1.7.0/server/stdio.js";
export { SSEServerTransport } from "npm:@modelcontextprotocol/sdk@1.7.0/server/sse.js";

// For Testing
export { InMemoryTransport } from "npm:@modelcontextprotocol/sdk@1.7.0/inMemory.js";
export { Client } from "npm:@modelcontextprotocol/sdk@1.7.0/client/index.js";
export { expect } from "jsr:@std/expect@1.0.13";
