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

    <!-- Bottom Navigation - Optimized for Mobile -->
    <q-footer
      v-if="showBottomNavigation"
      bordered
      :class="$q.dark.isActive ? 'bg-grey-10 text-white' : 'bg-white text-dark'"
    >
      <q-tabs
        v-model="activeTab"
        dense
        :class="$q.dark.isActive ? 'text-grey-4' : 'text-grey-6'"
        active-color="amber-8"
        indicator-color="transparent"
        align="justify"
        @update:model-value="handleTabChange"
        style="height: 60px"
      >
        <q-tab name="home" icon="home" label="Home" no-caps class="q-py-xs" />
        <q-tab name="wallet" icon="account_balance_wallet" label="Wallet" no-caps class="q-py-xs" />
        <q-tab name="portfolio" icon="person" label="Portfolio" no-caps class="q-py-xs" />
        <q-tab name="settings" icon="settings" label="Settings" no-caps class="q-py-xs" />
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
import { useTransactionsStore } from 'src/stores/transactions-store'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const $q = useQuasar()
const activeTab = ref('home')
const notificationsStore = useNotificationsStore()
const transactionsStore = useTransactionsStore()
const unreadCount = ref(0)

const cartCount = computed(() => transactionsStore.cartItemCount)

watch(
  () => notificationsStore.unreadCount,
  (val) => {
    unreadCount.value = val
  },
  { immediate: true },
)

onMounted(async () => {
  if (authStore.isAuthenticated) {
    if (notificationsStore.unreadCount === 0) {
      unreadCount.value = await notificationsStore.fetchUnreadCount()
    }
    await transactionsStore.fetchCart()
  }
})

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
  '/rejected-verification': 'Identity Verification',
}

const pageTitle = computed(() => {
  return pageTitles[route.path] || ''
})

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

const showBottomNavigation = computed(() => {
  return pagesWithNavigation.includes(route.path)
})

const showHeader = computed(() => {
  return ['/', '/settings', '/portfolio', '/wallet', '/enter-pin-code'].includes(route.path)
})

watch(
  () => route.path,
  (newPath) => {
    if (newPath === '/') activeTab.value = 'home'
    else if (newPath === '/wallet') activeTab.value = 'wallet'
    else if (newPath === '/portfolio') activeTab.value = 'portfolio'
    else if (newPath === '/settings') activeTab.value = 'settings'
  },
  { immediate: true },
)

const handleTabChange = (tabName) => {
  if (tabName === 'home') router.push('/')
  else if (tabName === 'wallet') router.push('/wallet')
  else if (tabName === 'portfolio') router.push('/portfolio')
  else if (tabName === 'settings') router.push('/settings')
}

function goToCart() {
  router.push('/cart')
}

function goToNotifications() {
  router.push('/notifications')
}
</script>
