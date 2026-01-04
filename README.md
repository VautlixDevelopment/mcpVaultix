# Vaultix MCP Server

Model Context Protocol (MCP) server for the Vaultix Payment API. Allows Claude to interact directly with your Vaultix account.

## Installation

### Option 1: Install from GitHub

```bash
npm install -g github:VautlixDevelopment/mcpVaultix
```

### Option 2: Clone and build locally

```bash
git clone https://github.com/VautlixDevelopment/mcpVaultix.git
cd mcpVaultix
npm install
npm run build
```

## Configuration

### 1. Get your API Key

Get your API key from the [Vaultix Dashboard](https://vaultix.global/app/developer/api-keys).

### 2. Configure Claude Code

Add to your Claude Code MCP settings (`~/.claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "vaultix": {
      "command": "npx",
      "args": ["-y", "github:VautlixDevelopment/mcpVaultix"],
      "env": {
        "VAULTIX_API_KEY": "sk_live_your_key_here"
      }
    }
  }
}
```

Or if installed locally:

```json
{
  "mcpServers": {
    "vaultix": {
      "command": "node",
      "args": ["/path/to/mcpVaultix/dist/index.js"],
      "env": {
        "VAULTIX_API_KEY": "sk_live_your_key_here"
      }
    }
  }
}
```

### 3. Restart Claude Code

After saving the configuration, restart Claude Code to load the MCP server.

## Available Tools

### Charges (Cobranças)

| Tool | Description |
|------|-------------|
| `vaultix_create_charge` | Create a new charge (PIX, Card, Boleto) |
| `vaultix_get_charge` | Get a charge by ID |
| `vaultix_list_charges` | List all charges |
| `vaultix_cancel_charge` | Cancel a pending charge |

### Customers (Clientes)

| Tool | Description |
|------|-------------|
| `vaultix_create_customer` | Create a new customer |
| `vaultix_get_customer` | Get a customer by ID |
| `vaultix_list_customers` | List all customers |
| `vaultix_update_customer` | Update a customer |
| `vaultix_delete_customer` | Delete a customer |

### Refunds (Reembolsos)

| Tool | Description |
|------|-------------|
| `vaultix_create_refund` | Create a refund for a charge |
| `vaultix_get_refund` | Get a refund by ID |
| `vaultix_list_refunds` | List all refunds |

### Balance (Saldo)

| Tool | Description |
|------|-------------|
| `vaultix_get_balance` | Get current balance |
| `vaultix_list_balance_transactions` | List balance transactions |

### Products (Produtos)

| Tool | Description |
|------|-------------|
| `vaultix_create_product` | Create a product |
| `vaultix_get_product` | Get a product by ID |
| `vaultix_list_products` | List all products |
| `vaultix_update_product` | Update a product |
| `vaultix_delete_product` | Delete a product |

### Orders (Pedidos)

| Tool | Description |
|------|-------------|
| `vaultix_get_order` | Get an order by ID |
| `vaultix_list_orders` | List all orders |

### Transactions (Transações)

| Tool | Description |
|------|-------------|
| `vaultix_get_transaction` | Get a transaction by ID |
| `vaultix_list_transactions` | List all transactions |
| `vaultix_get_transactions_summary` | Get transaction summary |

### Payment Links

| Tool | Description |
|------|-------------|
| `vaultix_create_payment_link` | Create a payment link |
| `vaultix_get_payment_link` | Get a payment link by ID |
| `vaultix_list_payment_links` | List all payment links |
| `vaultix_deactivate_payment_link` | Deactivate a payment link |

### Payouts (Saques)

| Tool | Description |
|------|-------------|
| `vaultix_create_payout` | Create a payout (PIX or bank transfer) |
| `vaultix_get_payout` | Get a payout by ID |
| `vaultix_list_payouts` | List all payouts |
| `vaultix_cancel_payout` | Cancel a pending payout |

## Usage Examples

Once configured, you can ask Claude:

```
"Create a PIX charge for R$ 50,00 for customer João Silva (joao@email.com)"

"List all paid charges from this month"

"Create a payment link for R$ 100,00"

"What's my current balance?"

"Show me the transaction summary for the last 7 days"
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VAULTIX_API_KEY` | Your Vaultix secret API key (sk_live_... or sk_test_...) |

## API Documentation

For more information about the Vaultix API, visit:
- [API Documentation](https://vaultix.global/developers/docs)
- [SDK Documentation](https://github.com/VautlixDevelopment/sdkVaultix)

## Support

- Email: suporte@vaultix.global
- Issues: https://github.com/VautlixDevelopment/mcpVaultix/issues

## License

MIT
