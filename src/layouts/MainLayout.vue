<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Show header only on specific pages -->
    <div v-if="showHeader" class="row items-center justify-between q-pa-md bg-brand">
      <div class="text-h4 text-weight-bold">{{ pageTitle }}</div>
      <div class="row q-gutter-sm">
        <q-btn flat round icon="shopping_cart" color="grey-7" @click="goToCart">
          <q-badge v-if="cartCount > 0" color="red" floating>{{ cartCount }}</q-badge>
        </q-btn>
        <q-btn flat round icon="notifications" color="grey-7" @click="goToNotifications">
          <q-badge
            v-if="unreadCount > 0"
            color="red"
            floating
            rounded
            style="top: 2px; right: 2px; min-width: 18px; height: 18px; font-size: 12px"
            >{{ unreadCount }}</q-badge
          >
        </q-btn>
      </div>
    </div>

    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- Bottom Navigation - Only show on specific pages -->
    <q-footer
      v-if="showBottomNavigation"
      :class="$q.dark.isActive ? 'bg-grey-10 text-white' : 'bg-white text-dark'"
    >
      <q-tabs
        v-model="activeTab"
        dense
        :class="$q.dark.isActive ? 'text-grey-4' : 'text-grey-5'"
        class="q-pa-sm"
        active-color="amber"
        indicator-color="transparent"
        @update:model-value="handleTabChange"
      >
        <q-tab name="home" icon="home" label="Home" />
        <q-tab name="wallet" icon="account_balance_wallet" label="Wallet" />
        <q-tab name="portfolio" icon="person" label="Portfolio" />
        <q-tab name="settings" icon="settings" label="Settings" />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { useNotificationsStore } from 'src/stores/notifications-store'
import { useAuthStore } from 'src/stores/auth-store'
import { useTransactionsStore } from 'src/stores/transactions-store' // Import Transactions Store

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const $q = useQuasar()
const activeTab = ref('home')
const notificationsStore = useNotificationsStore()
const transactionsStore = useTransactionsStore() // Init Store
const unreadCount = ref(0)

// Connect cart count to the store getter
const cartCount = computed(() => transactionsStore.cartItemCount)

// Automatically update unreadCount when notificationsStore.unreadCount changes
watch(
  () => notificationsStore.unreadCount,
  (val) => {
    unreadCount.value = val
  },
  { immediate: true },
)

// Fetch data on mount
onMounted(async () => {
  if (authStore.isAuthenticated) {
    // 1. Fetch Notifications
    if (notificationsStore.unreadCount === 0) {
      unreadCount.value = await notificationsStore.fetchUnreadCount()
    }
    // 2. Fetch Cart Count from Backend
    await transactionsStore.fetchCart()
  }
})

// Map route paths to page titles
const pageTitles = {
  '/': 'Home',
  '/wallet': 'Wallet',
  '/portfolio': 'Portfolio',
  '/settings': 'Settings',
  '/notifications': 'Notifications',
  '/cart': 'Cart',
  '/refer-earn': 'Refer & Earn',
  '/account-info': 'Account Info',
  '/identity-verification': 'Identity Verification',
  '/complete-verification': 'Identity Verification',
  '/pending-verification': 'Identity Verification',
  '/rejected-verification': 'Identity Verification',
  // Add more routes and titles as needed
}

const pageTitle = computed(() => {
  return pageTitles[route.path] || 'Sergany'
})

// Pages where bottom navigation should be shown
const pagesWithNavigation = [
  '/',
  '/wallet',
  '/portfolio',
  '/settings',
  '/notifications',
  '/cart',
  '/pending-verification',
  '/set-pin-code',
  '/enter-pin-code',
  '/identity-verification',
  '/upload-documents',
  '/submit-id',
  '/uploaded-documents',
  '/refer-earn',
]

// Computed property to determine if bottom navigation should be shown
const showBottomNavigation = computed(() => {
  return pagesWithNavigation.includes(route.path)
})

// Show header only on specific pages
const showHeader = computed(() => {
  return [
    '/',
    '/settings',
    '/portfolio',
    '/wallet',
    '/pending-verification',
    '/enter-pin-code',
  ].includes(route.path)
})

// Watch for route changes and update active tab
watch(
  () => route.path,
  (newPath) => {
    if (newPath === '/') {
      activeTab.value = 'home'
    } else if (newPath === '/wallet') {
      activeTab.value = 'wallet'
    } else if (newPath === '/portfolio') {
      activeTab.value = 'portfolio'
    } else if (newPath === '/settings') {
      activeTab.value = 'settings'
    }
  },
  { immediate: true },
)

// Handle tab changes
const handleTabChange = (tabName) => {
  if (tabName === 'home') {
    router.push('/')
  } else if (tabName === 'wallet') {
    router.push('/wallet')
  } else if (tabName === 'portfolio') {
    router.push('/portfolio')
  } else if (tabName === 'settings') {
    router.push('/settings')
  }
}

function goToCart() {
  router.push('/cart')
}

function goToNotifications() {
  router.push('/notifications')
}
</script>
