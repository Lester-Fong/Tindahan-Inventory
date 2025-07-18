import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Product, CartItem, Transaction } from '@/types'
import databaseData from '@/data/database.json'
import { firebaseService } from '@/services/firebase'
import { useNotifications } from '@/composables/useNotifications'

export const useInventoryStore = defineStore('inventory', () => {
  const { success, error, warning } = useNotifications()
  // State
  const products = ref<Product[]>((databaseData as any).products || [])
  const cart = ref<CartItem[]>([])
  const transactions = ref<Transaction[]>((databaseData as any).transactions || [])
  const searchQuery = ref('')

  // Getters
  const filteredProducts = computed(() => {
    let filtered = products.value

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.brand?.toLowerCase().includes(query)
      )
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
  const addProduct = async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    // Always add to local storage first (works offline)
    products.value.push(newProduct)
    saveToLocalStorage()
    
    // Try to sync to Firebase if online
    try {
      if (navigator.onLine) {
        await firebaseService.addProduct(product)
        success('✅ Product synced to Firebase')
      } else {
        warning('📱 Offline: Product saved locally only')
      }
    } catch (error) {
      warning('⚠️ Firebase sync failed, product saved locally')
      // Product is still saved locally, so this is not a critical error
    }
  }

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    const index = products.value.findIndex(p => p.id === id)
    if (index !== -1) {
      // Update locally first
      products.value[index] = {
        ...products.value[index],
        ...updates,
        updatedAt: new Date().toISOString()
      }
      saveToLocalStorage()
      
      // Try to sync to Firebase if online
      try {
        if (navigator.onLine) {
          await firebaseService.updateProduct(id, updates)
          success('✅ Product update synced to Firebase')
        } else {
          warning('📱 Offline: Product updated locally only')
        }
      } catch (error) {
        warning('⚠️ Firebase sync failed, product updated locally')
      }
    }
  }

  const deleteProduct = async (id: string) => {
    const index = products.value.findIndex(p => p.id === id)
    if (index !== -1) {
      // Delete locally first
      products.value.splice(index, 1)
      saveToLocalStorage()
      
      // Try to sync to Firebase if online
      try {
        if (navigator.onLine) {
          await firebaseService.deleteProduct(id)
          success('✅ Product deletion synced to Firebase')
        } else {
          warning('📱 Offline: Product deleted locally only')
        }
      } catch (error) {
        warning('⚠️ Firebase sync failed, product deleted locally')
      }
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
    
    clearCart()
    saveToLocalStorage()
    return transaction
  }

  const setSearchQuery = (query: string) => {
    searchQuery.value = query
  }

  const syncProducts = (firebaseProducts: Product[]) => {
    products.value = firebaseProducts
    saveToLocalStorage()
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
        products.value = data.products || (databaseData as any).products || []
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
    syncProducts,
    saveToLocalStorage,
    loadFromLocalStorage
  }
})
