/**
 * Vaultix MCP Tools
 *
 * All available tools for Claude to interact with Vaultix API
 */

import type { Tool } from '@modelcontextprotocol/sdk/types.js'
import type { VaultixClient } from '../client.js'

// ============================================
// TOOL DEFINITIONS
// ============================================

export const tools: Tool[] = [
  // ==================== CHARGES ====================
  {
    name: 'vaultix_create_charge',
    description: 'Create a new payment charge (PIX, Credit Card, or Boleto). Amount is in cents (e.g., 5000 = R$ 50,00)',
    inputSchema: {
      type: 'object',
      properties: {
        amount: { type: 'number', description: 'Amount in cents (minimum 100 = R$ 1,00)' },
        payment_method: { type: 'string', enum: ['pix', 'credit_card', 'boleto'], description: 'Payment method' },
        customer_name: { type: 'string', description: 'Customer name' },
        customer_email: { type: 'string', description: 'Customer email' },
        customer_document: { type: 'string', description: 'Customer CPF/CNPJ' },
        description: { type: 'string', description: 'Charge description' },
      },
      required: ['amount', 'payment_method', 'customer_name', 'customer_email'],
    },
  },
  {
    name: 'vaultix_get_charge',
    description: 'Retrieve a charge by ID',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Charge ID (ch_...)' },
      },
      required: ['id'],
    },
  },
  {
    name: 'vaultix_list_charges',
    description: 'List all charges with optional filters',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'number', description: 'Maximum results (1-100)' },
        status: { type: 'string', enum: ['pending', 'paid', 'failed', 'canceled', 'refunded'], description: 'Filter by status' },
        payment_method: { type: 'string', enum: ['pix', 'credit_card', 'boleto'], description: 'Filter by payment method' },
      },
    },
  },
  {
    name: 'vaultix_cancel_charge',
    description: 'Cancel a pending or authorized charge',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Charge ID to cancel' },
      },
      required: ['id'],
    },
  },

  // ==================== CUSTOMERS ====================
  {
    name: 'vaultix_create_customer',
    description: 'Create a new customer',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Customer name' },
        email: { type: 'string', description: 'Customer email' },
        document: { type: 'string', description: 'CPF/CNPJ' },
        phone: { type: 'string', description: 'Phone number' },
      },
      required: ['name'],
    },
  },
  {
    name: 'vaultix_get_customer',
    description: 'Retrieve a customer by ID',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Customer ID (cus_...)' },
      },
      required: ['id'],
    },
  },
  {
    name: 'vaultix_list_customers',
    description: 'List all customers',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'number', description: 'Maximum results (1-100)' },
        email: { type: 'string', description: 'Filter by email' },
      },
    },
  },
  {
    name: 'vaultix_update_customer',
    description: 'Update a customer',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Customer ID' },
        name: { type: 'string', description: 'New name' },
        email: { type: 'string', description: 'New email' },
        phone: { type: 'string', description: 'New phone' },
      },
      required: ['id'],
    },
  },
  {
    name: 'vaultix_delete_customer',
    description: 'Delete a customer',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Customer ID to delete' },
      },
      required: ['id'],
    },
  },

  // ==================== REFUNDS ====================
  {
    name: 'vaultix_create_refund',
    description: 'Create a refund for a paid charge. Amount in cents for partial refund.',
    inputSchema: {
      type: 'object',
      properties: {
        charge: { type: 'string', description: 'Charge ID to refund' },
        amount: { type: 'number', description: 'Amount in cents (optional, for partial refund)' },
        reason: { type: 'string', description: 'Reason for refund' },
      },
      required: ['charge'],
    },
  },
  {
    name: 'vaultix_get_refund',
    description: 'Retrieve a refund by ID',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Refund ID (re_...)' },
      },
      required: ['id'],
    },
  },
  {
    name: 'vaultix_list_refunds',
    description: 'List all refunds',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'number', description: 'Maximum results (1-100)' },
        charge: { type: 'string', description: 'Filter by charge ID' },
      },
    },
  },

  // ==================== BALANCE ====================
  {
    name: 'vaultix_get_balance',
    description: 'Get current account balance (available and pending)',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'vaultix_list_balance_transactions',
    description: 'List balance transactions (statement)',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'number', description: 'Maximum results (1-100)' },
        type: { type: 'string', enum: ['charge', 'refund'], description: 'Filter by type' },
      },
    },
  },

  // ==================== PRODUCTS ====================
  {
    name: 'vaultix_create_product',
    description: 'Create a new product in the catalog. Price is in cents.',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Product name' },
        price: { type: 'number', description: 'Price in cents' },
        description: { type: 'string', description: 'Product description' },
        stock_quantity: { type: 'number', description: 'Stock quantity' },
        sku: { type: 'string', description: 'SKU code' },
      },
      required: ['name', 'price'],
    },
  },
  {
    name: 'vaultix_get_product',
    description: 'Retrieve a product by ID',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Product ID (prod_...)' },
      },
      required: ['id'],
    },
  },
  {
    name: 'vaultix_list_products',
    description: 'List all products',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'number', description: 'Maximum results (1-100)' },
        status: { type: 'string', enum: ['active', 'draft', 'archived'], description: 'Filter by status' },
        search: { type: 'string', description: 'Search by name or SKU' },
      },
    },
  },
  {
    name: 'vaultix_update_product',
    description: 'Update a product',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Product ID' },
        name: { type: 'string', description: 'New name' },
        price: { type: 'number', description: 'New price in cents' },
        stock_quantity: { type: 'number', description: 'New stock quantity' },
      },
      required: ['id'],
    },
  },
  {
    name: 'vaultix_delete_product',
    description: 'Delete a product',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Product ID to delete' },
      },
      required: ['id'],
    },
  },

  // ==================== ORDERS ====================
  {
    name: 'vaultix_get_order',
    description: 'Retrieve an order by ID',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Order ID' },
        expand: { type: 'string', enum: ['items'], description: 'Expand items' },
      },
      required: ['id'],
    },
  },
  {
    name: 'vaultix_list_orders',
    description: 'List all orders',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'number', description: 'Maximum results (1-100)' },
        status: { type: 'string', enum: ['pending', 'processing', 'completed', 'canceled'], description: 'Filter by status' },
        payment_status: { type: 'string', enum: ['pending', 'paid', 'failed'], description: 'Filter by payment status' },
      },
    },
  },

  // ==================== TRANSACTIONS ====================
  {
    name: 'vaultix_get_transaction',
    description: 'Retrieve a transaction by ID',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Transaction ID' },
      },
      required: ['id'],
    },
  },
  {
    name: 'vaultix_list_transactions',
    description: 'List all transactions (unified view of charges, refunds, payouts)',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'number', description: 'Maximum results (1-100)' },
        type: { type: 'string', enum: ['charge', 'refund', 'payout'], description: 'Filter by type' },
        source: { type: 'string', enum: ['charge', 'refund', 'payout'], description: 'Filter by source' },
      },
    },
  },
  {
    name: 'vaultix_get_transactions_summary',
    description: 'Get transaction summary for a period',
    inputSchema: {
      type: 'object',
      properties: {
        period: { type: 'string', enum: ['24h', '7d', '30d', '90d'], description: 'Period for summary (default: 30d)' },
      },
    },
  },

  // ==================== PAYMENT LINKS ====================
  {
    name: 'vaultix_create_payment_link',
    description: 'Create a shareable payment link. Amount in cents.',
    inputSchema: {
      type: 'object',
      properties: {
        amount: { type: 'number', description: 'Amount in cents (minimum 100)' },
        description: { type: 'string', description: 'Link description' },
        payment_methods: { type: 'array', items: { type: 'string' }, description: 'Allowed methods: pix, credit_card' },
        success_url: { type: 'string', description: 'Redirect URL after payment' },
        max_uses: { type: 'number', description: 'Maximum number of uses' },
      },
      required: ['amount'],
    },
  },
  {
    name: 'vaultix_get_payment_link',
    description: 'Retrieve a payment link by ID',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Payment Link ID (plink_...)' },
      },
      required: ['id'],
    },
  },
  {
    name: 'vaultix_list_payment_links',
    description: 'List all payment links',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'number', description: 'Maximum results (1-100)' },
        status: { type: 'string', enum: ['active', 'inactive'], description: 'Filter by status' },
      },
    },
  },
  {
    name: 'vaultix_deactivate_payment_link',
    description: 'Deactivate a payment link',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Payment Link ID to deactivate' },
      },
      required: ['id'],
    },
  },

  // ==================== PAYOUTS ====================
  {
    name: 'vaultix_create_payout',
    description: 'Create a payout (withdrawal) via PIX or bank transfer. Amount in cents.',
    inputSchema: {
      type: 'object',
      properties: {
        amount: { type: 'number', description: 'Amount in cents (minimum 100)' },
        pix_key: { type: 'string', description: 'PIX key (for PIX payout)' },
        bank_code: { type: 'string', description: 'Bank code (for bank transfer)' },
        branch: { type: 'string', description: 'Branch number' },
        account: { type: 'string', description: 'Account number' },
        account_type: { type: 'string', enum: ['checking', 'savings'], description: 'Account type' },
        holder_name: { type: 'string', description: 'Account holder name' },
        holder_document: { type: 'string', description: 'Holder CPF/CNPJ' },
        description: { type: 'string', description: 'Payout description' },
      },
      required: ['amount'],
    },
  },
  {
    name: 'vaultix_get_payout',
    description: 'Retrieve a payout by ID',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Payout ID (po_...)' },
      },
      required: ['id'],
    },
  },
  {
    name: 'vaultix_list_payouts',
    description: 'List all payouts',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'number', description: 'Maximum results (1-100)' },
        status: { type: 'string', enum: ['pending', 'in_transit', 'completed', 'failed', 'canceled'], description: 'Filter by status' },
      },
    },
  },
  {
    name: 'vaultix_cancel_payout',
    description: 'Cancel a pending payout',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Payout ID to cancel' },
      },
      required: ['id'],
    },
  },
]

