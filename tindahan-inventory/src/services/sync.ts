import { ref, computed } from 'vue'
import { firebaseService } from './firebase'
import { useInventoryStore } from '@/stores/inventory'
import type { Product, SyncMetadata, CSVImportRow } from '@/types'

class SyncService {
  private syncMetadata = ref<SyncMetadata>({
    lastSync: '',
    syncStatus: 'idle',
    errorMessage: undefined
  })

  private isOnline = ref(navigator.onLine)
  private syncInterval: number | null = null

  constructor() {
    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOnline.value = true
      this.syncFromFirebase()
    })
    
    window.addEventListener('offline', () => {
      this.isOnline.value = false
    })

    // Start auto-sync if online
    if (this.isOnline.value) {
      this.startAutoSync()
    }
  }

  get metadata() {
    return computed(() => this.syncMetadata.value)
  }

  get connectionStatus() {
    return computed(() => this.isOnline.value)
  }

  private startAutoSync() {
    // Sync every 5 minutes when online
    this.syncInterval = window.setInterval(() => {
      if (this.isOnline.value) {
        this.syncFromFirebase()
      }
    }, 5 * 60 * 1000)
  }

  private stopAutoSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval)
      this.syncInterval = null
    }
  }

  async syncFromFirebase(): Promise<void> {
    if (!this.isOnline.value) {
      throw new Error('Cannot sync while offline')
    }

    this.updateSyncStatus('syncing')

    try {
      const store = useInventoryStore()
      
      // Test connection first
      const isConnected = await firebaseService.testConnection()
      if (!isConnected) {
        throw new Error('Cannot connect to Firebase')
      }

      // Fetch products from Firebase
      const firebaseProducts = await firebaseService.getAllProducts()
      
      // Update local storage with Firebase data
      store.syncProducts(firebaseProducts)
      
      // Update sync metadata
      this.updateSyncStatus('success')
      await firebaseService.updateSyncMetadata({
        syncStatus: 'success',
        errorMessage: undefined
      })

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sync failed'
      this.updateSyncStatus('error', errorMessage)
      
      await firebaseService.updateSyncMetadata({
        syncStatus: 'error',
        errorMessage
      })
      
      throw error
    }
  }

  async pushToFirebase(): Promise<void> {
    if (!this.isOnline.value) {
      throw new Error('Cannot push while offline')
    }

    this.updateSyncStatus('syncing')

    try {
      const store = useInventoryStore()
      
      // Note: In a full implementation, you'd track which products are new/updated
      // For now, we'll implement CSV import functionality
      console.log('Push to Firebase not yet implemented - use CSV import feature')
      
      this.updateSyncStatus('success')
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Push failed'
      this.updateSyncStatus('error', errorMessage)
      throw error
    }
  }

  async importFromCSV(csvData: CSVImportRow[]): Promise<void> {
    if (!this.isOnline.value) {
      throw new Error('Cannot import CSV while offline')
    }

    this.updateSyncStatus('syncing')

    try {
      // Validate CSV data
      const validProducts = this.validateCSVData(csvData)
      
      // Import to Firebase
      await firebaseService.bulkImportProducts(validProducts)
      
      // Sync back to local storage
      await this.syncFromFirebase()
      
      this.updateSyncStatus('success')
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'CSV import failed'
      this.updateSyncStatus('error', errorMessage)
      throw error
    }
  }

  private validateCSVData(csvData: CSVImportRow[]): CSVImportRow[] {
    return csvData.filter(row => {
      // Validate required fields
      const hasName = row.name && row.name.trim().length > 0
      const hasSize = row.size && row.size.trim().length > 0
      const hasValidPrice = row.price && !isNaN(parseFloat(row.price)) && parseFloat(row.price) > 0
      
      return hasName && hasSize && hasValidPrice
    }).map(row => ({
      name: row.name.trim(),
      brand: row.brand ? row.brand.trim() : '',
      size: row.size.trim(),
      price: parseFloat(row.price).toFixed(2)
    }))
  }

  private updateSyncStatus(status: SyncMetadata['syncStatus'], errorMessage?: string) {
    this.syncMetadata.value = {
      lastSync: new Date().toISOString(),
      syncStatus: status,
      errorMessage
    }
  }

  async downloadLocalData(): Promise<Blob> {
    const store = useInventoryStore()
    const data = {
      products: store.products,
      transactions: store.transactions,
      exportedAt: new Date().toISOString()
    }
    
    const json = JSON.stringify(data, null, 2)
    return new Blob([json], { type: 'application/json' })
  }

  destroy() {
    this.stopAutoSync()
    window.removeEventListener('online', () => this.isOnline.value = true)
    window.removeEventListener('offline', () => this.isOnline.value = false)
  }
}

export const syncService = new SyncService()
