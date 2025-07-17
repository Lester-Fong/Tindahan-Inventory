<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center">
      <h2 class="text-3xl font-bold">Sales History</h2>
      <div class="text-sm text-muted-foreground">Total Sales: ₱{{ totalSales.toFixed(2) }}</div>
    </div>

    <!-- Sales Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardContent class="p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-muted-foreground">Today's Sales</p>
              <p class="text-2xl font-bold">₱{{ todaysSales.toFixed(2) }}</p>
            </div>
            <TrendingUp class="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-muted-foreground">Total Transactions</p>
              <p class="text-2xl font-bold">{{ transactions.length }}</p>
            </div>
            <Receipt class="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-muted-foreground">Average Sale</p>
              <p class="text-2xl font-bold">₱{{ averageSale.toFixed(2) }}</p>
            </div>
            <Calculator class="h-8 w-8 text-purple-600" />
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Transactions List -->
    <div v-if="transactions.length > 0" class="space-y-3">
      <Card v-for="transaction in sortedTransactions" :key="transaction.id" class="p-4">
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-semibold">Transaction #{{ transaction.id.slice(-6) }}</h3>
              <div class="text-sm text-muted-foreground">
                {{ formatDate(transaction.timestamp) }}
              </div>
            </div>

            <!-- Items Summary -->
            <div class="text-sm text-muted-foreground mb-2">
              {{ transaction.items.length }} item(s) •
              {{ transaction.items.reduce((total, item) => total + item.quantity, 0) }} pieces
            </div>

            <!-- Items Detail -->
            <div class="space-y-1 mb-3">
              <div
                v-for="item in transaction.items"
                :key="item.product.id"
                class="flex justify-between text-sm"
              >
                <span>{{ item.product.name }} x{{ item.quantity }}</span>
                <span>₱{{ item.subtotal.toFixed(2) }}</span>
              </div>
            </div>

            <!-- Payment Info -->
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-2">
                <span class="text-sm font-medium capitalize">
                  {{ transaction.paymentMethod }}
                </span>
                <span
                  :class="getPaymentMethodColor(transaction.paymentMethod)"
                  class="px-2 py-1 rounded-full text-xs font-medium"
                >
                  {{ getPaymentMethodLabel(transaction.paymentMethod) }}
                </span>
              </div>

              <div class="text-right">
                <div class="font-semibold">Total: ₱{{ transaction.total.toFixed(2) }}</div>
                <div
                  v-if="transaction.paymentMethod === 'cash'"
                  class="text-sm text-muted-foreground"
                >
                  Received: ₱{{ transaction.amountReceived.toFixed(2) }} • Change: ₱{{
                    transaction.change.toFixed(2)
                  }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <Receipt class="w-12 h-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
      <p class="text-lg font-medium text-muted-foreground">No sales yet</p>
      <p class="text-sm text-muted-foreground">Sales transactions will appear here</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useInventoryStore } from '@/stores/inventory'
import Card from '@/components/ui/Card.vue'
import CardContent from '@/components/ui/CardContent.vue'
import { Receipt, TrendingUp, Calculator } from 'lucide-vue-next'

const store = useInventoryStore()

const transactions = computed(() => store.transactions)

const sortedTransactions = computed(() => {
  return [...transactions.value].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )
})

const totalSales = computed(() => {
  return transactions.value.reduce((total, transaction) => total + transaction.total, 0)
})

const todaysSales = computed(() => {
  const today = new Date().toDateString()
  return transactions.value
    .filter((transaction) => new Date(transaction.timestamp).toDateString() === today)
    .reduce((total, transaction) => total + transaction.total, 0)
})

const averageSale = computed(() => {
  return transactions.value.length > 0 ? totalSales.value / transactions.value.length : 0
})

const formatDate = (timestamp: string) => {
  const date = new Date(timestamp)
  return date.toLocaleString('en-PH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const getPaymentMethodLabel = (method: string) => {
  const methods: Record<string, string> = {
    cash: 'Cash',
    gcash: 'GCash',
    card: 'Card',
  }
  return methods[method] || method
}

const getPaymentMethodColor = (method: string) => {
  const colors: Record<string, string> = {
    cash: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    gcash: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    card: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  }
  return colors[method] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
}
</script>
