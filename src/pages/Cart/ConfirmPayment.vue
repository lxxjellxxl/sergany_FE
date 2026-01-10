<template>
  <q-page class="bg-brand">
    <!-- Header -->
    <div class="row items-center q-pa-md bg-brand">
      <q-btn flat round icon="arrow_back" @click="goBack" />
      <div class="text-h6 text-weight-bold q-ml-sm">Confirm Payment</div>
    </div>

    <div class="q-pa-md">
      <!-- Metal Price Update Info -->
      <div class="text-caption text-grey-6 q-mb-lg">
        Metal price updated at {{ formatDateTime(priceUpdateTime) }}
      </div>

      <!-- Buy Prices -->
      <div class="row q-col-gutter-md q-mb-xl">
        <div class="col-6">
          <q-card flat class="bg-white q-pa-md text-center rounded-small-borders">
            <div class="text-caption text-grey-6">Buy Gold - 24K (Fees Excluded)</div>
            <div class="text-h6 text-weight-bold q-mt-xs">{{ goldPrice }} EGP</div>
            <div class="text-caption text-grey-6">{{ goldPriceUSD }} ({{ goldPriceUSD }} EGP)</div>
          </q-card>
        </div>
        <div class="col-6">
          <q-card flat class="bg-white q-pa-md text-center rounded-small-borders">
            <div class="text-caption text-grey-6">Buy Silver - 999 (Fees Excluded)</div>
            <div class="text-h6 text-weight-bold q-mt-xs">{{ silverPrice }} EGP</div>
            <div class="text-caption text-grey-6">{{ silverPriceUSD }} ({{ silverPriceUSD }} EGP)</div>
          </q-card>
        </div>
      </div>

      <!-- Voucher Code Section -->
      <div class="q-mb-xl">
        <div class="text-subtitle2 text-weight-medium q-mb-md">Enter voucher code</div>
        <q-input v-model="voucherCode" outlined placeholder="Voucher code" class="voucher-input">
          <template v-slot:prepend>
            <q-icon name="local_offer" color="grey-5" />
          </template>
        </q-input>
      </div>

      <!-- Payment Details Section -->
      <div class="payment-details q-mb-xl">
        <div class="row items-center justify-between q-mb-md">
          <div class="text-subtitle2 text-weight-medium">Payment Details</div>
          <q-btn flat round icon="keyboard_arrow_down" size="sm" />
        </div>

        <q-card flat class="payment-card q-pa-md">
          <!-- Order Items -->
          <div v-for="item in orderItems" :key="item.id" class="row justify-between items-center q-mb-md">
            <div class="text-body2">{{ item.quantity }} {{ item.name }} :</div>
            <div class="text-body2 text-weight-medium">{{ formatPrice(item.price) }} EGP</div>
          </div>

          <q-separator class="q-my-md" />

          <!-- Fee Breakdown -->
          <div class="row justify-between items-center q-mb-sm">
            <div class="text-body2">Total MF (Tax incl.) :</div>
            <div class="text-body2 text-weight-medium">{{ formatPrice(totalMF) }} EGP</div>
          </div>

          <!-- Individual MF Fees -->
          <div v-for="fee in mfFees" :key="fee.type" class="row justify-between items-center q-mb-sm">
            <div class="text-body2 q-ml-md">{{ fee.type }} (MF) :</div>
            <div class="text-body2">{{ formatPrice(fee.amount) }} EGP</div>
          </div>

          <div class="row justify-between items-center q-mb-sm">
            <div class="text-body2">Transaction Fees :</div>
            <div class="text-body2">{{ formatPrice(transactionFees) }} EGP</div>
          </div>

          <div class="row justify-between items-center q-mb-md">
            <div class="text-body2">Storage Fees :</div>
            <div class="text-body2">{{ formatPrice(storageFees) }} EGP</div>
          </div>

          <q-separator class="q-my-md" />

          <!-- Total Amount -->
          <div class="row justify-between items-center">
            <div class="text-subtitle2 text-weight-bold">Amount Due :</div>
            <div class="text-body1 text-weight-bold text-amber-8">{{ formatPrice(totalAmount) }} EGP</div>
          </div>
        </q-card>
      </div>

      <!-- Slide to Confirm Payment -->
      <div class="slide-container" :class="{ confirmed: isConfirmed }">
        <div class="slide-track">
          <div class="slide-text">{{ isConfirmed ? 'Payment Confirmed!' : 'Slide to Confirm Payment' }}</div>
          <div class="slide-button" :style="{ '--slide-offset': sliderPosition + 'px' }"
            :class="{ 'sliding': isDragging || isConfirmed }" @mousedown="startDrag" @touchstart="startDrag">
            <q-icon :name="isConfirmed ? 'check' : 'chevron_right'" color="white" />
          </div>
        </div>
      </div>
    </div>

    <!-- Insufficient Balance Bottom Sheet -->
    <q-dialog v-model="showInsufficientBalanceDialog" position="bottom" persistent>
      <q-card class="insufficient-bottom-sheet full-width q-pa-lg text-center">
        <!-- Warning Icon -->
        <div class="q-mb-md">
          <q-avatar size="60px" class="bg-amber-2">
            <q-icon name="warning" color="amber-8" size="30px" />
          </q-avatar>
        </div>

        <!-- Title -->
        <div class="text-h6 text-weight-bold q-mb-sm">Insufficient Balance</div>

        <!-- Description -->
        <div class="text-body2 text-grey-7 q-mb-xl" style="line-height: 1.4;">
          It seems like your account balance is insufficient to complete this action
        </div>

        <!-- Add Balance Button -->
        <q-btn unelevated color="amber-6" rounded class="full-width q-mb-md text-weight-bold" style="height: 48px;"
          @click="addBalance">
          Add Balance
        </q-btn>

        <!-- Cancel Button -->
        <q-btn flat color="amber-6" rounded class="full-width text-weight-bold"
          style="height: 48px; border: 1px solid #f0c14b;" @click="cancelPayment">
          Cancel
        </q-btn>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Reactive data
