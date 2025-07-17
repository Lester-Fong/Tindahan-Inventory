<template>
  <div class="min-h-screen bg-background text-foreground">
    <!-- Header -->
    <header class="border-b bg-card shadow-sm sticky top-0 z-50">
      <div class="container mx-auto px-3 sm:px-4 py-2 sm:py-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2 sm:space-x-4 min-w-0">
            <!-- Mobile Logo (Very Compact) -->
            <h1
              class="text-lg sm:text-2xl md:text-3xl font-bold text-primary flex flex-col text-center items-center justify-center leading-tight sm:hidden"
            >
              <span class="text-lg font-bold leading-none">🏪 Ate Chat &nbsp;</span>
              <span class="text-lg font-bold leading-none">Sari Sari Store</span>
            </h1>
            <!-- Desktop Logo -->
            <h1
              class="hidden sm:flex text-2xl md:text-3xl font-bold text-primary flex-col items-start justify-center"
            >
              <b>🏪 Ate Chat</b>
              <b>Sari Sari Store</b>
            </h1>
          </div>

          <!-- Desktop Navigation -->
          <nav class="hidden md:flex space-x-6 mx-4">
            <button
              @click="activeTab = 'products'"
              :class="
                activeTab === 'products'
                  ? 'text-primary font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              "
              class="transition-colors text-lg whitespace-nowrap"
            >
              Cart
            </button>
            <button
              @click="activeTab = 'transactions'"
              :class="
                activeTab === 'transactions'
                  ? 'text-primary font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              "
              class="transition-colors text-lg whitespace-nowrap"
            >
              Sales
            </button>
          </nav>

          <!-- Actions -->
          <div class="flex items-center space-x-1 sm:space-x-2 md:space-x-3 flex-shrink-0">
            <!-- Search Button - Hidden on very small screens -->
            <Button @click="openSearchModal" variant="ghost" size="sm" class="hidden lg:flex">
              <Search class="w-4 h-4 mr-2" />
              Search
              <kbd class="ml-2 px-2 py-1 text-xs font-mono bg-muted border border-border rounded">
                ⌘K
              </kbd>
            </Button>

            <!-- Compact Search Button for tablets -->
            <Button
              @click="openSearchModal"
              variant="ghost"
              size="sm"
              class="hidden sm:flex lg:hidden"
            >
              <Search class="w-4 h-4" />
            </Button>

            <!-- Mobile Search Button -->
            <Button @click="openSearchModal" variant="ghost" size="sm" class="sm:hidden p-2">
              <Search class="w-4 h-4" />
            </Button>

            <!-- Theme Toggle -->
            <Button @click="toggleTheme" variant="ghost" size="sm" class="p-2">
              <Sun v-if="isDark" class="w-4 h-4" />
              <Moon v-else class="w-4 h-4" />
            </Button>

            <!-- Add Product Button - Hidden on small screens -->
            <Button @click="openAddProductModal" variant="default" size="sm" class="hidden md:flex">
              <Plus class="w-4 h-4 mr-2" />
              Add Product
            </Button>

            <!-- Compact Add Button for small screens -->
            <Button @click="openAddProductModal" variant="default" size="sm" class="md:hidden p-2">
              <Plus class="w-4 h-4" />
            </Button>
          </div>
        </div>

        <!-- Mobile Navigation -->
        <nav class="md:hidden flex justify-around mt-2 sm:mt-3 border-t pt-2 sm:pt-3 px-2">
          <button
            @click="activeTab = 'products'"
            :class="activeTab === 'products' ? 'text-primary' : 'text-muted-foreground'"
            class="flex flex-col items-center space-y-1 min-w-0 flex-1"
          >
            <ShoppingCartIcon class="w-4 h-4 sm:w-5 sm:h-5 font-bold" />
            <span class="text-xs sm:text-sm truncate font-bold">Cart</span>
          </button>
          <button
            @click="activeTab = 'transactions'"
            :class="activeTab === 'transactions' ? 'text-primary' : 'text-muted-foreground'"
            class="flex flex-col items-center space-y-1 min-w-0 flex-1"
          >
            <Receipt class="w-4 h-4 sm:w-5 sm:h-5 font-bold" />
            <span class="text-xs sm:text-sm truncate font-bold">Sales</span>
          </button>
        </nav>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-3 sm:px-4 py-3 sm:py-6">
      <div class="max-w-7xl mx-auto">
        <!-- Products Tab (New Single Page Layout) -->
        <div v-if="activeTab === 'products'">
          <!-- Search Field at the very top (Clickable) -->
          <div class="mb-4 sm:mb-6">
            <div class="flex flex-col gap-2 sm:gap-4">
              <div class="flex-1">
                <div
                  @click="openSearchModal"
                  class="flex h-10 sm:h-12 w-full rounded-md border border-input bg-transparent px-3 sm:px-4 py-2 sm:py-3 text-base sm:text-lg shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer hover:bg-accent/50"
                >
                  <Search
                    class="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-muted-foreground self-center"
                  />
                  <span class="text-muted-foreground self-center text-sm sm:text-lg truncate"
                    >Search products... (Ctrl+K)</span
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- Cart Only Layout -->
          <div class="max-w-4xl mx-auto">
            <div class="bg-card border rounded-lg py-4 px-2 sm:p-6 md:p-8 shadow-sm">
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
