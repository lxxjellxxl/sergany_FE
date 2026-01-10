<template>
  <q-page class="pin-page q-pa-md bg-grey-1">
    <div class="row items-center justify-between q-mb-md">
      <q-btn flat round icon="arrow_back" color="grey-7" @click="goBack" />
      <div class="text-subtitle1 text-weight-bold text-grey-9">
        {{ isChanging ? 'Change Security PIN' : 'Set Transaction PIN' }}
      </div>
      <q-btn flat round icon="close" color="grey-7" @click="goToSecurity" />
    </div>

    <q-stepper
      v-model="step"
      ref="stepper"
      color="gold"
      animated
      flat
      bordered
      class="rounded-borders shadow-2"
      header-class="hidden"
    >
      <q-step :name="1" title="Verify" :done="step > 1">
        <div class="text-center q-py-sm">
          <q-icon name="lock_person" size="48px" color="grey-5" class="q-mb-sm" />
          <div class="text-h6">Verify Current PIN</div>
          <p class="text-grey-7">Enter your current 6-digit PIN</p>
        </div>
      </q-step>

      <q-step :name="2" title="New" :done="step > 2">
        <div class="text-center q-py-sm">
          <q-icon name="password" size="48px" color="gold" class="q-mb-sm" />
          <div class="text-h6">{{ isChanging ? 'New PIN' : 'Create PIN' }}</div>
          <p class="text-grey-7">Choose a secure 6-digit code</p>
        </div>
      </q-step>

      <q-step :name="3" title="Confirm">
        <div class="text-center q-py-sm">
          <q-icon name="verified_user" size="48px" color="positive" class="q-mb-sm" />
          <div class="text-h6">Confirm PIN</div>
          <p class="text-grey-7">Re-enter the code to confirm</p>
        </div>
      </q-step>
    </q-stepper>

    <div class="dots-wrapper q-mt-xl">
      <div
        v-for="n in 6"
        :key="n"
        class="dot"
        :class="{
          'dot-active': n <= activePinArray.length,
          'dot-error': errorShake,
        }"
      >
        <div v-if="n <= activePinArray.length" class="dot-inner" />
      </div>
    </div>

    <div style="height: 24px" class="q-mt-sm text-center">
      <transition name="fade">
        <div v-if="errorShake" class="text-negative text-caption text-weight-bold">
          {{ errorMessage }}
        </div>
      </transition>
    </div>

    <div class="keypad-container q-mt-lg">
      <div class="keypad-grid">
        <div v-for="key in keys" :key="key.value || key.type" class="flex justify-center">
          <q-btn
            v-if="key.type !== 'empty'"
            flat
            class="keypad-btn"
            :ripple="{ center: true, color: 'grey-4' }"
            @click="onKeyClick(key)"
          >
            <span v-if="key.type === 'digit'" class="digit">{{ key.value }}</span>
            <q-icon v-else name="backspace" size="24px" color="grey-7" />
          </q-btn>
          <div v-else class="placeholder" />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'src/stores/auth-store'

const $q = useQuasar()
const router = useRouter()
const authStore = useAuthStore()

// State
const step = ref(1)
const errorShake = ref(false)
const errorMessage = ref('')
const oldPin = ref([])
const newPin = ref([])
const confirmPin = ref([])

// 1. Computed: Check if PIN is set based on store profile
// We check profile first, then user object as fallback
const isChanging = computed(() => {
  return authStore.profile?.is_pin_set || authStore.user?.is_pin_set || false
})

// 2. Lifecycle: Fetch Data -> Decide Step
onMounted(async () => {
  try {
    // Ensure we have the latest data from the server
    await authStore.fetchProfile()

    // Logic: If is_pin_set is FALSE, skip verification and go to Step 2
    if (!isChanging.value) {
      step.value = 2
    }
  } catch (e) {
    console.error('Error fetching profile for PIN check', e)
  }
})

// --- Key Generation ---
const keys = [
  ...Array.from({ length: 9 }, (_, i) => ({ type: 'digit', value: String(i + 1) })),
  { type: 'empty' },
  { type: 'digit', value: '0' },
  { type: 'backspace' },
]