const voucherCode = ref('')
const priceUpdateTime = ref(new Date('2025-12-07T09:58:00'))
const cartItems = ref([])
const sliderPosition = ref(0)
const isDragging = ref(false)
const isConfirmed = ref(false)
const walletBalance = ref(0)
const showInsufficientBalanceDialog = ref(false)

// Price data (current market prices)
const goldPrice = ref('6,450.5')
const goldPriceUSD = ref('0.00')
const silverPrice = ref('107.25')
const silverPriceUSD = ref('0.00')

// Computed order items from cart
const orderItems = computed(() => {
  return cartItems.value.map(item => ({
    id: item.id,
    name: `${item.type === 'gold' ? 'Gold' : 'Silver'} Ingot - ${item.weight}`,
    quantity: item.quantity,
    price: item.totalPrice
  }))
})

// Computed fee data based on cart items
const mfFees = computed(() => {
  const goldItems = cartItems.value.filter(item => item.type === 'gold')
  const silverItems = cartItems.value.filter(item => item.type === 'silver')

  const fees = []

  if (goldItems.length > 0) {
    const goldMF = goldItems.reduce((sum, item) => sum + (item.mfgFee * item.weightValue * item.quantity), 0)
    fees.push({
      type: 'Gold',
      amount: goldMF
    })
  }

  if (silverItems.length > 0) {
    const silverMF = silverItems.reduce((sum, item) => sum + (item.mfgFee * item.weightValue * item.quantity), 0)
    fees.push({
      type: 'Silver',
      amount: silverMF
    })
  }

  return fees
})

const totalMF = computed(() => {
  return mfFees.value.reduce((sum, fee) => sum + fee.amount, 0)
})

const transactionFees = ref(2)
const storageFees = ref(0)

// Computed total from actual cart data
const itemsSubtotal = computed(() => {
  return cartItems.value.reduce((total, item) => total + item.totalPrice, 0)
})

const totalAmount = computed(() => {
  return itemsSubtotal.value + transactionFees.value + storageFees.value
})

// Methods
const goBack = () => {
  router.go(-1)
}

const formatDateTime = (date) => {
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price)
}

const startDrag = (event) => {
  isDragging.value = true
  const startX = event.type === 'mousedown' ? event.clientX : event.touches[0].clientX
  const sliderRect = event.target.closest('.slide-container').getBoundingClientRect()

  const onMove = (moveEvent) => {
    if (!isDragging.value) return

    const currentX = moveEvent.type === 'mousemove' ? moveEvent.clientX : moveEvent.touches[0].clientX
    const deltaX = currentX - startX
    const maxSlide = sliderRect.width - 60 // Button width

    sliderPosition.value = Math.max(0, Math.min(deltaX, maxSlide))

    // Check if slider is at the end
    if (sliderPosition.value >= maxSlide * 0.9) {
      confirmPayment()
    }
  }

  const onEnd = () => {
    isDragging.value = false
    if (!isConfirmed.value) {
      sliderPosition.value = 0 // Reset if not confirmed
    }
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseup', onEnd)
    document.removeEventListener('touchmove', onMove)
    document.removeEventListener('touchend', onEnd)
  }

  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onEnd)
  document.addEventListener('touchmove', onMove)
  document.addEventListener('touchend', onEnd)
}

