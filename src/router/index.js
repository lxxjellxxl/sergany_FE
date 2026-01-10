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

    // 1. HEADER SYNC: Ensure token is always attached
    if (authStore.token) {
      api.defaults.headers.common['Authorization'] = `Token ${authStore.token}`
    }

    const isLoggedIn = authStore.isAuthenticated
    const isPublicPage =
      to.meta.isPublic || ['/login', '/register', '/forgot-password'].includes(to.path)

    // 2. REDIRECT LOGGED-IN USERS from Login
    if (to.path === '/login' && isLoggedIn) {
      return next('/')
    }

    // 3. BLOCK GUESTS from Protected Pages
    if (!isPublicPage && !isLoggedIn) {
      return next('/login')
    }

    // 4. LOAD USER PROFILE (Critical for Flags)
    // If we are logged in but don't have the profile flags (like is_kyc_verified), fetch them.
    // Note: usersStore.currentUser is null initially
    if (isLoggedIn && !usersStore.currentUser?.id) {
      try {
        await usersStore.fetchCurrentUser()
      } catch (error) {
        console.error('Router: Failed to fetch profile', error)
        if (error.response?.status === 401) {
          authStore.logout()
          return next('/login')
        }
      }
    }

    // Access the state directly (or use getter if preferred)
    const user = usersStore.currentUser || {}

    // --- 5. KYC VALIDATION ---
    if (to.meta.requiresKYC) {
      if (!user.is_kyc_verified) {
        const status = user.kyc_request_status

        // Route them based on their exact KYC status
        if (status === 'PENDING') {
          if (to.path !== '/pending-verification') return next('/pending-verification')
        } else if (status === 'REJECTED') {
          if (to.path !== '/rejected-verification') return next('/rejected-verification')
        } else {
          // No status or null -> Send to start
          if (
            ![
              '/identity-verification',
              '/submit-id',
              '/upload-documents',
              '/submit-your-id',
            ].includes(to.path)
          ) {
            Notify.create({
              type: 'warning',
              message: 'Access Denied: Please complete Identity Verification.',
              position: 'top',
              timeout: 3000,
            })
            return next('/identity-verification')
          }
        }
      }
    }

    // --- 6. PIN VALIDATION ---
    if (to.meta.requiresPin) {
      if (!user.is_pin_set) {
        if (to.path !== '/set-pin-code') {
          Notify.create({
            type: 'warning',
            message: 'Access Denied: Please set a Transaction PIN first.',
            position: 'top',
            timeout: 3000,
          })
          return next('/set-pin-code')
        }
      }
    }

    // --- 7. BALANCE VALIDATION ---
    if (to.meta.requiresBalance) {
      const balance = parseFloat(user.wallet_balance || 0)
      if (balance <= 0) {
        Notify.create({
          type: 'negative',
          message: 'Insufficient Balance. Please deposit funds.',
          position: 'top',
          timeout: 4000,
          actions: [{ label: 'Go to Wallet', color: 'white', handler: () => next('/wallet') }],
        })
        return next('/wallet')
      }
    }

    // --- 8. ADMIN PROTECTION ---
    if (to.meta.requiresAdmin && isLoggedIn && !authStore.isAdmin) {
      return next('/')
    }

    next()
  })

  return Router
})
