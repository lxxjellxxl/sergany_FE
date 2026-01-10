<template>
  <q-page class="q-pa-md bg-brand">
    <!-- Header -->
    <div class="row items-center q-mb-lg">
      <q-btn flat round icon="arrow_back" color="grey-7" @click="goBack" />
      <div class="text-h5 text-weight-bold q-ml-sm">Cart</div>
    </div>

    <!-- LOADING STATE -->
    <div v-if="cartLoading" class="flex flex-center" style="height: 60vh">
      <q-spinner color="amber-6" size="3em" />
    </div>

    <!-- EMPTY STATE -->
    <div v-else-if="cartItems.length === 0" class="column items-center justify-center full-height">
      <div class="empty-cart-icon q-mb-lg">
        <q-avatar size="80px" class="bg-amber-3">
          <q-icon name="shopping_cart" color="amber-8" size="40px" />
        </q-avatar>
        <div class="cart-wave wave-1"></div>
        <div class="cart-wave wave-2"></div>
      </div>
      <div class="text-h6 text-weight-bold q-mb-md text-center">Your cart is empty!</div>
      <div
        class="text-body2 text-grey-7 text-center q-mb-xl"
        style="max-width: 280px; line-height: 1.5"
      >
        When you select a gold or silver product, it will appear here for review.
      </div>
      <q-btn
        unelevated
        color="amber-6"
        rounded
        label="Start Shopping"
        class="full-width q-py-sm"
        style="max-width: 280px"
        @click="addFirstItem"
      />
    </div>

    <!-- CART CONTENT -->
    <div v-else class="cart-layout">
      <div class="cart-content">
        <!-- Live Price Info -->
        <div class="text-grey-6 text-body2 q-mb-md">Metal prices updated live</div>

        <!-- Buy Prices Cards -->
        <div class="row q-col-gutter-md q-mb-md">
          <div class="col-6">
            <q-card flat class="bg-white q-pa-md text-center rounded-small-borders">
              <div class="text-caption text-grey-6">Buy Gold - 24K</div>
              <div class="text-h6 text-weight-bold q-mt-xs text-amber-9">
                {{ formatCurrency(goldRate.buyPrice) }}
              </div>
            </q-card>
          </div>
          <div class="col-6">
            <q-card flat class="bg-white q-pa-md text-center rounded-small-borders">
              <div class="text-caption text-grey-6">Buy Silver - 999</div>
              <div class="text-h6 text-weight-bold q-mt-xs text-grey-9">
                {{ formatCurrency(silverRate.buyPrice) }}
              </div>
            </q-card>
          </div>
        </div>

        <!-- Info Banner -->
        <div class="bg-grey-2 q-pa-md rounded-borders q-mb-lg">
          <div class="text-h6 text-weight-medium q-mb-sm">Storage & Collection</div>
          <div class="text-body2 text-grey-7" style="line-height: 1.5">
            Your metals are protected in trusted vaults. You can request secure collection anytime.
          </div>
        </div>

        <!-- Cart Items List -->
        <div class="cart-items">
          <div v-for="item in cartItems" :key="item.id" class="cart-item q-mb-md">
            <q-card flat class="bg-white q-pa-md rounded-borders">
              <div class="row items-center">
                <!-- Icon -->
                <div class="col-auto q-mr-md">
                  <div class="metal-icon" :class="getMetalClass(item.metal_type)">
                    <q-icon name="circle" size="24px" />
                  </div>
                </div>

                <!-- Details -->
                <div class="col">
                  <div class="text-body2 text-weight-medium">
                    {{ item.product_name }}
                  </div>
                  <div class="text-caption text-grey-6 q-mt-xs">
                    {{ parseFloat(item.weight_grams) }}g x {{ item.quantity }}
                  </div>
                  <div class="text-caption text-grey-5">
                    Fees: {{ formatCurrency(item.mfg_fees) }}
                  </div>
                </div>

                <!-- Price & Delete -->
                <div class="col-auto text-right">
                  <div class="row items-center justify-end q-mb-sm">
                    <q-btn
                      round
                      flat
                      icon="delete_outline"
                      color="red-5"
                      size="sm"
                      @click="removeItem(item.id)"
                      :loading="removingId === item.id"
                    />
                  </div>
                  <div class="text-body1 text-weight-bold">
                    {{ formatCurrency(item.total_line_price) }}
                  </div>
                </div>
              </div>
            </q-card>
          </div>
        </div>
      </div>

      <!-- Footer / Checkout -->
      <div class="cart-bottom">
        <div class="total-section q-mb-md">
          <q-card flat class="bg-white q-pa-md rounded-borders bg-grey-4">
            <div class="row items-center justify-between">
              <div class="text-body2">Total Amount :</div>
              <div class="text-h6 text-weight-bold">{{ formatCurrency(cartTotal) }}</div>
            </div>
          </q-card>
        </div>

        <q-btn
          unelevated
          color="amber-6"
          rounded
          size="md"
          class="full-width q-py-sm text-weight-bold"
          style="height: 56px"
          @click="showCheckoutDialog = true"
        >
          Proceed to payment
        </q-btn>
      </div>
    </div>

    <!-- CHECKOUT CONFIRMATION DIALOG (PIN) -->
    <q-dialog v-model="showCheckoutDialog" position="bottom">
      <q-card class="full-width" style="border-radius: 20px 20px 0 0">
        <q-card-section class="q-pt-lg q-px-lg">
          <div class="text-h6 text-center q-mb-md">Confirm Purchase</div>
          <p class="text-center text-grey-7 q-mb-lg">
            Please enter your transaction PIN to confirm the payment of
            <strong class="text-dark">{{ formatCurrency(cartTotal) }}</strong>
          </p>

          <q-input
            v-model="pin"
            type="password"
            outlined
            rounded
            dense
            placeholder="Enter 6-digit PIN"
            class="q-mb-xl text-center custom-pin-input"
            input-class="text-center text-h6 letter-spacing-md"
            maxlength="6"
            mask="######"
          />

          <q-btn
            label="Confirm & Pay"
            color="green-6"
            class="full-width q-mb-md"
            size="lg"
            unelevated
            rounded
            :loading="checkoutLoading"
            :disable="pin.length < 4"
            @click="processPayment"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useTransactionsStore } from 'src/stores/transactions-store'
