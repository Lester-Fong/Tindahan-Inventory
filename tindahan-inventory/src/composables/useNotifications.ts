import { ref } from 'vue'
import type { Notification } from '@/components/NotificationToast.vue'

const notifications = ref<Notification[]>([])

export const useNotifications = () => {
  const addNotification = (type: Notification['type'], message: string, duration = 3000) => {
    const id = Date.now().toString()
    const notification: Notification = { id, type, message }
    
    notifications.value.push(notification)
    
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, duration)
    }
  }

  const removeNotification = (id: string) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  const success = (message: string, duration?: number) => {
    addNotification('success', message, duration)
  }

  const error = (message: string, duration?: number) => {
    addNotification('error', message, duration)
  }

  const warning = (message: string, duration?: number) => {
    addNotification('warning', message, duration)
  }

  const info = (message: string, duration?: number) => {
    addNotification('info', message, duration)
  }

  return {
    notifications,
    addNotification,
    removeNotification,
    success,
    error,
    warning,
    info
  }
}
