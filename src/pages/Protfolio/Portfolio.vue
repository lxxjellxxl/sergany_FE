<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <q-page class="q-pa-md bg-brand">
    <!-- Gold/Silver Toggle -->
    <div class="row q-mb-lg bg-white q-pa-xs rounded-borders">
      <div class="col-6 q-pr-xs">
        <q-btn :class="selectedMetal === 'gold' ? 'bg-gold text-white btn-selected' : 'text-amber-5 btn-unselected'"
          class="full-width q-py-sm text-weight-medium text-body1" no-caps rounded flat label="Gold"
          @click="selectMetal('gold')" />
      </div>
      <div class="col-6 q-pl-xs">
        <q-btn :class="selectedMetal === 'silver' ? 'bg-grey-8 text-white btn-selected' : 'text-grey-7 btn-unselected'"
          class="full-width q-py-sm text-weight-medium text-body1" no-caps rounded flat label="Silver"
          @click="selectMetal('silver')" />
      </div>
    </div>

    <!-- Dynamic Component with Transition -->
    <div class="transition-wrapper">
      <transition :name="transitionName" mode="out-in">
        <div :key="selectedMetal">
          <GoldPortfolio v-if="selectedMetal === 'gold'" :balance-visible="balanceVisible"
            @toggle-balance="toggleBalance" />
          <SilverPortfolio v-if="selectedMetal === 'silver'" :balance-visible="balanceVisible"
            @toggle-balance="toggleBalance" />
        </div>
      </transition>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import GoldPortfolio from '../../components/GoldPortfolio.vue'
import SilverPortfolio from '../../components/SilverPortfolio.vue'
import { useNotificationsStore } from 'src/stores/notifications-store'
const notificationsStore = useNotificationsStore()

// Reactive data
const selectedMetal = ref('gold')
const previousMetal = ref('gold')
const balanceVisible = ref(true)

const unreadCount = ref(0)

// Computed transition name based on direction
const transitionName = computed(() => {
  // When switching from gold to silver, slide left
  // When switching from silver to gold, slide right
  if (previousMetal.value === 'gold' && selectedMetal.value === 'silver') {
    return 'slide-left'
  } else if (previousMetal.value === 'silver' && selectedMetal.value === 'gold') {
    return 'slide-right'
  }
  return 'slide-left'
})

function selectMetal(metal) {
  if (metal === selectedMetal.value) return
  previousMetal.value = selectedMetal.value
  selectedMetal.value = metal
}

function toggleBalance() {
  balanceVisible.value = !balanceVisible.value
}
 onMounted(async () => {
   unreadCount.value = await notificationsStore.fetchUnreadCount()
 })

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

/* Dark theme toggle container background */
.body--dark .bg-white {
  background-color: #2d2d2d !important;
}

/* Transition wrapper to prevent scrollbars */
.transition-wrapper {
  overflow: hidden;
  position: relative;
}

/* Slide Transitions */
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
