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
                Products
              </button>
              <button
                @click="activeTab = 'cart'"
                :class="
                  activeTab === 'cart'
                    ? 'text-primary font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                "
                class="transition-colors relative"
              >
                Cart
                <span
                  v-if="cartItemCount > 0"
                  class="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center"
                >
                  {{ cartItemCount }}
                </span>
              </button>
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
            <Package class="w-5 h-5" />
            <span class="text-xs">Products</span>
          </button>
          <button
            @click="activeTab = 'cart'"
            :class="activeTab === 'cart' ? 'text-primary' : 'text-muted-foreground'"
            class="flex flex-col items-center space-y-1 relative"
          >
            <ShoppingCartIcon class="w-5 h-5" />
            <span class="text-xs">Cart</span>
            <span
              v-if="cartItemCount > 0"
              class="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center"
            >
              {{ cartItemCount }}
            </span>
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
    <main
      class="container mx-auto px-4 py-6"
      :class="{ 'pb-24 md:pb-6': cartItemCount > 0 && activeTab !== 'cart' }"
    >
      <div class="max-w-7xl mx-auto">
        <!-- Products Tab -->
        <div v-if="activeTab === 'products'">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-3xl font-bold">Products</h2>
            <Button @click="openAddProductModal" class="sm:hidden">
              <Plus class="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </div>
          <ProductList />
        </div>

        <!-- Cart Tab -->
        <div v-if="activeTab === 'cart'">
          <ShoppingCart />
        </div>

        <!-- Transactions Tab -->
        <div v-if="activeTab === 'transactions'">
          <SalesHistory />
        </div>
      </div>
    </main>

    <!-- Quick Cart Summary (Mobile) -->
    <div
      v-if="cartItemCount > 0 && activeTab !== 'cart'"
      class="fixed bottom-4 right-4 md:hidden z-40"
    >
      <Button @click="activeTab = 'cart'" class="rounded-full shadow-lg" size="lg">
        <ShoppingCart class="w-5 h-5 mr-2" />
        ₱{{ cartTotal.toFixed(2) }}
      </Button>
    </div>

    <!-- Add Product Modal -->
    <ProductModal
      :is-open="showAddProduct"
      :product="null"
      @close="closeAddProductModal"
      @success="onAddProductSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useInventoryStore } from '@/stores/inventory'
import { useTheme } from '@/composables/useTheme'
import ProductList from '@/components/ProductList.vue'
import ShoppingCart from '@/components/ShoppingCart.vue'
import SalesHistory from '@/components/SalesHistory.vue'
import ProductModal from '@/components/ProductModal.vue'
import Button from '@/components/ui/Button.vue'
import {
  Sun,
  Moon,
  Plus,
  Package,
  ShoppingCart as ShoppingCartIcon,
  Receipt,
} from 'lucide-vue-next'

const store = useInventoryStore()
const { isDark, toggleTheme, initTheme } = useTheme()

const activeTab = ref<'products' | 'cart' | 'transactions'>('products')
const showAddProduct = ref(false)

const cartItemCount = computed(() => store.cartItemCount)
const cartTotal = computed(() => store.cartTotal)

const openAddProductModal = () => {
  showAddProduct.value = true
}

const closeAddProductModal = () => {
  showAddProduct.value = false
}

const onAddProductSuccess = () => {
  showAddProduct.value = false
}

onMounted(() => {
  initTheme()
})
</script>