import { useMarketStore } from 'src/stores/market-store'

const router = useRouter()
const $q = useQuasar()
const transactionsStore = useTransactionsStore()
const marketStore = useMarketStore()

// State
const removingId = ref(null)
const showCheckoutDialog = ref(false)
const checkoutLoading = ref(false)
const pin = ref('')

// Computed
const cartItems = computed(() => transactionsStore.cartItems)
const cartTotal = computed(() => transactionsStore.cartTotal)
const cartLoading = computed(() => transactionsStore.cartLoading)

// Market Rates
const goldRate = computed(() => marketStore.goldRate)
const silverRate = computed(() => marketStore.silverRate)

// Init
onMounted(async () => {
  await Promise.all([transactionsStore.fetchCart(), marketStore.fetchRates()])
})

// Methods
const goBack = () => router.go(-1)
const addFirstItem = () => router.push('/')

const formatCurrency = (val) => {
  if (!val && val !== 0) return '0 EGP'
  return Math.round(parseFloat(val)).toLocaleString() + ' EGP'
}

const getMetalClass = (type) => {
  return type === 'GOLD' ? 'gold-icon' : 'silver-icon'
}

const removeItem = async (itemId) => {
  removingId.value = itemId
  try {
    await transactionsStore.removeFromCart(itemId)
    $q.notify({ type: 'positive', message: 'Item removed', position: 'top' })
  } catch (e) {
    $q.notify({ type: 'negative', message: 'Failed to remove item', position: 'top' })
  } finally {
    removingId.value = null
  }
}

const processPayment = async () => {
  checkoutLoading.value = true
  try {
    // Prepare payload for the Backend BuyView
    const buyPayload = {
      pin: pin.value,
      // Map cart items to the format expected by BuyOrderSerializer
      items: cartItems.value.map((item) => ({
        template_id: item.product, // 'product' is the ID in serializer
        quantity: item.quantity,
      })),
      coupon_code: '',
    }

    await transactionsStore.buyTransaction(buyPayload)

    showCheckoutDialog.value = false
    $q.notify({ type: 'positive', message: 'Purchase Successful!', position: 'top' })
    router.replace('/wallet') // Redirect to wallet
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.error || 'Payment Failed',
      position: 'top',
    })
  } finally {
    checkoutLoading.value = false
  }
}
</script>

<style scoped>
/* Cart Layout */
.cart-layout {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 80px); /* Adjust based on header size */
}

.cart-content {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 20px;
}

.cart-bottom {
  background: #f8f9fa;
  padding: 16px;
  margin: 0 -16px -16px -16px;
  border-top: 1px solid #e0e0e0;
}

/* Metal Icons */
.metal-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.gold-icon {
  background: #fdc82a;
  color: white;
}
.silver-icon {
  background: #c0c0c0;
  color: white;
}

/* Empty Cart Animation */
.empty-cart-icon {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}
.cart-wave {
  position: absolute;
  border: 2px solid #f39c12;
  border-radius: 50%;
  animation: cart-pulse 2s infinite;
}
.wave-1 {
  width: 100px;
  height: 100px;
  animation-delay: 0s;
}
.wave-2 {
  width: 120px;
  height: 120px;
  animation-delay: 0.4s;
}

@keyframes cart-pulse {
  0% {
    opacity: 0.8;
    transform: scale(0.8);
  }
  50% {
    opacity: 0.4;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(1.3);
  }
}

.full-height {
  min-height: 60vh;
  width: 100%;
}

/* Pin Input Styling */
.custom-pin-input :deep(input) {
  letter-spacing: 0.5em;
  font-weight: bold;
}
</style>
