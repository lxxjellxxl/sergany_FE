import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'boot/axios'

export const useNotificationsStore = defineStore('notifications', {
  state: () => ({
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null,
  }),

  getters: {
    unreadNotifications: (state) => state.notifications.filter((n) => !n.read),
    readNotifications: (state) => state.notifications.filter((n) => n.read),
    hasUnreadNotifications: (state) => state.unreadCount > 0,
    notificationsByType: (state) => {
      return state.notifications.reduce((acc, notification) => {
        const type = notification.type || 'general'
        if (!acc[type]) acc[type] = []
        acc[type].push(notification)
        return acc
      }, {})
    },
  },

  actions: {
    async fetchNotifications({ page = 1 } = {}) {
      this.loading = true
      this.error = null

      try {
        const response = await api.get(`/api/notifications/?page=${page}`)
        this.notifications = response.data
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch notifications'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchUnreadCount() {
      this.loading = true
      this.error = null

      try {
        const response = await api.get('/api/notifications/unread-count/')
        this.unreadCount = response.data.count || response.data.unread_count || 0
        return this.unreadCount
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch unread count'
        throw error
      } finally {
        this.loading = false
      }
    },

    async markAsRead(notificationIds = []) {
      this.loading = true
      this.error = null

      try {
        const payload =
          notificationIds.length > 0 ? { notification_ids: notificationIds } : { mark_all: true }

        const response = await api.post('/api/notifications/mark-read/', payload)

        // Update local state
        if (notificationIds.length > 0) {
          this.notifications = this.notifications.map((notification) => {
            if (notificationIds.includes(notification.id)) {
              return { ...notification, read: true }
            }
            return notification
          })
          this.unreadCount = Math.max(0, this.unreadCount - notificationIds.length)
        } else {
          // Mark all as read
          this.notifications = this.notifications.map((notification) => ({
            ...notification,
            read: true,
          }))
          this.unreadCount = 0
        }

        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to mark notifications as read'
        throw error
      } finally {
        this.loading = false
      }
    },

    async markNotificationAsRead(notificationId) {
      return this.markAsRead([notificationId])
    },

    async markAllAsRead() {
      return this.markAsRead()
    },

    addNotification(notification) {
      this.notifications.unshift(notification)
      if (!notification.read) {
        this.unreadCount++
      }
    },

    removeNotification(notificationId) {
      const notificationIndex = this.notifications.findIndex((n) => n.id === notificationId)
      if (notificationIndex !== -1) {
        const notification = this.notifications[notificationIndex]
        if (!notification.read) {
          this.unreadCount = Math.max(0, this.unreadCount - 1)
        }
        this.notifications.splice(notificationIndex, 1)
      }
    },

    clearNotifications() {
      this.notifications = []
      this.unreadCount = 0
      this.error = null
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useNotificationsStore, import.meta.hot))
}
