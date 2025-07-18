<template>
  <div class="space-y-4">
    <!-- Products Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      <Card
        v-for="product in filteredProducts"
        :key="product.id"
        class="hover:shadow-lg transition-shadow cursor-pointer"
        @click="selectProduct(product)"
      >
        <CardHeader class="pb-2">
          <div class="flex justify-between items-start">
            <CardTitle class="text-lg font-semibold line-clamp-2">
              {{ product.name }}
            </CardTitle>
            <div class="text-right ml-2">
              <div class="text-lg font-bold text-primary">₱{{ product.price.toFixed(2) }}</div>
              <div class="text-xs text-muted-foreground">
                {{ product.size }}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent class="pt-0">
          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-muted-foreground">Brand:</span>
              <span>{{ product.brand || 'N/A' }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-muted-foreground">Size:</span>
              <span>{{ product.size }}</span>
            </div>
          </div>

          <div class="flex gap-2 mt-3">
            <Button @click.stop="addToCart(product)" class="flex-1" size="sm">
              <Plus class="w-4 h-4 mr-1" />
              Add to Cart
            </Button>

            <!-- Dropdown Menu -->
            <div class="relative">
              <Button
                @click.stop="toggleDropdown(product.id)"
                variant="outline"
                size="sm"
                class="px-2"
              >
                <MoreVertical class="w-4 h-4" />
              </Button>

              <!-- Dropdown Content -->
              <div
                v-if="activeDropdown === product.id"
                class="absolute right-0 top-full mt-1 bg-background border border-input rounded-md shadow-lg z-50 min-w-[120px]"
                @click.stop
              >
                <button
                  @click="editProduct(product)"
                  class="w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground flex items-center gap-2 border-b border-border"
                >
                  <Edit class="w-4 h-4" />
                  Edit
                </button>
                <button
                  @click="deleteProduct(product)"
                  class="w-full px-3 py-2 text-left text-sm hover:bg-destructive hover:text-destructive-foreground flex items-center gap-2 text-destructive"
                >
                  <Trash2 class="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Empty State -->
    <div v-if="filteredProducts.length === 0" class="text-center py-12">
      <div class="text-muted-foreground">
        <Package class="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p class="text-lg font-medium">No products found</p>
        <p class="text-sm">Try adjusting your search or filters</p>
      </div>
    </div>

    <!-- Product Modal -->
    <ProductModal
      :is-open="showProductModal"
      :product="selectedProduct"
      @close="closeProductModal"
      @success="onProductSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useInventoryStore } from '@/stores/inventory'
import { type Product } from '@/types'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import CardContent from '@/components/ui/CardContent.vue'
import Button from '@/components/ui/Button.vue'
import ProductModal from '@/components/ProductModal.vue'
import { Plus, Edit, Package, MoreVertical, Trash2 } from 'lucide-vue-next'

const store = useInventoryStore()
const showProductModal = ref(false)
const selectedProduct = ref<Product | null>(null)
const activeDropdown = ref<string | null>(null)

const filteredProducts = computed(() => store.filteredProducts)

const addToCart = (product: Product) => {
  store.addToCart(product, 1)
}

const openEditModal = (product: Product) => {
  selectedProduct.value = product
  showProductModal.value = true
}

const closeProductModal = () => {
  showProductModal.value = false
  selectedProduct.value = null
}

const onProductSuccess = () => {
  showProductModal.value = false
  selectedProduct.value = null
}

const editProduct = (product: Product) => {
  openEditModal(product)
  activeDropdown.value = null // Close dropdown
}

const deleteProduct = async (product: Product) => {
  if (
    confirm(`Are you sure you want to delete "${product.name}"?\n\nThis action cannot be undone.`)
  ) {
    try {
      await store.deleteProduct(product.id)
    } catch (error) {
      alert('Error deleting product: ' + (error as Error).message)
    }
  }
  activeDropdown.value = null // Close dropdown
}

const toggleDropdown = (productId: string) => {
  activeDropdown.value = activeDropdown.value === productId ? null : productId
}

const selectProduct = (product: Product) => {
  // Close any open dropdown when clicking on product card
  activeDropdown.value = null
}

// Close dropdown when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    activeDropdown.value = null
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
