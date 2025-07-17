<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    @click="closeModal"
  >
    <Card class="w-full max-w-md max-h-[90vh] overflow-y-auto" @click.stop>
      <CardHeader>
        <div class="flex items-center justify-between">
          <CardTitle class="text-xl">Checkout</CardTitle>
          <Button @click="closeModal" variant="ghost" size="icon">
            <X class="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent class="space-y-4">
        <!-- Order Summary -->
        <div class="space-y-3">
          <h3 class="font-semibold">Order Summary</h3>
          <div v-for="item in cart" :key="item.product.id" class="flex justify-between text-sm">
            <span>{{ item.product.name }} x{{ item.quantity }}</span>
            <span>₱{{ item.subtotal.toFixed(2) }}</span>
          </div>

          <div class="border-t pt-2">
            <div class="flex justify-between font-semibold">
              <span>Total</span>
              <span>₱{{ cartTotal.toFixed(2) }}</span>
            </div>
          </div>
        </div>

        <!-- Payment Method -->
        <div class="space-y-3">
          <h3 class="font-semibold">Payment Method</h3>
          <div class="grid grid-cols-3 gap-2">
            <Button
              v-for="method in paymentMethods"
              :key="method.value"
              @click="selectedPaymentMethod = method.value as 'cash' | 'gcash' | 'card'"
              :variant="selectedPaymentMethod === method.value ? 'default' : 'outline'"
              class="h-auto py-3 flex flex-col items-center space-y-1"
            >
              <component :is="method.icon" class="w-5 h-5" />
              <span class="text-xs">{{ method.label }}</span>
            </Button>
          </div>
        </div>

        <!-- Cash Payment -->
        <div v-if="selectedPaymentMethod === 'cash'" class="space-y-3">
          <h3 class="font-semibold">Cash Payment</h3>
          <div class="space-y-2">
            <label class="text-sm font-medium">Amount Received</label>
            <Input
              v-model.number="amountReceived"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              class="text-lg"
            />
          </div>

          <div v-if="change >= 0" class="space-y-2">
            <div class="flex justify-between text-sm">
              <span>Amount Received:</span>
              <span>₱{{ amountReceived.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span>Total:</span>
              <span>₱{{ cartTotal.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between font-semibold text-lg border-t pt-2">
              <span>Change:</span>
              <span class="text-green-600">₱{{ change.toFixed(2) }}</span>
            </div>
          </div>

          <div v-if="change < 0" class="text-destructive text-sm">
            Insufficient payment. Need ₱{{ Math.abs(change).toFixed(2) }} more.
          </div>
        </div>

        <!-- Digital Payment -->
        <div v-else class="space-y-3">
          <h3 class="font-semibold">{{ getPaymentMethodLabel(selectedPaymentMethod) }} Payment</h3>
          <p class="text-sm text-muted-foreground">
            Exact amount will be charged: ₱{{ cartTotal.toFixed(2) }}
          </p>
          <div class="bg-muted p-3 rounded-lg text-center">
            <p class="text-sm">Scan QR code or process payment</p>
            <div
              class="w-24 h-24 bg-gray-300 mx-auto mt-2 rounded-lg flex items-center justify-center"
            >
              <span class="text-xs text-gray-600">QR Code</span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-2 pt-4">
          <Button @click="closeModal" variant="outline" class="flex-1"> Cancel </Button>
          <Button @click="processPayment" :disabled="!canProceed" class="flex-1">
            <CreditCard class="w-4 h-4 mr-2" />
            Complete Sale
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useInventoryStore } from '@/stores/inventory'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import CardContent from '@/components/ui/CardContent.vue'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import { X, CreditCard, Banknote, Smartphone } from 'lucide-vue-next'

interface Props {
  isOpen: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'success'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const store = useInventoryStore()

const selectedPaymentMethod = ref<'cash' | 'gcash' | 'card'>('cash')
const amountReceived = ref(0)

const cart = computed(() => store.cart)
const cartTotal = computed(() => store.cartTotal)

const change = computed(() => {
  if (selectedPaymentMethod.value === 'cash') {
    return amountReceived.value - cartTotal.value
  }
  return 0
})

const canProceed = computed(() => {
  if (selectedPaymentMethod.value === 'cash') {
    return amountReceived.value >= cartTotal.value
  }
  return true // For digital payments, assume they're always valid
})

const paymentMethods = [
  { value: 'cash', label: 'Cash', icon: Banknote },
  { value: 'gcash', label: 'GCash', icon: Smartphone },
  { value: 'card', label: 'Card', icon: CreditCard },
]

const getPaymentMethodLabel = (method: string) => {
  const paymentMethod = paymentMethods.find((m) => m.value === method)
  return paymentMethod?.label || method
}

const closeModal = () => {
  emit('close')
  resetForm()
}

const resetForm = () => {
  selectedPaymentMethod.value = 'cash'
  amountReceived.value = 0
}

const processPayment = () => {
  try {
    const paymentAmount =
      selectedPaymentMethod.value === 'cash' ? amountReceived.value : cartTotal.value

    const transaction = store.checkout(paymentAmount, selectedPaymentMethod.value)

    // Show success message (you can implement a toast/notification system)
    alert(`Sale completed! Change: ₱${transaction.change.toFixed(2)}`)

    emit('success')
    closeModal()
  } catch (error) {
    alert('Payment failed: ' + (error as Error).message)
  }
}

// Reset form when modal opens
watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      resetForm()
      // Auto-fill amount for cash payment
      amountReceived.value = Math.ceil(cartTotal.value)
    }
  }
)
</script>