// Determine Active Array
const activePinArray = computed(() => {
  if (step.value === 1) return oldPin.value
  if (step.value === 2) return newPin.value
  return confirmPin.value
})

// Key Click Logic
function onKeyClick(key) {
  if (errorShake.value) return

  if (key.type === 'digit' && activePinArray.value.length < 6) {
    if (navigator.vibrate) navigator.vibrate(10)
    activePinArray.value.push(key.value)
  } else if (key.type === 'backspace') {
    activePinArray.value.pop()
  }
}

// Watch for 6 digits
watch(
  activePinArray,
  (val) => {
    if (val.length === 6) handleStepCompletion()
  },
  { deep: true },
)

// Step Logic
async function handleStepCompletion() {
  // Step 1: Verify Old PIN
  if (step.value === 1) {
    $q.loading.show({ message: 'Verifying...' })
    try {
      await authStore.verifyPin(oldPin.value.join(''))
      step.value = 2
    } catch (err) {
      triggerError(err || 'Incorrect PIN')
      oldPin.value = []
    } finally {
      $q.loading.hide()
    }
  }
  // Step 2: Set New PIN
  else if (step.value === 2) {
    setTimeout(() => {
      step.value = 3
    }, 100)
  }
  // Step 3: Confirm New PIN
  else if (step.value === 3) {
    if (confirmPin.value.join('') === newPin.value.join('')) {
      await saveFinalPin()
    } else {
      triggerError('PINs do not match')
      confirmPin.value = []
    }
  }
}

async function saveFinalPin() {
  $q.loading.show({ message: 'Securing Account...' })
  try {
    const finalNewPin = newPin.value.join('')

    if (isChanging.value) {
      // Use Change Logic (Old + New)
      await authStore.changePin(oldPin.value.join(''), finalNewPin)
    } else {
      // Use Set Logic (New only)
      await authStore.setPin(finalNewPin)
    }

    $q.notify({ type: 'positive', message: 'Transaction PIN Set Successfully' })
    await authStore.fetchProfile() // Refresh profile so is_pin_set becomes true locally
    goToSecurity()
  } catch (err) {
    const msg = err.old_pin?.[0] || err.detail || 'Failed to save PIN'
    triggerError(msg)
    // If backend rejected the "old pin" at the last second, reset to start
    if (err.old_pin) {
      step.value = 1
      oldPin.value = []
      newPin.value = []
      confirmPin.value = []
    }
  } finally {
    $q.loading.hide()
  }
}

function triggerError(msg) {
  errorMessage.value = msg
  errorShake.value = true
  if (navigator.vibrate) navigator.vibrate([50, 50, 50])
  setTimeout(() => {
    errorShake.value = false
  }, 1500)
}

function goToSecurity() {
  router.push('/security')
}

function goBack() {
  // Logic: If setting new pin (isChanging=false), start step is 2.
  // If changing pin (isChanging=true), start step is 1.
  const startStep = isChanging.value ? 1 : 2

  if (step.value > startStep) {
    step.value--
    if (step.value === 2) confirmPin.value = []
    if (step.value === 1) newPin.value = []
  } else {
    goToSecurity()
  }
}
</script>

<style scoped>
.pin-page {
  max-width: 450px;
  margin: 0 auto;
  height: 100vh;
  display: flex;
  flex-direction: column;
}
:deep(.q-stepper__header) {
  display: none;
}
.rounded-borders {
  border-radius: 20px;
}

.dots-wrapper {
  display: flex;
  justify-content: center;
  gap: 16px;
}
.dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}
.dot-active {
  border-color: #fdc82a;
  transform: scale(1.1);
}
.dot-inner {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #333;
}
.dot-error {
  border-color: #f44336;
  animation: shake 0.4s;
}

.keypad-container {
  flex: 1;
  display: flex;
  align-items: center;
}
.keypad-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  width: 100%;
  max-width: 320px;
  margin: 0 auto;
}
.keypad-btn {
  width: 75px;
  height: 75px;
  border-radius: 50%;
  font-size: 28px;
  font-weight: 500;
  color: #333;
}
.keypad-btn:active {
  background-color: #f0f0f0;
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  20% {
    transform: translateX(-8px);
  }
  80% {
    transform: translateX(8px);
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
