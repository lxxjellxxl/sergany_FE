<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <ContactUsForm v-if="showForm" @close="closeForm" @ticket-sent="handleTicketSent" />

  <q-page v-else class="q-pa-md bg-brand">
    <!-- Header -->
    <div class="row items-center q-mb-lg">
      <q-btn flat round icon="arrow_back" color="grey-7" @click="goBack" />
      <div class="text-h5 text-weight-bold q-ml-sm">Contact us</div>
    </div>

    <!-- Tab Buttons (styled like Home page) -->
    <div class="row q-mb-lg bg-white q-pa-xs rounded-borders tab-toggle-row">
      <div class="col-6 q-pr-xs">
        <q-btn :class="activeTab === 'current' ? 'bg-gold text-white btn-selected' : 'text-grey-7 btn-unselected'"
          class="full-width q-py-sm text-weight-medium text-body1" no-caps rounded flat label="Current"
          @click="selectTab('current')" />
      </div>
      <div class="col-6 q-pl-xs">
        <q-btn :class="activeTab === 'completed' ? 'bg-gold text-white btn-selected' : 'text-grey-7 btn-unselected'"
          class="full-width q-py-sm text-weight-medium text-body1" no-caps rounded flat label="Completed"
          @click="selectTab('completed')" />
      </div>
    </div>

    <!-- Tab Content with Transition (like Home page) -->
    <div class="transition-wrapper">
      <transition :name="transitionName" mode="out-in">
        <component :is="activeTab === 'current' ? ContactUsCurrent : ContactUsCompleted" :key="activeTab" />
      </transition>
    </div>

    <!-- Floating Action Button -->
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="gold" text-color="white" @click="openTicket" class="fab-btn" />
    </q-page-sticky>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import ContactUsCurrent from 'src/components/ContactUsCurrent.vue'
import ContactUsCompleted from 'src/components/ContactUsCompleted.vue'
import ContactUsForm from 'src/components/ContactUsForm.vue'

const router = useRouter()

const activeTab = ref('current')
const previousTab = ref('current')
const showForm = ref(false)

// Transition logic (same as Home page)
const transitionName = computed(() => {
  if (previousTab.value === 'current' && activeTab.value === 'completed') {
    return 'slide-left'
  } else if (previousTab.value === 'completed' && activeTab.value === 'current') {
    return 'slide-right'
  }
  return 'slide-left'
})

function selectTab(tab) {
  if (tab === activeTab.value) return
  previousTab.value = activeTab.value
  activeTab.value = tab
}

function goBack() {
  if (showForm.value) {
    showForm.value = false
  } else {
    router.go(-1)
  }
}

function openTicket() {
  showForm.value = true
}

function closeForm() {
  showForm.value = false
}

function handleTicketSent() {
  showForm.value = false
  // You can add success notification here
}
</script>

<style scoped>
/* Tab Toggle Row (like Home) */
.tab-toggle-row {
  margin-bottom: 32px;
}

/* Button styles (copied from Home) */
.btn-selected {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
  border: 1px solid rgba(0, 0, 0, 0.1) !important;
}

.btn-unselected {
  box-shadow: none !important;
  border: none !important;
}

/* Gold background utility */


/* Floating Action Button */
.fab-btn {
  background: #FDC82A !important;
  box-shadow: 0 4px 12px rgba(253, 200, 42, 0.3);
}

/* Transition wrapper to prevent scrollbars */
.transition-wrapper {
  overflow: hidden;
  position: relative;
}

/* Quasar Slide Transitions (copied from Home) */
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

/* Dark theme support */
.body--dark .bg-white {
  background-color: #2d2d2d !important;
}
</style>
