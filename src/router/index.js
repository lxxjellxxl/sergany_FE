import { route } from 'quasar/wrappers'
import { createRouter, createMemoryHistory, createWebHistory } from 'vue-router'
import routes from './routes'
import { useAuthStore } from 'src/stores/auth-store'
import { useUsersStore } from 'src/stores/users-store' // Critical: Access User Profile Flags
import { api } from 'boot/axios'
import { Notify } from 'quasar'

export default route(function ({ store }) {
  const createHistory = process.env.SERVER ? createMemoryHistory : createWebHistory

  const Router = createRouter({
    scrollBehavior: (to, from, savedPosition) => {
      return savedPosition || { left: 0, top: 0 }
    },
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  })

  // --- GLOBAL GATEKEEPER ---
  Router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore(store)
    const usersStore = useUsersStore(store)

    if (authStore.token) {
      api.defaults.headers.common['Authorization'] = `Token ${authStore.token}`
    }

    const isLoggedIn = authStore.isAuthenticated
    const isPublicPage =
      to.meta.isPublic || ['/login', '/register', '/forgot-password'].includes(to.path)

    // 1. Basic Auth Checks (Non-async, very fast)
    if (to.path === '/login' && isLoggedIn) return next('/')
    if (!isPublicPage && !isLoggedIn) return next('/login')

    // 2. Optimized Profile Fetching
    // Only fetch if logged in AND we don't have a user, OR if we specifically want to refresh
    if (isLoggedIn && !usersStore.currentUser?.id) {
      try {
        await usersStore.fetchCurrentUser()
      } catch (error) {
        if (error.response?.status === 401) {
          authStore.logout()
          return next('/login')
        }
        // If it's a network error, don't freeze, just let them through or show error
      }
    }

    const user = usersStore.currentUser || {}
    const status = user.kyc_request_status

    // 3. Prevent Infinite Redirects (The Freeze Fix)
    // If the user is already on the target page, just let them stay there!
    if (to.path === '/pending-verification' && status === 'PENDING') return next()
    if (to.path === '/rejected-verification' && status === 'REJECTED') return next()

    // 4. KYC Gatekeeper
    if (to.meta.requiresKYC && !user.is_kyc_verified) {
      if (status === 'PENDING') return next('/pending-verification')
      if (status === 'REJECTED') return next('/rejected-verification')

      // Prevent redirecting if already going to an identity page
      const identityPages = ['/identity-verification', '/submit-id', '/upload-documents']
      if (!identityPages.includes(to.path)) {
        return next('/identity-verification')
      }
    }

    // 5. Pin Gatekeeper
    if (to.meta.requiresPin && !user.is_pin_set && to.path !== '/set-pin-code') {
      return next('/set-pin-code')
    }

    next()
  })

  return Router
})