// ============================================
// TOOL HANDLERS
// ============================================

export async function handleToolCall(
  client: VaultixClient,
  name: string,
  args: Record<string, any>
): Promise<any> {
  switch (name) {
    // Charges
    case 'vaultix_create_charge':
      return client.post('/charges', {
        amount: args.amount,
        payment_method: args.payment_method,
        description: args.description,
        customer: {
          name: args.customer_name,
          email: args.customer_email,
          document: args.customer_document,
        },
      })

    case 'vaultix_get_charge':
      return client.get(`/charges/${args.id}`)

    case 'vaultix_list_charges':
      return client.get('/charges', {
        limit: args.limit,
        status: args.status,
        payment_method: args.payment_method,
      })

    case 'vaultix_cancel_charge':
      return client.post(`/charges/${args.id}/cancel`)

    // Customers
    case 'vaultix_create_customer':
      return client.post('/customers', {
        name: args.name,
        email: args.email,
        document: args.document,
        phone: args.phone,
      })

    case 'vaultix_get_customer':
      return client.get(`/customers/${args.id}`)

    case 'vaultix_list_customers':
      return client.get('/customers', {
        limit: args.limit,
        email: args.email,
      })

    case 'vaultix_update_customer':
      const { id: custId, ...custUpdates } = args
      return client.put(`/customers/${custId}`, custUpdates)

    case 'vaultix_delete_customer':
      return client.delete(`/customers/${args.id}`)

    // Refunds
    case 'vaultix_create_refund':
      return client.post('/refunds', {
        charge: args.charge,
        amount: args.amount,
        reason: args.reason,
      })

    case 'vaultix_get_refund':
      return client.get(`/refunds/${args.id}`)

    case 'vaultix_list_refunds':
      return client.get('/refunds', {
        limit: args.limit,
        charge: args.charge,
      })

    // Balance
    case 'vaultix_get_balance':
      return client.get('/balance')

    case 'vaultix_list_balance_transactions':
      return client.get('/balance/transactions', {
        limit: args.limit,
        type: args.type,
      })

    // Products
    case 'vaultix_create_product':
      return client.post('/products', {
        name: args.name,
        price: args.price,
        description: args.description,
        stock_quantity: args.stock_quantity,
        sku: args.sku,
      })

    case 'vaultix_get_product':
      return client.get(`/products/${args.id}`)

    case 'vaultix_list_products':
      return client.get('/products', {
        limit: args.limit,
        status: args.status,
        search: args.search,
      })

    case 'vaultix_update_product':
      const { id: prodId, ...prodUpdates } = args
      return client.put(`/products/${prodId}`, prodUpdates)

    case 'vaultix_delete_product':
      return client.delete(`/products/${args.id}`)

    // Orders
    case 'vaultix_get_order':
      return client.get(`/orders/${args.id}`, { expand: args.expand })

    case 'vaultix_list_orders':
      return client.get('/orders', {
        limit: args.limit,
        status: args.status,
        payment_status: args.payment_status,
      })

    // Transactions
    case 'vaultix_get_transaction':
      return client.get(`/transactions/${args.id}`)

    case 'vaultix_list_transactions':
      return client.get('/transactions', {
        limit: args.limit,
        type: args.type,
        source: args.source,
      })

    case 'vaultix_get_transactions_summary':
      return client.get('/transactions/summary', { period: args.period || '30d' })

    // Payment Links
    case 'vaultix_create_payment_link':
      return client.post('/payment-links', {
        amount: args.amount,
        description: args.description,
        payment_methods: args.payment_methods,
        success_url: args.success_url,
        max_uses: args.max_uses,
      })

    case 'vaultix_get_payment_link':
      return client.get(`/payment-links/${args.id}`)

    case 'vaultix_list_payment_links':
      return client.get('/payment-links', {
        limit: args.limit,
        status: args.status,
      })

    case 'vaultix_deactivate_payment_link':
      return client.post(`/payment-links/${args.id}/deactivate`)

    // Payouts
    case 'vaultix_create_payout':
      const destination: any = {}
      if (args.pix_key) {
        destination.pix_key = args.pix_key
      } else {
        destination.bank_code = args.bank_code
        destination.branch = args.branch
        destination.account = args.account
        destination.account_type = args.account_type
      }
      destination.holder_name = args.holder_name
      destination.holder_document = args.holder_document

      return client.post('/payouts', {
        amount: args.amount,
        destination,
        description: args.description,
      })

    case 'vaultix_get_payout':
      return client.get(`/payouts/${args.id}`)

    case 'vaultix_list_payouts':
      return client.get('/payouts', {
        limit: args.limit,
        status: args.status,
      })

    case 'vaultix_cancel_payout':
      return client.post(`/payouts/${args.id}/cancel`)

    default:
      throw new Error(`Unknown tool: ${name}`)
  }
}
