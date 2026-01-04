#!/usr/bin/env node
/**
 * Vaultix MCP Server
 *
 * Model Context Protocol server for Vaultix Payment API
 * Allows Claude to interact with Vaultix API directly
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js'
import { VaultixClient } from './client.js'
import { tools, handleToolCall } from './tools/index.js'

// Get API key from environment
const apiKey = process.env.VAULTIX_API_KEY || process.env.VAULTIX_SECRET_KEY

if (!apiKey) {
  console.error('Error: VAULTIX_API_KEY environment variable is required')
  console.error('Set it with: export VAULTIX_API_KEY=sk_live_...')
  process.exit(1)
}

// Initialize Vaultix client
const client = new VaultixClient(apiKey)

// Create MCP server
const server = new Server(
  {
    name: 'vaultix-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
)

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools }
})

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params

  try {
    const result = await handleToolCall(client, name, args || {})
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    }
  } catch (error: any) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            error: true,
            message: error.message || 'Unknown error',
            code: error.code || 'unknown_error',
          }, null, 2),
        },
      ],
      isError: true,
    }
  }
})

// Start server
async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
  console.error('Vaultix MCP Server started')
}

main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
