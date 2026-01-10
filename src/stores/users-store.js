import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'boot/axios'

export const useUsersStore = defineStore('users', {
  state: () => ({
    users: [],
    currentUser: null,
    loading: false,
    error: null,
  }),

  getters: {
    usersCount: (state) => state.users.length,
    isCurrentUserLoaded: (state) => !!state.currentUser,
    getCurrentUser: (state) => state.currentUser,
    isAdmin: (state) => state.currentUser?.user_groups.includes('Admin') || false,
  },

  actions: {
    async fetchUsers() {
      this.loading = true
      this.error = null

      try {
        const response = await api.get('/auth/users/')
        this.users = response.data
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch users'
        throw error
      } finally {
        this.loading = false
      }
    },

    async createUser(userData) {
      this.loading = true
      this.error = null

      try {
        const response = await api.post('/auth/users/', userData)
        this.users.push(response.data)
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to create user'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchCurrentUser() {
      this.loading = true
      this.error = null

      try {
        const response = await api.get('/api/auth/users/me/')
        this.currentUser = response.data
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch current user'
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateCurrentUser(userData) {
      this.loading = true
      this.error = null

      try {
        const response = await api.put('/api/auth/users/me/', userData)
        this.currentUser = response.data
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to update user'
        throw error
      } finally {
        this.loading = false
      }
    },

    async partialUpdateCurrentUser(userData) {
      this.loading = true
      this.error = null

      try {
        const response = await api.patch('/api/auth/users/me/', userData)
        this.currentUser = { ...this.currentUser, ...response.data }
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to update user'
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteCurrentUser() {
      this.loading = true
      this.error = null

      try {
        await api.delete('/auth/users/me/')
        this.currentUser = null
        return true
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to delete user'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchUserById(userId) {
      this.loading = true
      this.error = null

      try {
        const response = await api.get(`/auth/users/${userId}/`)
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch user'
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateUserById(userId, userData) {
      this.loading = true
      this.error = null

      try {
        const response = await api.put(`/auth/users/${userId}/`, userData)
        const userIndex = this.users.findIndex((user) => user.id === userId)
        if (userIndex !== -1) {
          this.users[userIndex] = response.data
        }
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to update user'
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteUserById(userId) {
      this.loading = true
      this.error = null

      try {
        await api.delete(`/auth/users/${userId}/`)
        this.users = this.users.filter((user) => user.id !== userId)
        return true
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to delete user'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Account Management Actions
    async activateUser(activationData) {
      this.loading = true
      this.error = null

      try {
        const response = await api.post('/auth/users/activation/', activationData)
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Activation failed'
        throw error
      } finally {
        this.loading = false
      }
    },

    async resendActivation(email) {
      this.loading = true
      this.error = null

      try {
        const response = await api.post('/auth/users/resend_activation/', { email })
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to resend activation'
        throw error
      } finally {
        this.loading = false
      }
    },

    async resetPassword(email) {
      this.loading = true
      this.error = null

      try {
        const response = await api.post('/auth/users/reset_password/', { email })
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to reset password'
        throw error
      } finally {
        this.loading = false
      }
    },

    async resetPasswordConfirm(resetData) {
      this.loading = true
      this.error = null

      try {
        const response = await api.post('/auth/users/reset_password_confirm/', resetData)
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Password reset confirmation failed'
        throw error
      } finally {
        this.loading = false
      }
    },

    async resetUsername(email) {
      this.loading = true
      this.error = null

      try {
        const response = await api.post('/auth/users/reset_username/', { email })
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to reset username'
        throw error
      } finally {
        this.loading = false
      }
    },

    async resetUsernameConfirm(resetData) {
      this.loading = true
      this.error = null

      try {
        const response = await api.post('/auth/users/reset_username_confirm/', resetData)
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Username reset confirmation failed'
        throw error
      } finally {
        this.loading = false
      }
    },

    async setPassword(passwordData) {
      this.loading = true
      this.error = null

      try {
        const response = await api.post('/auth/users/set_password/', passwordData)
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to set password'
        throw error
      } finally {
        this.loading = false
      }
    },

    async setUsername(usernameData) {
      this.loading = true
      this.error = null

      try {
        const response = await api.post('/auth/users/set_username/', usernameData)
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to set username'
        throw error
      } finally {
        this.loading = false
      }
    },

    clearUsers() {
      this.users = []
      this.currentUser = null
      this.error = null
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUsersStore, import.meta.hot))
}
