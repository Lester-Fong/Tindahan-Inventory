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
        <div class="mb-4 sm:mb-6">
          <h2 class="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2">
            Settings & Data Management
          </h2>
          <p class="text-sm sm:text-base text-muted-foreground">
            Manage your data synchronization, import/export products, and configure your store
            settings.
          </p>
        </div>

        <!-- Settings Sections -->
        <div class="space-y-4 sm:space-y-6">
          <!-- Data Synchronization Section -->
          <section>
            <div class="bg-card border rounded-lg p-3 sm:p-4 md:p-6 shadow-sm">
              <h3 class="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center">
                <Database class="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Data Synchronization
              </h3>
              <SyncPanel />
            </div>
          </section>

          <!-- Store Information Section -->
          <section>
            <div class="bg-card border rounded-lg p-3 sm:p-4 md:p-6 shadow-sm">
              <h3 class="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center">
                <Store class="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Store Information
              </h3>
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label class="block text-sm font-medium mb-2">Store Name</label>
                  <input
                    type="text"
                    value="Ate Chat Sari Sari Store"
                    class="w-full p-2 sm:p-3 text-sm sm:text-base border border-input rounded-md bg-background"
                    readonly
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium mb-2">Store Type</label>
                  <input
                    type="text"
                    value="Sari Sari Store"
                    class="w-full p-2 sm:p-3 text-sm sm:text-base border border-input rounded-md bg-background"
                    readonly
                  />
                </div>
              </div>
            </div>
          </section>

          <!-- Appearance Section -->
          <section>
            <div class="bg-card border rounded-lg p-3 sm:p-4 md:p-6 shadow-sm">
              <h3 class="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center">
                <Palette class="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Appearance
              </h3>
              <div
                class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4"
              >
                <div class="flex-1">
                  <h4 class="font-medium text-sm sm:text-base">Theme</h4>
                  <p class="text-xs sm:text-sm text-muted-foreground">
                    Choose between light and dark mode
                  </p>
                </div>
                <Button @click="toggleTheme" variant="outline" class="self-start sm:self-auto">
                  <Sun v-if="isDark" class="w-4 h-4 mr-2" />
                  <Moon v-else class="w-4 h-4 mr-2" />
                  <span class="text-sm sm:text-base">{{
                    isDark ? 'Light Mode' : 'Dark Mode'
                  }}</span>
                </Button>
              </div>
            </div>
          </section>

          <!-- System Information Section -->
          <section>
            <div class="bg-card border rounded-lg p-3 sm:p-4 md:p-6 shadow-sm">
              <h3 class="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center">
                <Info class="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                System Information
              </h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                <div class="flex justify-between sm:block">
                  <span class="font-medium">Version:</span>
                  <span class="ml-2 sm:ml-0 text-muted-foreground">v1.0.0</span>
                </div>
                <div class="flex justify-between sm:block">
                  <span class="font-medium">Last Updated:</span>
                  <span class="ml-2 sm:ml-0 text-muted-foreground">{{
                    new Date().toLocaleDateString()
                  }}</span>
                </div>
                <div class="flex justify-between sm:block">
                  <span class="font-medium">Products Count:</span>
                  <span class="ml-2 sm:ml-0 text-muted-foreground">{{ productCount }}</span>
                </div>
                <div class="flex justify-between sm:block">
                  <span class="font-medium">Total Sales:</span>
                  <span class="ml-2 sm:ml-0 text-muted-foreground">{{ transactionCount }}</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useInventoryStore } from '@/stores/inventory'
import { useTheme } from '@/composables/useTheme'
import SyncPanel from '@/components/SyncPanel.vue'
import Button from '@/components/ui/Button.vue'
import {
  Sun,
  Moon,
  ShoppingCart as ShoppingCartIcon,
  Receipt,
  Settings as SettingsIcon,
  Database,
  Store,
  Palette,
  Info,
} from 'lucide-vue-next'

const store = useInventoryStore()
const { isDark, toggleTheme, initTheme } = useTheme()

const productCount = computed(() => store.products.length)
const transactionCount = computed(() => store.transactions.length)

onMounted(() => {
  initTheme()
})
</script>
