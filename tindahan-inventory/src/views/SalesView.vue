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
            <router-link
              to="/products"
              :class="
                $route.name === 'Products'
                  ? 'text-primary font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              "
              class="transition-colors text-lg whitespace-nowrap"
            >
              Products
            </router-link>
            <router-link
              to="/sales"
              :class="
                $route.name === 'Sales'
                  ? 'text-primary font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              "
              class="transition-colors text-lg whitespace-nowrap"
            >
              Sales
            </router-link>
            <router-link
              to="/settings"
              :class="
                $route.name === 'Settings'
                  ? 'text-primary font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              "
              class="transition-colors text-lg whitespace-nowrap"
            >
              Settings
            </router-link>
          </nav>

          <!-- Actions -->
          <div class="flex items-center space-x-1 sm:space-x-2 md:space-x-3 flex-shrink-0">
            <!-- Theme Toggle -->
            <Button @click="toggleTheme" variant="ghost" size="sm" class="p-2">
              <Sun v-if="isDark" class="w-4 h-4" />
              <Moon v-else class="w-4 h-4" />
            </Button>
          </div>
        </div>

        <!-- Mobile Navigation -->
        <nav class="md:hidden flex justify-around mt-2 sm:mt-3 border-t pt-2 sm:pt-3 px-2">
          <router-link
            to="/products"
            :class="$route.name === 'Products' ? 'text-primary' : 'text-muted-foreground'"
            class="flex flex-col items-center space-y-1 min-w-0 flex-1"
          >
            <ShoppingCartIcon class="w-4 h-4 sm:w-5 sm:h-5 font-bold" />
            <span class="text-xs sm:text-sm truncate font-bold">Products</span>
          </router-link>
          <router-link
            to="/sales"
            :class="$route.name === 'Sales' ? 'text-primary' : 'text-muted-foreground'"
            class="flex flex-col items-center space-y-1 min-w-0 flex-1"
          >
            <Receipt class="w-4 h-4 sm:w-5 sm:h-5 font-bold" />
            <span class="text-xs sm:text-sm truncate font-bold">Sales</span>
          </router-link>
          <router-link
            to="/settings"
            :class="$route.name === 'Settings' ? 'text-primary' : 'text-muted-foreground'"
            class="flex flex-col items-center space-y-1 min-w-0 flex-1"
          >
            <SettingsIcon class="w-4 h-4 sm:w-5 sm:h-5 font-bold" />
            <span class="text-xs sm:text-sm truncate font-bold">Settings</span>
          </router-link>
        </nav>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-3 sm:px-4 py-3 sm:py-6">
      <div class="max-w-7xl mx-auto">
        <!-- Page Header -->
        <div class="mb-6">
          <h2 class="text-2xl sm:text-3xl font-bold text-foreground mb-2">Sales History</h2>
          <p class="text-muted-foreground">
            View and manage your transaction history and sales reports.
          </p>
        </div>

        <!-- Sales Content -->
        <div class="bg-card border rounded-lg p-4 sm:p-6 shadow-sm">
          <SalesHistory />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useTheme } from '@/composables/useTheme'
import SalesHistory from '@/components/SalesHistory.vue'
import Button from '@/components/ui/Button.vue'
import {
  Sun,
  Moon,
  ShoppingCart as ShoppingCartIcon,
  Receipt,
  Settings as SettingsIcon,
} from 'lucide-vue-next'

const { isDark, toggleTheme, initTheme } = useTheme()

onMounted(() => {
  initTheme()
})
</script>
