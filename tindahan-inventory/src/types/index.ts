export interface Product {
  id: string
  name: string
  category: string
  size: string
  price: number
  description?: string
  image?: string
  stock: number
  barcode?: string
  brand?: string
  unit: string // pcs, kg, liter, etc.
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

export type ProductCategory = 
  | 'canned-goods'
  | 'crackers'
  | 'cooking-oil'
  | 'biscuits'
  | 'beverages'
  | 'instant-noodles'
  | 'rice'
  | 'snacks'
  | 'household'
  | 'personal-care'
  | 'others'

export const PRODUCT_CATEGORIES: Record<ProductCategory, string> = {
  'canned-goods': 'Canned Goods',
  'crackers': 'Crackers',
  'cooking-oil': 'Cooking Oil',
  'biscuits': 'Biscuits',
  'beverages': 'Beverages',
  'instant-noodles': 'Instant Noodles',
  'rice': 'Rice',
  'snacks': 'Snacks',
  'household': 'Household Items',
  'personal-care': 'Personal Care',
  'others': 'Others'
}
