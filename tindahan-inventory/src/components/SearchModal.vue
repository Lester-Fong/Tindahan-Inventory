<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/50 flex items-start justify-center p-4 z-50"
    @click="closeModal"
  >
    <div
      class="bg-background border rounded-lg shadow-xl w-full max-w-2xl mt-16 max-h-96 overflow-hidden"
      @click.stop
    >
      <!-- Search Input -->
      <div class="p-4 border-b border-border">
        <div class="relative">
          <Search
            class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground"
          />
          <input
            ref="searchInput"
            v-model="searchQuery"
            placeholder="Search products... (Ctrl+K)"
            class="w-full pl-10 pr-4 py-3 bg-transparent border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-lg"
            @keydown="handleKeydown"
          />
          <div class="absolute right-3 top-1/2 transform -translate-y-1/2">
            <kbd
              class="px-2 py-1 text-xs font-semibold text-muted-foreground bg-muted border border-border rounded"
            >
              ESC
            </kbd>
          </div>
        </div>
      </div>

      <!-- Search Results -->
      <div class="max-h-80 overflow-y-auto">
        <!-- No Results -->
        <div v-if="searchQuery && filteredResults.length === 0" class="p-8 text-center">
          <Package class="w-12 h-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
          <p class="text-lg font-medium text-muted-foreground">No products found</p>
          <p class="text-sm text-muted-foreground">Try a different search term</p>
        </div>

        <!-- Results List -->
        <div v-else-if="filteredResults.length > 0" class="p-2">
          <div
            v-for="(product, index) in filteredResults"
            :key="product.id"
            :class="[
              'p-3 rounded-md cursor-pointer transition-colors flex items-center justify-between',
              selectedIndex === index ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50',
            ]"
            @click="selectProduct(product)"
            @mouseenter="selectedIndex = index"
          >
            <div class="flex-1 min-w-0">
              <h3 class="font-medium truncate">{{ product.name }}</h3>
              <div class="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{{ product.brand || 'N/A' }}</span>
                <span>•</span>
                <span>{{ product.size }}</span>
                <span>•</span>
                <span class="text-xs bg-secondary px-2 py-1 rounded">
                  {{ PRODUCT_CATEGORIES[product.category as keyof typeof PRODUCT_CATEGORIES] }}
                </span>
              </div>
            </div>
            <div class="text-right ml-4">
              <div class="font-semibold text-primary">₱{{ product.price.toFixed(2) }}</div>
              <div class="text-xs text-muted-foreground">
                {{ product.stock }} {{ product.unit }} left
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="p-8 text-center">
          <Search class="w-12 h-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
          <p class="text-lg font-medium text-muted-foreground">Search for products</p>
          <p class="text-sm text-muted-foreground">Start typing to find products instantly</p>
        </div>
      </div>

      <!-- Footer -->
      <div v-if="filteredResults.length > 0" class="p-3 border-t border-border bg-muted/30">
        <div class="flex items-center justify-between text-xs text-muted-foreground">
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-1">
              <kbd class="px-1.5 py-0.5 font-mono bg-background border border-border rounded"
                >↑↓</kbd
              >
              <span>navigate</span>
            </div>
            <div class="flex items-center gap-1">
              <kbd class="px-1.5 py-0.5 font-mono bg-background border border-border rounded"
                >↵</kbd
              >
              <span>select</span>
            </div>
          </div>
          <span
            >{{ filteredResults.length }} result{{ filteredResults.length === 1 ? '' : 's' }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useInventoryStore } from '@/stores/inventory'
import { PRODUCT_CATEGORIES, type Product } from '@/types'
import { Search, Package } from 'lucide-vue-next'

interface Props {
  isOpen: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'select', product: Product): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const store = useInventoryStore()
const searchInput = ref<HTMLInputElement>()
const searchQuery = ref('')
const selectedIndex = ref(0)

const filteredResults = computed(() => {
  if (!searchQuery.value.trim()) return []

  const query = searchQuery.value.toLowerCase()
  return store.products
    .filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.brand?.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        PRODUCT_CATEGORIES[product.category as keyof typeof PRODUCT_CATEGORIES]
          ?.toLowerCase()
          .includes(query)
    )
    .slice(0, 8) // Limit to 8 results for better UX
})

// Reset selected index when results change
watch(filteredResults, () => {
  selectedIndex.value = 0
})

// Focus input when modal opens
watch(
  () => props.isOpen,
  async (isOpen) => {
    if (isOpen) {
      await nextTick()
      searchInput.value?.focus()
      selectedIndex.value = 0
    } else {
      searchQuery.value = ''
      selectedIndex.value = 0
    }
  }
)

const closeModal = () => {
  emit('close')
}

const selectProduct = (product: Product) => {
  emit('select', product)
  closeModal()
}

const handleKeydown = (event: KeyboardEvent) => {
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      if (selectedIndex.value < filteredResults.value.length - 1) {
        selectedIndex.value++
      }
      break
    case 'ArrowUp':
      event.preventDefault()
      if (selectedIndex.value > 0) {
        selectedIndex.value--
      }
      break
    case 'Enter':
      event.preventDefault()
      if (filteredResults.value[selectedIndex.value]) {
        selectProduct(filteredResults.value[selectedIndex.value])
      }
      break
    case 'Escape':
      closeModal()
      break
  }
}

// Global keyboard shortcut
const handleGlobalKeydown = (event: KeyboardEvent) => {
  if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
    event.preventDefault()
    if (!props.isOpen) {
      emit('close') // This will actually open it in the parent
    }
  }
  if (event.key === 'Escape' && props.isOpen) {
    closeModal()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleGlobalKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleGlobalKeydown)
})
</script>
