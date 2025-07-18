<template>
  <div>
    <!-- Sync Status Bar -->
    <div class="mb-4 p-3 rounded-lg border" :class="statusBarClass">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 rounded-full" :class="statusIndicatorClass"></div>
          <span class="text-sm font-medium">{{ connectionStatusText }}</span>
          <span class="text-xs text-muted-foreground">{{ lastSyncText }}</span>
        </div>

        <div class="flex gap-2">
          <Button
            @click="syncFromFirebase"
            :disabled="!isOnline || isSyncing"
            size="sm"
            variant="outline"
          >
            <RefreshCw class="w-4 h-4 mr-1" :class="{ 'animate-spin': isSyncing }" />
            Sync
          </Button>

          <Button @click="showImportModal = true" size="sm" variant="outline">
            <Upload class="w-4 h-4 mr-1" />
            Import CSV
          </Button>

          <Button @click="downloadData" size="sm" variant="outline">
            <Download class="w-4 h-4 mr-1" />
            Export
          </Button>
        </div>
      </div>

      <div v-if="syncError" class="mt-2 text-sm text-destructive">
        {{ syncError }}
      </div>
    </div>

    <!-- CSV Import Modal -->
    <div
      v-if="showImportModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      @click="closeImportModal"
    >
      <Card class="w-full max-w-2xl max-h-[90vh] overflow-y-auto" @click.stop>
        <CardHeader>
          <div class="flex items-center justify-between">
            <CardTitle>Import Products from CSV</CardTitle>
            <Button @click="closeImportModal" variant="ghost" size="icon">
              <X class="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent class="space-y-4">
          <!-- CSV Template Download -->
          <div class="p-4 bg-muted rounded-lg">
            <h3 class="font-medium mb-2">CSV Format Requirements</h3>
            <p class="text-sm text-muted-foreground mb-3">
              Your CSV file should have these columns: Name, Brand, Size, Price
            </p>
            <Button @click="downloadTemplate" variant="outline" size="sm">
              <Download class="w-4 h-4 mr-1" />
              Download Template
            </Button>
          </div>

          <!-- File Upload -->
          <div class="space-y-2">
            <label class="text-sm font-medium">Select CSV File</label>
            <input
              ref="fileInput"
              type="file"
              accept=".csv"
              @change="handleFileSelect"
              class="w-full p-2 border border-input rounded-md"
            />
          </div>

          <!-- CSV Preview -->
          <div v-if="csvData.length > 0" class="space-y-2">
            <h3 class="font-medium">Preview ({{ csvData.length }} products)</h3>
            <div class="max-h-60 overflow-y-auto border rounded-md">
              <table class="w-full text-sm">
                <thead class="bg-muted">
                  <tr>
                    <th class="p-2 text-left">Name</th>
                    <th class="p-2 text-left">Brand</th>
                    <th class="p-2 text-left">Size</th>
                    <th class="p-2 text-left">Price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, index) in csvData.slice(0, 10)" :key="index" class="border-t">
                    <td class="p-2">{{ row.name }}</td>
                    <td class="p-2">{{ row.brand }}</td>
                    <td class="p-2">{{ row.size }}</td>
                    <td class="p-2">₱{{ parseFloat(row.price).toFixed(2) }}</td>
                  </tr>
                </tbody>
              </table>
              <div v-if="csvData.length > 10" class="p-2 text-center text-muted-foreground text-xs">
                ... and {{ csvData.length - 10 }} more products
              </div>
            </div>
          </div>

          <!-- Import Actions -->
          <div class="flex gap-3 pt-4">
            <Button @click="closeImportModal" variant="outline" class="flex-1"> Cancel </Button>
            <Button
              @click="importProducts"
              class="flex-1"
              :disabled="csvData.length === 0 || isImporting"
            >
              <Upload class="w-4 h-4 mr-1" />
              {{ isImporting ? 'Importing...' : `Import ${csvData.length} Products` }}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { syncService } from '@/services/sync'
import type { CSVImportRow } from '@/types'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import CardContent from '@/components/ui/CardContent.vue'
import Button from '@/components/ui/Button.vue'
import { RefreshCw, Upload, Download, X } from 'lucide-vue-next'

const showImportModal = ref(false)
const fileInput = ref<HTMLInputElement>()
const csvData = ref<CSVImportRow[]>([])
const isImporting = ref(false)

// Sync status
const syncMetadata = syncService.metadata
const isOnline = syncService.connectionStatus
const isSyncing = computed(() => syncMetadata.value.syncStatus === 'syncing')
const syncError = computed(() => syncMetadata.value.errorMessage)

const connectionStatusText = computed(() => {
  if (!isOnline.value) return 'Offline'
  if (isSyncing.value) return 'Syncing...'
  if (syncMetadata.value.syncStatus === 'error') return 'Sync Error'
  return 'Online'
})

const lastSyncText = computed(() => {
  if (!syncMetadata.value.lastSync) return 'Never synced'
  const date = new Date(syncMetadata.value.lastSync)
  return `Last sync: ${date.toLocaleString()}`
})

const statusBarClass = computed(() => {
  if (!isOnline.value) return 'bg-yellow-50 border-yellow-200'
  if (syncMetadata.value.syncStatus === 'error') return 'bg-red-50 border-red-200'
  return 'bg-green-50 border-green-200'
})

const statusIndicatorClass = computed(() => {
  if (!isOnline.value) return 'bg-yellow-500'
  if (syncMetadata.value.syncStatus === 'error') return 'bg-red-500'
  return 'bg-green-500'
})

const syncFromFirebase = async () => {
  try {
    await syncService.syncFromFirebase()
  } catch (error) {
    console.error('Sync failed:', error)
  }
}

const downloadData = async () => {
  try {
    const blob = await syncService.downloadLocalData()
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `tindahan-inventory-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Export failed:', error)
  }
}

const downloadTemplate = () => {
  const csvContent =
    'Name,Brand,Size,Price\n' +
    'Sample Product,Sample Brand,100g,25.00\n' +
    'Another Product,Another Brand,250ml,35.50'

  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'product-import-template.csv'
  link.click()
  URL.revokeObjectURL(url)
}

const handleFileSelect = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    const csv = e.target?.result as string
    parseCSV(csv)
  }
  reader.readAsText(file)
}

const parseCSV = (csv: string) => {
  const lines = csv.split('\n').filter((line) => line.trim())
  if (lines.length < 2) return

  // Skip header row
  const dataLines = lines.slice(1)

  csvData.value = dataLines
    .map((line) => {
      const [name, brand, size, price] = line
        .split(',')
        .map((cell) => cell.trim().replace(/"/g, ''))
      return { name, brand: brand || '', size, price }
    })
    .filter((row) => row.name && row.size && row.price)
}

const importProducts = async () => {
  if (csvData.value.length === 0) return

  isImporting.value = true
  try {
    await syncService.importFromCSV(csvData.value)
    closeImportModal()
    alert(`Successfully imported ${csvData.value.length} products!`)
  } catch (error) {
    alert('Import failed: ' + (error as Error).message)
  } finally {
    isImporting.value = false
  }
}

const closeImportModal = () => {
  showImportModal.value = false
  csvData.value = []
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

onMounted(() => {
  // Initial sync if online
  if (isOnline.value) {
    syncFromFirebase()
  }
})

onUnmounted(() => {
  syncService.destroy()
})
</script>
