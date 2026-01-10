<template>
  <q-page class="pin-page q-pa-md bg-brand">
    <!-- Close button top-left -->
    <div class="row items-start">
      <q-btn flat round dense icon="close" class="close-btn" @click="close" />
    </div>

    <!-- Center content -->
    <div class="pin-wrapper">
      <div class="title">Enter PIN</div>

      <!-- Dots -->
      <div class="dots q-my-md">
        <div v-for="n in pinLength" :key="n" class="dot">
          <div v-if="n <= filledCount" class="dot-filled" />
        </div>
      </div>

      <!-- Forget pin -->
      <div class="q-mb-lg">
        <q-btn flat class="forget-btn" label="Forget PIN ?" @click="showForget = true" />
      </div>

      <!-- Keypad -->
      <div class="keypad">
        <div v-for="key in keys" :key="key.value" class="key-cell">
          <q-btn :flat="false" unelevated class="key" :disable="key.disabled" @click="onKey(key)">
            <template v-if="key.type === 'digit'">{{ key.value }}</template>
            <template v-else-if="key.type === 'empty'">&nbsp;</template>
            <template v-else>
              <q-icon name="backspace" />
            </template>
          </q-btn>
        </div>
      </div>
    </div>

    <!-- Forget dialog -->
    <q-dialog v-model="showForget">
      <q-card class="q-pa-md">
        <div class="text-h6 q-mb-sm">Forgot PIN</div>
        <div class="text-body2 q-mb-md">You can reset your PIN from account settings or request support.</div>
        <div class="row justify-end">
          <q-btn flat label="Cancel" @click="showForget = false" />
          <q-btn unelevated color="primary" class="q-ml-sm" label="Contact Support" @click="contactSupport" />
        </div>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const router = useRouter()

const pin = ref([]) // array of digits as strings
const pinLength = 6
const showForget = ref(false)

const keys = [
  { type: 'digit', value: '1' },
  { type: 'digit', value: '2' },
  { type: 'digit', value: '3' },
  { type: 'digit', value: '4' },
  { type: 'digit', value: '5' },
  { type: 'digit', value: '6' },
  { type: 'digit', value: '7' },
  { type: 'digit', value: '8' },
  { type: 'digit', value: '9' },
  { type: 'empty', value: '' },
  { type: 'digit', value: '0' },
  { type: 'backspace', value: 'back' }
]

const filledCount = computed(() => pin.value.length)

function onKey(key) {
  if (key.type === 'digit') {
    if (pin.value.length < pinLength) {
      pin.value.push(key.value)
    }
  } else if (key.type === 'backspace') {
    pin.value.pop()
  }
}

watch(filledCount, (val) => {
  if (val === pinLength) {
    submitPin()
  }
})

function submitPin() {
  // const code = pin.value.join('')
  // clear after short delay to mimic processing
  setTimeout(() => { pin.value = [] }, 600)
}

function close() {
  router.back()
}

function contactSupport() {
  showForget.value = false
  $q.notify({ message: 'Support request created', color: 'info' })
}
</script>

<style scoped>
.pin-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

/* Close button */
.close-btn {
  margin-left: 0px;
  margin-top: 4px;
  margin-bottom: 8px;
  color: #616161;
}

/* Center wrapper */
.pin-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  margin-top: 24px;
}

/* Title */
.title {
  font-size: 18px;
  font-weight: 500;
  color: #333;
  margin-top: 8px;
}

/* Dots */
.dots {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}

.dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dot-filled {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #333;
}

/* Forget button */
.forget-btn {
  color: #9e9e9e;
  background: transparent;
  min-width: 120px;
  border-radius: 20px;
}

/* Keypad layout */
.keypad {
  width: 320px;
  max-width: 86vw;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  margin-top: 36px;
  padding-bottom: 40px;
  justify-items: center;
}

/* Key style */
.key {
  width: 88px;
  height: 88px;
  border-radius: 18px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
  font-size: 22px;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Empty placeholder key is invisible */
.key:disabled {
  visibility: hidden;
}

/* Date text on keypad smaller icon */
.q-icon {
  font-size: 22px;
}

/* Responsive adjustments */
@media (max-width: 420px) {
  .key {
    width: 76px;
    height: 76px;
    border-radius: 16px;
  }

  .keypad {
    gap: 14px;
  }
}
</style>
