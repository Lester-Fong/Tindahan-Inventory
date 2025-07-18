import { createRouter, createWebHashHistory } from 'vue-router'
import ProductsView from '@/views/ProductsView.vue'
import SalesView from '@/views/SalesView.vue'
import SettingsView from '@/views/SettingsView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/products'
    },
    {
      path: '/products',
      name: 'Products',
      component: ProductsView,
      meta: {
        title: 'Products & Cart'
      }
    },
    {
      path: '/sales',
      name: 'Sales',
      component: SalesView,
      meta: {
        title: 'Sales History'
      }
    },
    {
      path: '/settings',
      name: 'Settings',
      component: SettingsView,
      meta: {
        title: 'Settings & Data Management'
      }
    }
  ]
})

// Update document title based on route
router.beforeEach((to) => {
  document.title = to.meta?.title ? `${to.meta.title} - Tindahan Inventory` : 'Tindahan Inventory'
  return true
})

export default router
