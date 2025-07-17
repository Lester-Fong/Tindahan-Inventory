import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Product, CartItem, Transaction } from '@/types'
import databaseData from '@/data/database.json'

export const useInventoryStore = defineStore('inventory', () => {
  // State
  const products = ref<Product[]>(databaseData.products)
  const cart = ref<CartItem[]>([])
  const transactions = ref<Transaction[]>(databaseData.transactions)
  const searchQuery = ref('')
  const selectedCategory = ref<string>('')

  // Getters
  const filteredProducts = computed(() => {
    let filtered = products.value

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.brand?.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      )
    }

    if (selectedCategory.value && selectedCategory.value !== '') {
      filtered = filtered.filter(product => product.category === selectedCategory.value)
    }

    return filtered
  })

  const cartTotal = computed(() => {
    return cart.value.reduce((total, item) => total + item.subtotal, 0)
  })

  const cartItemCount = computed(() => {
    return cart.value.reduce((count, item) => count + item.quantity, 0)
  })

  // Actions
  const addProduct = (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    products.value.push(newProduct)
    saveToLocalStorage()
  }

  const updateProduct = (id: string, updates: Partial<Product>) => {
    const index = products.value.findIndex(p => p.id === id)
    if (index !== -1) {
      products.value[index] = {
        ...products.value[index],
        ...updates,
        updatedAt: new Date().toISOString()
      }
      saveToLocalStorage()
    }
  }

  const deleteProduct = (id: string) => {
    const index = products.value.findIndex(p => p.id === id)
    if (index !== -1) {
      products.value.splice(index, 1)
      saveToLocalStorage()
    }
  }

  const addToCart = (product: Product, quantity: number = 1) => {
    const existingItem = cart.value.find(item => item.product.id === product.id)
    
    if (existingItem) {
      existingItem.quantity += quantity
      existingItem.subtotal = existingItem.quantity * existingItem.product.price
    } else {
      cart.value.push({
        product,
        quantity,
        subtotal: quantity * product.price
      })
    }
  }

  const updateCartItemQuantity = (productId: string, quantity: number) => {
    const item = cart.value.find(item => item.product.id === productId)
    if (item) {
      if (quantity <= 0) {
        removeFromCart(productId)
      } else {
        item.quantity = quantity
        item.subtotal = quantity * item.product.price
      }
    }
  }

  const removeFromCart = (productId: string) => {
    const index = cart.value.findIndex(item => item.product.id === productId)
    if (index !== -1) {
      cart.value.splice(index, 1)
    }
  }

  const clearCart = () => {
    cart.value = []
  }

  const checkout = (amountReceived: number, paymentMethod: 'cash' | 'gcash' | 'card' = 'cash') => {
    const total = cartTotal.value
    const change = amountReceived - total

    if (change < 0) {
      throw new Error('Insufficient payment')
    }

    const transaction: Transaction = {
      id: Date.now().toString(),
      items: [...cart.value],
      total,
      amountReceived,
      change,
      paymentMethod,
      timestamp: new Date().toISOString()
    }

    transactions.value.push(transaction)
    
    // Update product stock
    cart.value.forEach(item => {
      const product = products.value.find(p => p.id === item.product.id)
      if (product) {
        product.stock -= item.quantity
      }
    })

    clearCart()
    saveToLocalStorage()
    return transaction
  }

  const setSearchQuery = (query: string) => {
    searchQuery.value = query
  }

  const setSelectedCategory = (category: string) => {
    selectedCategory.value = category
  }

  const saveToLocalStorage = () => {
    const data = {
      products: products.value,
      transactions: transactions.value
    }
    localStorage.setItem('tindahan-data', JSON.stringify(data))
  }

  const loadFromLocalStorage = () => {
    const saved = localStorage.getItem('tindahan-data')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        products.value = data.products || databaseData.products
        transactions.value = data.transactions || []
      } catch (error) {
        console.error('Error loading from localStorage:', error)
      }
    }
  }

  // Initialize from localStorage on store creation
  loadFromLocalStorage()

  return {
    // State
    products,
    cart,
    transactions,
    searchQuery,
    selectedCategory,
    
    // Getters
    filteredProducts,
    cartTotal,
    cartItemCount,
    
    // Actions
    addProduct,
    updateProduct,
    deleteProduct,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
    checkout,
    setSearchQuery,
    setSelectedCategory,
    saveToLocalStorage,
    loadFromLocalStorage
  }
})
