<template>
  <!-- 1. Wrap everything in q-page -->
  <q-page class="bg-white q-pa-md">
    <!-- Content -->
    <div class="column flex-center text-center q-px-lg">
      <div class="icon-container q-mb-lg">
        <!-- SVG Icon -->
        <svg
          width="80"
          height="80"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="12" r="12" fill="#FFC107" fill-opacity="0.2" />
          <circle cx="12" cy="12" r="8" fill="#FFC107" />
          <path
            d="M12 8V12L14 14"
            stroke="white"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>

      <h4 class="text-h5 text-weight-bold q-mb-md text-dark">Verification in Progress</h4>

      <p class="text-body1 text-grey-7 q-mb-sm">
        Your documents have been uploaded successfully and are currently being reviewed by our team.
      </p>

      <p class="text-caption text-grey-6 q-mb-xl">
        You will receive a notification once the verification process is complete.
      </p>

      <q-btn
        label="Back to Home"
        color="amber-6"
        text-color="white"
        unelevated
        rounded
        size="lg"
        class="full-width"
        @click="goToHome"
      />
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUsersStore } from 'src/stores/users-store'

const router = useRouter()
const usersStore = useUsersStore()
let pollingInterval = null

const checkStatus = async () => {
  try {
    await usersStore.fetchCurrentUser()
    // If status changed from PENDING, the router gatekeeper
    // in index.js will now allow them to pass.
    if (usersStore.currentUser?.is_kyc_verified) {
      router.replace('/')
    } else if (usersStore.currentUser?.kyc_request_status === 'REJECTED') {
      router.replace('/rejected-verification')
    }
  } catch (error) {
    console.error('Failed to refresh status:', error)
  }
}

const goToHome = async () => {
  // Force a refresh right before trying to go home
  await checkStatus()
  router.replace('/')
}

onMounted(() => {
  // Poll every 10 seconds so the user doesn't have to click anything
  pollingInterval = setInterval(checkStatus, 10000)
})

onUnmounted(() => {
  // Critical: Stop the timer when the user leaves the page
  if (pollingInterval) clearInterval(pollingInterval)
})
</script>

<style scoped>
.icon-container {
  animation: pulse 2s infinite ease-in-out;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}
</style>
