import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'boot/axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
    isAuthenticated: false,
    loading: false,
    error: null,
    profile: null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.token && state.isAuthenticated,
    userName: (state) => state.user?.username || state.profile?.username || '',
    userEmail: (state) => state.user?.email || state.profile?.email || '',
  },

  actions: {
    // Authentication Actions
    async login(credentials) {
      this.loading = true
      this.error = null

      try {
        const response = await api.post('/api/auth/system/login/', credentials)
        console.log('Login API response:', response.data)

        // Handle multiple possible token field names
        const responseData = response.data
        const extractedToken =
          responseData.token ||
          responseData.access_token ||
          responseData.auth_token ||
          responseData.access

        const extractedRefreshToken =
          responseData.refresh_token || responseData.refresh || responseData.refreshToken

        const extractedUser = responseData.user || responseData.data || responseData

        console.log('Extracted values:', {
          token: extractedToken,
          refresh_token: extractedRefreshToken,
          user: extractedUser,
        })

        this.token = extractedToken
        this.refreshToken = extractedRefreshToken
        this.user = extractedUser
        this.isAuthenticated = true

        localStorage.setItem('token', extractedToken)
        localStorage.setItem('refreshToken', extractedRefreshToken)

        // Set default authorization header
        api.defaults.headers.common['Authorization'] = `Bearer ${extractedToken}`

        console.log('Auth store state after login:', {
          token: this.token,
          isAuthenticated: this.isAuthenticated,
          isLoggedIn: !!this.token && this.isAuthenticated,
        })

        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Login failed'
        throw error
      } finally {
        this.loading = false
      }
    },

    clearSession() {
      // this.stopHeartbeat() // Ensure this method exists or remove if not used
      this.token = null
      this.refreshToken = null
      this.user = null
      this.profile = null
      this.isAuthenticated = false

      // Remove cookies if you are using 'js-cookie' or Quasar Cookies
      // Cookies.remove('tokenKey')

      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')

      // Remove header
      delete api.defaults.headers.common['Authorization']
    },

    async tokenLogin(credentials) {
      this.loading = true
      this.error = null

      try {
        const response = await api.post('/api/auth/token/login/', credentials)
        const { auth_token } = response.data

        this.token = auth_token
        this.isAuthenticated = true

        localStorage.setItem('token', auth_token)
        api.defaults.headers.common['Authorization'] = `Token ${auth_token}`

        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Token login failed'
        throw error
      } finally {
        this.loading = false
      }
    },

    async register(userData) {
      this.loading = true
      this.error = null

      try {
        const response = await api.post('/api/auth/system/register/', userData)
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Registration failed'
        throw error
      } finally {
        this.loading = false
      }
    },

    async logout() {
      try {
        const response = await api.post(
          '/api/auth/token/logout/',
          {},
          {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
          },
        )
        console.log('Logout successful:', response.data)
      } catch (error) {
        console.warn('Logout request failed:', error)
      } finally {
        this.clearSession()
      }
    },

    async refreshAuthToken() {
      if (!this.refreshToken) {
        throw new Error('No refresh token available')
      }

      try {
        const response = await api.post('/api/auth/system/token/refresh/', {
          refresh: this.refreshToken,
        })

        const { access } = response.data
        this.token = access

        localStorage.setItem('token', access)
        api.defaults.headers.common['Authorization'] = `Bearer ${access}`

        return access
      } catch (error) {
        this.logout()
        throw error
      }
    },

    // Profile Actions
    async fetchProfile() {
      this.loading = true
      this.error = null

      try {
        const response = await api.get('/api/auth/system/profile/')
        this.profile = response.data
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch profile'
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateProfile(profileData) {
      this.loading = true
      this.error = null

      try {
        const response = await api.put('/api/auth/system/profile/', profileData)
        this.profile = response.data
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to update profile'
        throw error
      } finally {
        this.loading = false
      }
    },

    async partialUpdateProfile(profileData) {
      this.loading = true
      this.error = null

      try {
        const response = await api.patch('/api/auth/system/profile/', profileData)
        this.profile = { ...this.profile, ...response.data }
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to update profile'
        throw error
      } finally {
        this.loading = false
      }
    },

    // KYC Actions
    async submitKyc(kycData) {
      this.loading = true
      this.error = null

      try {
        const response = await api.post('/api/auth/system/kyc/submit/', kycData)
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'KYC submission failed'
        throw error
      } finally {
        this.loading = false
      }
    },

    // PIN ACTIONS
    async verifyPin(pin) {
      try {
        const response = await api.post('/api/auth/system/verify-pin/', { pin })
        return true // Success
      } catch (error) {
        // Throw the specific error message from Django
        throw error.response?.data?.pin?.[0] || 'Incorrect PIN'
      }
    },

    async setPin(pin) {
      // pin: string or number, e.g. '123456'
      try {
        const response = await api.post('/api/auth/system/set-pin/', { pin })
        console.log('Set PIN response:', response.data)
        return response.data
      } catch (error) {
        throw error.response?.data || error
      }
    },

    async changePin(oldPin, newPin) {
      try {
        const response = await api.post('/api/auth/system/change-pin/', {
          old_pin: oldPin,
          new_pin: newPin,
        })
        console.log('Change PIN response:', response.data)
        return response.data
      } catch (error) {
        // Handle specific errors for old_pin vs new_pin if needed
        throw error.response?.data || error
      }
    },

    // Initialize auth state on app start
    initializeAuth() {
      const token = localStorage.getItem('token')
      const refreshToken = localStorage.getItem('refreshToken')

      if (token) {
        this.token = token
        this.refreshToken = refreshToken
        this.isAuthenticated = true
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      }
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}
