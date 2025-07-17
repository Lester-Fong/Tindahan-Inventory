<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    @click="closeModal"
  >
    <Card class="w-full max-w-lg max-h-[90vh] overflow-y-auto" @click.stop>
      <CardHeader>
        <div class="flex items-center justify-between">
          <CardTitle class="text-xl">
            {{ isEditing ? 'Edit Product' : 'Add New Product' }}
          </CardTitle>
          <Button @click="closeModal" variant="ghost" size="icon">
            <X class="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Product Name -->
            <div class="md:col-span-2">
              <label class="text-sm font-medium block mb-2">Product Name *</label>
              <input
                v-model="form.name"
                placeholder="Enter product name"
                required
                class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <!-- Brand -->
            <div>
              <label class="text-sm font-medium block mb-2">Brand</label>
              <input
                v-model="form.brand"
                placeholder="Brand name"
                class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <!-- Category -->
            <div>
              <label class="text-sm font-medium block mb-2">Category *</label>
              <select
                v-model="form.category"
                class="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                required
              >
                <option value="">Select Category</option>
                <option v-for="(label, value) in PRODUCT_CATEGORIES" :key="value" :value="value">
                  {{ label }}
                </option>
              </select>
            </div>

            <!-- Size -->
            <div>
              <label class="text-sm font-medium block mb-2">Size/Weight *</label>
              <input
                v-model="form.size"
                placeholder="e.g., 150g, 1L, 500ml"
                required
                class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <!-- Unit -->
            <div>
              <label class="text-sm font-medium block mb-2">Unit *</label>
              <select
                v-model="form.unit"
                class="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                required
              >
                <option value="">Select Unit</option>
                <option value="pcs">Pieces</option>
                <option value="pack">Pack</option>
                <option value="bottle">Bottle</option>
                <option value="can">Can</option>
                <option value="kg">Kilogram</option>
                <option value="liter">Liter</option>
                <option value="sachet">Sachet</option>
                <option value="box">Box</option>
              </select>
            </div>

            <!-- Price -->
            <div>
              <label class="text-sm font-medium block mb-2">Price (₱) *</label>
              <input
                v-model.number="form.price"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                required
                class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <!-- Stock -->
            <div>
              <label class="text-sm font-medium block mb-2">Stock Quantity *</label>
              <input
                v-model.number="form.stock"
                type="number"
                min="0"
                placeholder="0"
                required
                class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <!-- Barcode -->
            <div>
              <label class="text-sm font-medium block mb-2">Barcode</label>
              <input
                v-model="form.barcode"
                placeholder="Product barcode"
                class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <!-- Description -->
            <div class="md:col-span-2">
              <label class="text-sm font-medium block mb-2">Description</label>
              <textarea
                v-model="form.description"
                class="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground resize-none"
                rows="3"
                placeholder="Product description (optional)"
              ></textarea>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-3 pt-4">
            <Button type="button" @click="closeModal" variant="outline" class="flex-1">
              Cancel
            </Button>
            <Button type="submit" class="flex-1" :disabled="!isFormValid">
              {{ isEditing ? 'Update Product' : 'Add Product' }}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useInventoryStore } from '@/stores/inventory'
import { PRODUCT_CATEGORIES, type Product } from '@/types'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import CardContent from '@/components/ui/CardContent.vue'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import { X } from 'lucide-vue-next'

interface Props {
  isOpen: boolean
  product?: Product | null
}

interface Emits {
  (e: 'close'): void
  (e: 'success'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const store = useInventoryStore()

const isEditing = computed(() => !!props.product)

const form = ref({
  name: '',
  brand: '',
  category: '',
  size: '',
  unit: '',
  price: 0,
  stock: 0,
  barcode: '',
  description: '',
})

const isFormValid = computed(() => {
  const price =
    typeof form.value.price === 'string' ? parseFloat(form.value.price) : form.value.price
  const stock = typeof form.value.stock === 'string' ? parseInt(form.value.stock) : form.value.stock

  const isValid =
    form.value.name.trim() !== '' &&
    form.value.category !== '' &&
    form.value.size.trim() !== '' &&
    form.value.unit !== '' &&
    price > 0 &&
    stock >= 0

  return isValid
})

const resetForm = () => {
  form.value = {
    name: '',
    brand: '',
    category: '',
    size: '',
    unit: '',
    price: 0,
    stock: 0,
    barcode: '',
    description: '',
  }
}

const loadProductData = (product: Product) => {
  form.value = {
    name: product.name,
    brand: product.brand || '',
    category: product.category,
    size: product.size,
    unit: product.unit,
    price: product.price,
    stock: product.stock,
    barcode: product.barcode || '',
    description: product.description || '',
  }
}

const closeModal = () => {
  emit('close')
  resetForm()
}

const handleSubmit = () => {
  if (!isFormValid.value) return

  try {
    if (isEditing.value && props.product) {
      // Update existing product
      store.updateProduct(props.product.id, {
        ...form.value,
        brand: form.value.brand || undefined,
        barcode: form.value.barcode || undefined,
        description: form.value.description || undefined,
      })
    } else {
      // Add new product
      store.addProduct({
        ...form.value,
        brand: form.value.brand || undefined,
        barcode: form.value.barcode || undefined,
        description: form.value.description || undefined,
      })
    }

    emit('success')
    closeModal()
  } catch (error) {
    alert('Error saving product: ' + (error as Error).message)
  }
}

// Watch for prop changes
watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      if (props.product) {
        loadProductData(props.product)
      } else {
        resetForm()
      }
    }
  }
)
</script>
