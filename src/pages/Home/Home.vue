<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <q-page class="q-pa-md bg-brand relative-position">
    <!-- Balance Check Overlay -->
    <div v-if="isLowBalance" class="absolute-full z-top flex flex-center bg-white-transparent">
      <q-card class="text-center q-pa-lg shadow-10" style="max-width: 300px; border-radius: 16px">
        <q-icon name="account_balance_wallet" size="64px" color="grey-5" class="q-mb-md" />
        <div class="text-h6 text-weight-bold q-mb-sm">Insufficient Balance</div>
        <p class="text-grey-7 q-mb-lg">Please fund your wallet to start trading Gold & Silver.</p>
        <q-btn
          color="amber-6"
          text-color="white"
          label="Go to Wallet"
          rounded
          unelevated
          class="full-width"
          @click="$router.push('/wallet')"
        />
      </q-card>
    </div>

    <!-- Main Content (Blur/Disable if low balance) -->
    <div :class="{ 'blur-content': isLowBalance, 'disabled-interaction': isLowBalance }">
      <!-- Gold/Silver Toggle -->
      <div class="row q-mb-lg bg-white q-pa-xs rounded-borders">
        <div class="col-6 q-pr-xs">
          <q-btn
            :class="
              selectedMetal === 'gold'
                ? 'bg-gold text-white btn-selected'
                : 'text-amber-5 btn-unselected'
            "
            class="full-width q-py-sm text-weight-medium text-body1"
            no-caps
            rounded
            flat
            label="Gold"
            @click="selectMetal('gold')"
          />
        </div>
        <div class="col-6 q-pl-xs">
          <q-btn
            :class="
              selectedMetal === 'silver'
                ? 'bg-grey-8 text-white btn-selected'
                : 'text-grey-7 btn-unselected'
            "
            class="full-width q-py-sm text-weight-medium text-body1"
            no-caps
            rounded
            flat
            label="Silver"
            @click="selectMetal('silver')"
          />
        </div>
      </div>

      <!-- Dynamic Component with Quasar Transition -->
      <div class="transition-wrapper">
        <transition :name="transitionName" mode="out-in">
          <component
            :is="selectedMetal === 'gold' ? Gold : Silver"
            :key="selectedMetal"
            @item-added="handleItemAdded"
          />
        </transition>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Gold from '../../components/GoldPage.vue'
import Silver from '../../components/SilverPage.vue'
import { useNotificationsStore } from 'src/stores/notifications-store'
import { useUsersStore } from 'src/stores/users-store'

const router = useRouter()
const notificationsStore = useNotificationsStore()
const usersStore = useUsersStore()

// Reactive data
const selectedMetal = ref('gold')
const previousMetal = ref('gold')
const cartCount = ref(0)
const unreadCount = ref(0)

// Computed: Check Balance Logic
const isLowBalance = computed(() => {
  const balance = parseFloat(usersStore.getCurrentUser?.wallet_balance || 0)
  return balance <= 0 // Adjust threshold as needed (e.g., < 100)
})

// Computed transition name based on direction
const transitionName = computed(() => {
  if (previousMetal.value === 'gold' && selectedMetal.value === 'silver') {
    return 'slide-left'
  } else if (previousMetal.value === 'silver' && selectedMetal.value === 'gold') {
    return 'slide-right'
  }
  return 'slide-left'
})

onMounted(async () => {
  await Promise.all([
    notificationsStore.fetchUnreadCount(),
    usersStore.fetchCurrentUser(), // Ensure we have latest balance
  ])
  unreadCount.value = notificationsStore.unreadCount
})

function selectMetal(m) {
  if (m === selectedMetal.value) return
  previousMetal.value = selectedMetal.value
  selectedMetal.value = m
}

function handleItemAdded() {
  cartCount.value++
}
</script>

<style scoped>
.btn-selected {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
  border: 1px solid rgba(0, 0, 0, 0.1) !important;
}

.btn-unselected {
  box-shadow: none !important;
  border: none !important;
}

/* Blur effect for low balance */
.blur-content {
  filter: blur(4px);
  pointer-events: none; /* Disable clicks */
  user-select: none;
}

.bg-white-transparent {
  background-color: rgba(255, 255, 255, 0.6);
}

/* Dark theme toggle container background */
.body--dark .bg-white {
  background-color: #2d2d2d !important;
}

/* Transition wrapper to prevent scrollbars */
.transition-wrapper {
  overflow: hidden;
  position: relative;
}

/* Quasar Slide Transitions */
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.1s ease;
}

.slide-left-enter-from {
  transform: translateX(50%);
  opacity: 0;
}

.slide-left-leave-to {
  transform: translateX(-50%);
  opacity: 0;
}

.slide-right-enter-from {
  transform: translateX(-50%);
  opacity: 0;
}

.slide-right-leave-to {
  transform: translateX(50%);
  opacity: 0;
}
</style>
