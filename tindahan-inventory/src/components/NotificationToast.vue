<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-[9999] space-y-2">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg border transition-all duration-300"
        :class="getNotificationClass(notification.type)"
      >
        <component :is="getIcon(notification.type)" class="w-4 h-4 flex-shrink-0" />
        <span class="text-sm font-medium">{{ notification.message }}</span>
        <button
          @click="removeNotification(notification.id)"
          class="ml-2 text-muted-foreground hover:text-foreground"
        >
          <X class="w-4 h-4" />
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { CheckCircle, AlertCircle, Wifi, X } from 'lucide-vue-next'
import { useNotifications } from '@/composables/useNotifications'

export interface Notification {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
}

const { notifications, removeNotification } = useNotifications()

const getNotificationClass = (type: Notification['type']) => {
  switch (type) {
    case 'success':
      return 'bg-green-50 border-green-200 text-green-800'
    case 'error':
      return 'bg-red-50 border-red-200 text-red-800'
    case 'warning':
      return 'bg-yellow-50 border-yellow-200 text-yellow-800'
    case 'info':
    default:
      return 'bg-blue-50 border-blue-200 text-blue-800'
  }
}

const getIcon = (type: Notification['type']) => {
  switch (type) {
    case 'success':
      return CheckCircle
    case 'error':
      return AlertCircle
    case 'warning':
      return AlertCircle
    case 'info':
    default:
      return Wifi
  }
}
</script>
