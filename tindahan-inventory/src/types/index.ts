export interface Product {
  id: string
  name: string
  brand: string
  size: string
  price: number
  createdAt: string
  updatedAt: string
}

export interface CartItem {
  product: Product
  quantity: number
  subtotal: number
}

export interface Transaction {
  id: string
  items: CartItem[]
  total: number
  amountReceived: number
  change: number
  paymentMethod: 'cash' | 'gcash' | 'card'
  timestamp: string
  cashierName?: string
}

// Sync and Firebase related types
export interface SyncMetadata {
  lastSync: string
  syncStatus: 'idle' | 'syncing' | 'success' | 'error'
  errorMessage?: string
}

export interface CSVImportRow {
  name: string
  brand: string
  size: string
  price: string
}
