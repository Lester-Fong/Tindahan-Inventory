<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold">Shopping Cart</h2>
      <Button v-if="cart.length > 0" @click="clearCart" variant="outline" size="sm">
        Clear All
      </Button>
    </div>

    <!-- Cart Items -->
    <div v-if="cart.length > 0" class="space-y-3">
      <Card v-for="item in cart" :key="item.product.id" class="p-4">
        <!-- Product Information Section -->
        <div class="space-y-3">
          <!-- Top Row: Product Details -->
          <div class="flex justify-between items-start">
            <div class="flex-1 min-w-0 space-y-1">
              <h3 class="font-semibold truncate">{{ item.product.name }}</h3>
              <p class="text-sm text-muted-foreground">
                {{ item.product.brand }} • {{ item.product.size }}
              </p>
              <p class="text-sm text-muted-foreground">₱{{ item.product.price.toFixed(2) }} each</p>
            </div>
            <!-- Subtotal (Right side) -->
            <div class="text-right ml-4">
              <div class="text-lg font-semibold text-primary">₱{{ item.subtotal.toFixed(2) }}</div>
              <div class="text-xs text-muted-foreground">Total</div>
            </div>
          </div>

          <!-- Bottom Row: Controls -->
          <div class="flex items-center justify-between pt-2 border-t border-border">
            <!-- Quantity Controls -->
            <div class="flex items-center gap-2">
              <Button
                @click="decreaseQuantity(item.product.id)"
                variant="outline"
                size="sm"
                class="h-8 w-8 p-0 flex items-center justify-center"
              >
                <Minus class="w-4 h-4" />
              </Button>

              <span class="w-12 text-center font-medium bg-muted rounded px-2 py-1 text-sm">
                {{ item.quantity }}
              </span>

              <Button
                @click="increaseQuantity(item.product.id)"
                variant="outline"
                size="sm"
                class="h-8 w-8 p-0 flex items-center justify-center"
                :disabled="item.quantity >= item.product.stock"
              >
                <Plus class="w-4 h-4" />
              </Button>
            </div>

            <!-- Remove Button -->
            <Button
              @click="removeFromCart(item.product.id)"
              variant="ghost"
              size="sm"
              class="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 class="w-4 h-4 mr-1" />
              Remove
            </Button>
          </div>
        </div>
      </Card>
    </div>

    <!-- Empty Cart -->
    <div v-else class="text-center py-12">
      <ShoppingCart class="w-12 h-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
      <p class="text-lg font-medium text-muted-foreground">Your cart is empty</p>
      <p class="text-sm text-muted-foreground">Add some products to get started</p>
    </div>

    <!-- Cart Summary -->
    <div v-if="cart.length > 0" class="border-t pt-4">
      <div class="space-y-2">
        <div class="flex justify-between text-sm">
          <span>Items ({{ cartItemCount }})</span>
          <span>₱{{ cartTotal.toFixed(2) }}</span>
        </div>
        <div class="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>₱{{ cartTotal.toFixed(2) }}</span>
        </div>
      </div>

      <Button @click="showCheckoutModal = true" class="w-full mt-4" size="lg">
        Proceed to Checkout
      </Button>
    </div>

    <!-- Checkout Modal -->
    <CheckoutModal
      :is-open="showCheckoutModal"
      @close="showCheckoutModal = false"
      @success="onCheckoutSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useInventoryStore } from '@/stores/inventory'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import CheckoutModal from '@/components/CheckoutModal.vue'
import { Plus, Minus, Trash2, ShoppingCart } from 'lucide-vue-next'

const store = useInventoryStore()
const showCheckoutModal = ref(false)

const cart = computed(() => store.cart)
const cartTotal = computed(() => store.cartTotal)
const cartItemCount = computed(() => store.cartItemCount)

const increaseQuantity = (productId: string) => {
  const item = cart.value.find((item) => item.product.id === productId)
  if (item && item.quantity < item.product.stock) {
    store.updateCartItemQuantity(productId, item.quantity + 1)
  }
}

const decreaseQuantity = (productId: string) => {
  const item = cart.value.find((item) => item.product.id === productId)
  if (item) {
    store.updateCartItemQuantity(productId, item.quantity - 1)
  }
}

const removeFromCart = (productId: string) => {
  store.removeFromCart(productId)
}

const clearCart = () => {
  store.clearCart()
}

const onCheckoutSuccess = () => {
  showCheckoutModal.value = false
  // You can add success notifications here
}

const proceedToCheckout = () => {
  showCheckoutModal.value = true
}
</script>