const confirmPayment = () => {
  // Check if wallet balance is sufficient
  if (walletBalance.value < totalAmount.value) {
    showInsufficientBalanceDialog.value = true
    // Reset slider if insufficient balance
    sliderPosition.value = 0
    isDragging.value = false
    return
  }

  isConfirmed.value = true
  // Handle payment confirmation
  console.log('Payment confirmed for amount:', totalAmount.value)
  // You can add payment processing logic here
}

const addBalance = () => {
  showInsufficientBalanceDialog.value = false
  // Navigate to add balance/wallet page
  router.push('/wallet')
}

const cancelPayment = () => {
  showInsufficientBalanceDialog.value = false
}

// Load cart from localStorage
const loadCart = () => {
  const savedCart = localStorage.getItem('serganyCart')
  if (savedCart) {
    cartItems.value = JSON.parse(savedCart)
  }
}

// Load wallet balance (you can replace this with actual API call)
const loadWalletBalance = () => {
  // For demo, using a fixed amount - replace with actual wallet API call
  const savedBalance = localStorage.getItem('walletBalance')
  walletBalance.value = savedBalance ? parseFloat(savedBalance) : 1000 // Default demo balance
}

// Load cart data and wallet balance on mount
onMounted(() => {
  loadCart()
  loadWalletBalance()
})
</script>

<style scoped>
.voucher-input {
  border-radius: 8px;
}

.voucher-input :deep(.q-field__control) {
  border-radius: 8px;
}

.payment-details {
  background: transparent;
}

.payment-card {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  background: white;
}

.confirm-btn {
  height: 56px;
  font-size: 16px;
}

.confirm-btn :deep(.q-btn__content) {
  justify-content: center;
}

.rounded-small-borders {
  border-radius: 8px;
}

/* Slide to Confirm Styles */
.slide-container {
  width: 100%;
  height: 56px;
  background: white;
  border-radius: 28px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: background-color 0.3s ease;
  border: solid 1px #FDC82A;
}

.slide-container.confirmed {
  background: #4caf50;
}

.slide-track {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.slide-text {
  font-size: 16px;
  font-weight: bold;
  color: #FDC82A;
  text-align: center;
  position: absolute;
  width: 100%;
  z-index: 1;
  pointer-events: none;
  user-select: none;
}

.slide-button {
  position: absolute;
  left: 10px;
  top: 4px;
  width: 48px;
  height: 48px;
  background: #FDC82A;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  transition: background-color 0.3s ease;
  z-index: 2;
  font-size: 24px;
  animation: slideHint 2s ease-in-out infinite;
  transform: translateX(var(--slide-offset, 0px));
}

.slide-button.sliding {
  animation: none;
}

@keyframes slideHint {

  0%,
  100% {
    transform: translateX(calc(var(--slide-offset, 0px) + 0px));
  }

  25% {
    transform: translateX(calc(var(--slide-offset, 0px) + 8px));
  }

  50% {
    transform: translateX(calc(var(--slide-offset, 0px) + 0px));
  }

  75% {
    transform: translateX(calc(var(--slide-offset, 0px) + 8px));
  }
}

.slide-button:active {
  cursor: grabbing;
}

.slide-container.confirmed .slide-button {
  background: #2e7d32;
}

/* Insufficient Balance Bottom Sheet */
.insufficient-bottom-sheet {
  border-radius: 16px 16px 0 0;
  margin: 0;
  max-width: 100vw;
}

.insufficient-bottom-sheet .q-card {
  width: 100%;
}

/* Dark Theme Support */
.body--dark .slide-container {
  background: #2d2d2d !important;
  border-color: #FDC82A !important;
}

.body--dark .slide-text {
  color: #FDC82A !important;
}

.body--dark .payment-card {
  background: #2d2d2d !important;
  border-color: #3d3d3d !important;
}

.body--dark .insufficient-bottom-sheet {
  background: #2d2d2d !important;
}

</style>
