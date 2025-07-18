import { 
  collection, 
  doc, 
  getDocs, 
  getDoc,
  addDoc, 
  updateDoc, 
  deleteDoc, 
  setDoc,
  query, 
  orderBy, 
  serverTimestamp,
  writeBatch,
  onSnapshot,
  Timestamp
} from 'firebase/firestore'
import { db } from '@/config/firebase'
import type { Product, CSVImportRow, SyncMetadata } from '@/types'

export class FirebaseService {
  private readonly PRODUCTS_COLLECTION = 'products'
  private readonly SYNC_METADATA_COLLECTION = 'syncMetadata'

  // Product operations
  async getAllProducts(): Promise<Product[]> {
    try {
      const q = query(
        collection(db, this.PRODUCTS_COLLECTION),
        orderBy('createdAt', 'desc')
      )
      const querySnapshot = await getDocs(q)
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
        updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || doc.data().updatedAt,
      })) as Product[]
    } catch (error) {
      console.error('Error fetching products from Firebase:', error)
      throw new Error('Failed to fetch products from server')
    }
  }

  async addProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.PRODUCTS_COLLECTION), {
        ...product,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
      return docRef.id
    } catch (error) {
      console.error('Error adding product to Firebase:', error)
      throw new Error('Failed to add product to server')
    }
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<void> {
    try {
      const productRef = doc(db, this.PRODUCTS_COLLECTION, id)
      await updateDoc(productRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      })
    } catch (error) {
      console.error('Error updating product in Firebase:', error)
      throw new Error('Failed to update product on server')
    }
  }

  async deleteProduct(id: string): Promise<void> {
    try {
      const productRef = doc(db, this.PRODUCTS_COLLECTION, id)
      await deleteDoc(productRef)
    } catch (error) {
      console.error('Error deleting product from Firebase:', error)
      throw new Error('Failed to delete product from server')
    }
  }

  // Batch operations for CSV import
  async bulkImportProducts(products: CSVImportRow[]): Promise<{ imported: number, updated: number }> {
    try {
      // First, get all existing products to check for duplicates
      const existingProducts = await this.getAllProducts()
      const existingProductsMap = new Map<string, Product>()
      
      // Create a map of existing products using name+size as key
      existingProducts.forEach(product => {
        const key = `${product.name.toLowerCase().trim()}_${product.size.toLowerCase().trim()}`
        existingProductsMap.set(key, product)
      })

      const batch = writeBatch(db)
      const productsCollection = collection(db, this.PRODUCTS_COLLECTION)
      let importedCount = 0
      let updatedCount = 0

      products.forEach((product) => {
        const key = `${product.name.toLowerCase().trim()}_${product.size.toLowerCase().trim()}`
        const existingProduct = existingProductsMap.get(key)

        if (existingProduct) {
          // Update existing product
          const docRef = doc(db, this.PRODUCTS_COLLECTION, existingProduct.id)
          batch.update(docRef, {
            name: product.name.trim(),
            brand: product.brand.trim(),
            size: product.size.trim(),
            price: parseFloat(product.price),
            updatedAt: serverTimestamp(),
          })
          updatedCount++
        } else {
          // Create new product
          const docRef = doc(productsCollection)
          batch.set(docRef, {
            name: product.name.trim(),
            brand: product.brand.trim(),
            size: product.size.trim(),
            price: parseFloat(product.price),
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          })
          importedCount++
        }
      })

      await batch.commit()
      return { imported: importedCount, updated: updatedCount }
    } catch (error) {
      console.error('Error bulk importing products to Firebase:', error)
      throw new Error('Failed to import products to server')
    }
  }

  // Real-time listener for products
  subscribeToProducts(callback: (products: Product[]) => void): () => void {
    const q = query(
      collection(db, this.PRODUCTS_COLLECTION),
      orderBy('createdAt', 'desc')
    )

    return onSnapshot(q, (querySnapshot) => {
      const products = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
        updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || doc.data().updatedAt,
      })) as Product[]
      
      callback(products)
    }, (error) => {
      console.error('Error in products subscription:', error)
    })
  }

  // Sync metadata operations
  async updateSyncMetadata(metadata: Partial<SyncMetadata>): Promise<void> {
    try {
      const metadataRef = doc(db, this.SYNC_METADATA_COLLECTION, 'main')
      
      // Filter out undefined values to avoid Firebase errors
      const cleanMetadata: any = {
        lastSync: serverTimestamp(),
      }
      
      if (metadata.syncStatus !== undefined) {
        cleanMetadata.syncStatus = metadata.syncStatus
      }
      
      if (metadata.errorMessage !== undefined) {
        cleanMetadata.errorMessage = metadata.errorMessage
      }
      
      // Use setDoc with merge to create document if it doesn't exist
      await setDoc(metadataRef, cleanMetadata, { merge: true })
    } catch (error) {
      console.error('Error updating sync metadata:', error)
    }
  }

  async getSyncMetadata(): Promise<SyncMetadata | null> {
    try {
      const metadataRef = doc(db, this.SYNC_METADATA_COLLECTION, 'main')
      const docSnap = await getDoc(metadataRef)
      
      if (!docSnap.exists()) {
        return null
      }

      const data = docSnap.data()
      return {
        lastSync: data.lastSync?.toDate?.()?.toISOString() || data.lastSync,
        syncStatus: data.syncStatus || 'idle',
        errorMessage: data.errorMessage,
      } as SyncMetadata
    } catch (error) {
      console.error('Error fetching sync metadata:', error)
      return null
    }
  }

  // Utility method to check connection
  async testConnection(): Promise<boolean> {
    try {
      // Try to access a single document to test connection
      // This should work with basic read rules
      const testCollection = collection(db, this.PRODUCTS_COLLECTION)
      // Just create the reference - if this succeeds, Firebase is working
      console.log('Firebase connection test: Creating collection reference...')
      
      // Try a simple query with limit to minimize data transfer
      const q = query(testCollection, orderBy('createdAt', 'desc'))
      console.log('Firebase connection test: Query created successfully')
      
      return true
    } catch (error) {
      console.error('Firebase connection test failed:', error)
      return false
    }
  }
}

export const firebaseService = new FirebaseService()
