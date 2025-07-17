<template>
  <div class="min-h-screen bg-background text-foreground">
    <!-- Header -->
    <header class="border-b bg-card shadow-sm sticky top-0 z-50">
      <div class="container mx-auto px-4 py-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <h1 class="text-2xl font-bold text-primary">🏪 Tindahan POS</h1>
            <nav class="hidden md:flex space-x-6">
              <button
                @click="activeTab = 'products'"
                :class="
                  activeTab === 'products'
                    ? 'text-primary font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                "
                class="transition-colors"
              >
                Cart
              </button>
              <!-- Cart tab hidden on desktop since it's integrated into products page -->
              <button
                @click="activeTab = 'transactions'"
                :class="
                  activeTab === 'transactions'
                    ? 'text-primary font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                "
                class="transition-colors"
              >
                Sales
              </button>
            </nav>
          </div>

          <div class="flex items-center space-x-3">
            <!-- Search Button -->
            <Button @click="openSearchModal" variant="ghost" size="sm" class="hidden sm:flex">
              <Search class="w-4 h-4 mr-2" />
              Search
              <kbd
                class="ml-2 px-1.5 py-0.5 text-xs font-mono bg-muted border border-border rounded"
              >
                ⌘K
              </kbd>
            </Button>

            <!-- Mobile Search Button -->
            <Button @click="openSearchModal" variant="ghost" size="icon" class="sm:hidden">
              <Search class="w-5 h-5" />
            </Button>

            <!-- Theme Toggle -->
            <Button @click="toggleTheme" variant="ghost" size="icon">
              <Sun v-if="isDark" class="w-5 h-5" />
              <Moon v-else class="w-5 h-5" />
            </Button>

            <!-- Add Product Button -->
            <Button @click="openAddProductModal" variant="default" size="sm" class="hidden sm:flex">
              <Plus class="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>

        <!-- Mobile Navigation -->
        <nav class="md:hidden flex justify-around mt-3 border-t pt-3">
          <button
            @click="activeTab = 'products'"
            :class="activeTab === 'products' ? 'text-primary' : 'text-muted-foreground'"
            class="flex flex-col items-center space-y-1"
          >
            <ShoppingCartIcon class="w-5 h-5" />
            <span class="text-xs">Cart</span>
          </button>
          <button
            @click="activeTab = 'transactions'"
            :class="activeTab === 'transactions' ? 'text-primary' : 'text-muted-foreground'"
            class="flex flex-col items-center space-y-1"
          >
            <Receipt class="w-5 h-5" />
            <span class="text-xs">Sales</span>
          </button>
        </nav>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-6">
      <div class="max-w-7xl mx-auto">
        <!-- Products Tab (New Single Page Layout) -->
        <div v-if="activeTab === 'products'">
          <!-- Search Field at the very top (Clickable) -->
          <div class="mb-6">
            <div class="flex flex-col sm:flex-row gap-4">
              <div class="flex-1">
                <div
                  @click="openSearchModal"
                  class="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer hover:bg-accent/50"
                >
                  <Search class="w-4 h-4 mr-2 text-muted-foreground self-center" />
                  <span class="text-muted-foreground self-center">Search products... (Ctrl+K)</span>
                </div>
              </div>
              <select
                v-model="selectedCategory"
                class="px-3 py-2 border border-input rounded-md bg-background text-foreground h-10"
              >
                <option value="">All Categories</option>
                <option v-for="(label, value) in PRODUCT_CATEGORIES" :key="value" :value="value">
                  {{ label }}
                </option>
              </select>
            </div>
          </div>

          <!-- Header -->
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-3xl font-bold">Shopping Cart</h2>
          </div>

          <!-- Cart Only Layout -->
          <div class="max-w-4xl mx-auto">
            <div class="bg-card border rounded-lg p-6 shadow-sm">
              <ShoppingCart />
            </div>
          </div>
        </div>

        <!-- Transactions Tab -->
        <div v-if="activeTab === 'transactions'">
          <SalesHistory />
        </div>
      </div>
    </main>

    <!-- Add Product Modal -->
    <ProductModal
      :is-open="showAddProduct"
      :product="null"
      @close="closeAddProductModal"
      @success="onAddProductSuccess"
    />

    <!-- Search Modal -->
    <SearchModal :is-open="showSearchModal" @close="closeSearchModal" @select="onProductSelect" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useInventoryStore } from '@/stores/inventory'
import { useTheme } from '@/composables/useTheme'
import { PRODUCT_CATEGORIES, type Product } from '@/types'
import ShoppingCart from '@/components/ShoppingCart.vue'
import SalesHistory from '@/components/SalesHistory.vue'
import ProductModal from '@/components/ProductModal.vue'
import SearchModal from '@/components/SearchModal.vue'
import Button from '@/components/ui/Button.vue'
import { Sun, Moon, Plus, ShoppingCart as ShoppingCartIcon, Receipt, Search } from 'lucide-vue-next'

const store = useInventoryStore()
const { isDark, toggleTheme, initTheme } = useTheme()

const activeTab = ref<'products' | 'transactions'>('products')
const showAddProduct = ref(false)
const showSearchModal = ref(false)

const cartItemCount = computed(() => store.cartItemCount)
const cartTotal = computed(() => store.cartTotal)

// Search and filter functionality
const searchQuery = computed({
  get: () => store.searchQuery,
  set: (value) => store.setSearchQuery(value),
})

const selectedCategory = computed({
  get: () => store.selectedCategory,
  set: (value) => store.setSelectedCategory(value),
})

const openAddProductModal = () => {
  showAddProduct.value = true
}

const closeAddProductModal = () => {
  showAddProduct.value = false
}

const onAddProductSuccess = () => {
  showAddProduct.value = false
}

// Search modal functions
const openSearchModal = () => {
  showSearchModal.value = true
}

const closeSearchModal = () => {
  showSearchModal.value = false
}

const onProductSelect = (product: Product) => {
  // Add the selected product to cart
  store.addToCart(product, 1)
}

// Global keyboard shortcut handling
const handleGlobalKeydown = (event: KeyboardEvent) => {
  if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
    event.preventDefault()
    openSearchModal()
  }
}

onMounted(() => {
  initTheme()
  document.addEventListener('keydown', handleGlobalKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleGlobalKeydown)
})
</script>
