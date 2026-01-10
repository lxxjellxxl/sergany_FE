<template>
  <div>
    <!-- Last Update Header -->
    <div class="text-grey-6 text-body2 q-mb-md">
      Gold price updated at {{ formattedLastUpdate }}
    </div>

    <!-- Live Rates Cards -->
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-6">
        <q-card flat class="bg-white q-pa-md text-center rounded-small-borders">
          <div class="text-caption text-grey-6">Buy - 24K (Fees Excl.)</div>
          <div class="text-h6 text-weight-bold q-mt-xs text-gold">
            {{ formatCurrency(goldRate.buyPrice) }}
          </div>
        </q-card>
      </div>
      <div class="col-6">
        <q-card flat class="bg-white q-pa-md text-center rounded-small-borders">
          <div class="text-caption text-grey-6">Sell - 24K (Fees Excl.)</div>
          <div class="text-h6 text-weight-bold q-mt-xs">
            {{ formatCurrency(goldRate.sellPrice) }}
          </div>
        </q-card>
      </div>
    </div>

    <!-- Main Container -->
    <div class="bg-white q-pa-md rounded-small-borders">
      <!-- Wallet Balance -->
      <div class="row items-center q-mb-lg">
        <q-avatar size="40px" class="bg-grey-8 text-white q-mr-md">
          <q-icon name="account_balance_wallet" />
        </q-avatar>
        <div>
          <div class="text-body2 text-grey-6">Available Balance</div>
          <div class="text-h6 text-weight-bold">{{ formatCurrency(userBalance) }}</div>
        </div>
      </div>

      <!-- TABS -->
      <q-tabs
        v-model="tab"
        dense
        class="text-grey q-mb-md"
        active-color="gold"
        indicator-color="gold"
        align="justify"
        narrow-indicator
        @update:model-value="resetState"
      >
        <q-tab name="manual" label="Select Item" />
        <q-tab name="smart" label="Smart Calculator" />
      </q-tabs>

      <q-separator class="q-mb-md" />

      <q-tab-panels v-model="tab" animated class="bg-transparent text-dark q-pa-none">
        <!-- TAB 1: SELECT ITEM (Dropdown -> Split Logic) -->
        <q-tab-panel name="manual" class="q-pa-none">
          <!-- Weight Selection Trigger -->
          <q-input
            v-model="selectedWeightDisplay"
            :label="selectedWeightDisplay ? '' : 'Select total weight'"
            placeholder="Select total weight"
            rounded
            outlined
            readonly
            class="q-mb-md cursor-pointer custom-input"
            @click="showWeightDialog = true"
          >
            <template v-slot:append>
              <q-icon
                name="expand_more"
                class="cursor-pointer weight-arrow"
                @click="showWeightDialog = true"
              />
            </template>
          </q-input>

          <!-- Split Selector (Quantity of Bars) -->
          <div v-if="selectedWeightId" class="q-mb-md">
            <div class="text-body2 text-grey-7 q-mb-sm">Quantity of bars (Split)</div>

            <div class="quantity-selector-rounded" :class="{ disabled: validSplits.length <= 1 }">
              <q-btn
                round
                flat
                icon="remove"
                color="grey-6"
                size="md"
                :disable="selectedSplitIndex <= 0"
                @click="prevSplit"
              />
              <div class="quantity-display-center">
                {{ currentSplit ? currentSplit.count : '-' }}
              </div>
              <q-btn
                round
                flat
                icon="add"
                color="gold"
                size="md"
                :disable="selectedSplitIndex >= validSplits.length - 1"
                @click="nextSplit"
              />
            </div>

            <!-- Details of the current split -->
            <div v-if="currentSplit" class="text-center q-mt-sm bg-grey-1 q-pa-sm rounded-borders">
              <div class="text-caption text-grey-8">
                Configuration:
                <span class="text-weight-bold"
                  >{{ currentSplit.count }}x {{ currentSplit.product.name }}</span
                >
              </div>
              <div class="text-caption text-grey-6">
                Total Weight: {{ formatWeight(currentManualWeight) }}
              </div>
            </div>

            <div
              v-if="validSplits.length === 0"
              class="text-caption text-negative text-center q-mt-sm"
            >
              Insufficient stock available (Check your cart).
            </div>
          </div>

          <!-- Manual Add Button -->
          <q-btn
            v-if="selectedWeightId"
            color="gold"
            text-color="white"
            no-caps
            unelevated
            rounded
            size="lg"
            class="full-width add-cart-btn"
            @click="addToCartManual"
            :loading="loading"
            :disable="!currentSplit"
          >
            <div class="cart-content">
              <span class="cart-quantity">{{ currentSplit ? currentSplit.count : 0 }}</span>
              <span class="cart-label">Add to cart</span>
              <span class="cart-price">{{ formatCurrency(calculatedManualPrice) }}</span>
            </div>
          </q-btn>
        </q-tab-panel>

        <!-- TAB 2: SMART CALCULATOR (Custom Input) -->
        <q-tab-panel name="smart" class="q-pa-none">
          <div class="q-mb-lg">
            <div class="text-body2 text-grey-7 q-mb-sm text-weight-medium">
              Enter custom weight:
            </div>
            <q-input
              v-model.number="targetWeight"
              type="number"
              placeholder="e.g. 20"
              rounded
              outlined
              dense
              suffix="Grams"
              class="custom-input"
              :rules="[
                (val) => val > 0 || 'Please enter a valid weight',
                (val) =>
                  val <= totalEffectiveWeight ||
                  `Only ${totalEffectiveWeight}g available (Check cart)`,
              ]"
              @update:model-value="calculateOptionsFromInput"
            />
          </div>

          <!-- SMART OPTIONS RESULT -->
          <div v-if="generatedOptions.length > 0">
            <div class="text-body2 text-grey-7 q-mb-sm text-weight-medium">
              Choose your package:
            </div>

            <div class="row q-col-gutter-sm">
              <div v-for="(option, index) in generatedOptions" :key="index" class="col-12">
                <q-card
                  flat
                  bordered
                  class="cursor-pointer option-card"
                  :class="{ 'selected-card': selectedOptionIndex === index }"
                  @click="selectedOptionIndex = index"
                >
                  <q-card-section class="row items-center justify-between no-wrap q-py-sm">
                    <div class="row items-center">
                      <q-radio v-model="selectedOptionIndex" :val="index" color="gold" keep-color />
                      <div class="q-ml-sm">
                        <div class="text-weight-bold">{{ option.label }}</div>
                        <div class="text-caption text-grey-7">{{ option.description }}</div>
                      </div>
                    </div>
                    <div class="text-right">
                      <div class="text-weight-bold text-gold">
                        {{ formatCurrency(option.totalPrice) }}
                      </div>
                      <div class="text-caption text-grey-6" style="font-size: 10px">
                        Fees: {{ formatCurrency(option.totalFees) }}
                      </div>
                    </div>
                  </q-card-section>

                  <q-separator v-if="selectedOptionIndex === index" />
                  <q-card-section v-if="selectedOptionIndex === index" class="bg-grey-1 q-py-sm">
                    <div class="text-caption text-weight-bold text-grey-8 q-mb-xs">
                      Package Contents:
                    </div>
                    <div
                      v-for="(item, idx) in option.items"
                      :key="idx"
                      class="row justify-between text-caption text-grey-7"
                    >
                      <span>{{ item.quantity }}x {{ item.product.name }}</span>
                      <span>{{ formatCurrency(item.cost) }}</span>
                    </div>
                  </q-card-section>
                </q-card>
              </div>
            </div>

            <q-btn
              color="gold"
              text-color="white"
              no-caps
              unelevated
              rounded
              size="lg"
              class="full-width add-cart-btn q-mt-lg"
              @click="addPackageToCart"
              :loading="loading"
              :disable="selectedOptionIndex === null"
            >
              <div class="cart-content">
                <span class="text-weight-bold">Add Package</span>
                <span v-if="selectedOptionIndex !== null" class="cart-price">
                  {{ formatCurrency(generatedOptions[selectedOptionIndex].totalPrice) }}
                </span>
              </div>
            </q-btn>
          </div>

          <!-- Empty State -->
          <div v-else-if="targetWeight > 0" class="text-center q-pa-md text-grey">
            <q-icon name="info" size="sm" class="q-mb-xs" />
            <div class="text-caption">
              Cannot build {{ targetWeight }}g with current effective stock. <br />Check your cart
              or try standard weights.
            </div>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </div>

    <!-- Shared: Weight Selection Dialog -->
    <q-dialog v-model="showWeightDialog" position="bottom">
      <q-card class="weight-dialog">
        <q-card-section class="q-pb-none">
          <div class="text-center">
            <div class="dialog-handle"></div>
          </div>
          <div class="text-h6 text-weight-medium q-mt-md">Select Alloy Weight</div>
          <div class="text-caption text-grey-6">(Availability based on Stock - Cart)</div>
        </q-card-section>

        <q-card-section class="scroll" style="max-height: 50vh">
          <div class="weight-options">
            <div
              v-for="product in goldInventory"
              :key="product.id"
              class="weight-option-item"
              @click="selectWeightManual(product)"
              :class="{ 'disabled-item': getEffectiveStock(product) <= 0 }"
            >
              <q-radio
                v-model="selectedWeightId"
                :val="product.id"
                color="gold"
                class="weight-radio"
                :disable="getEffectiveStock(product) <= 0"
              />
              <div class="weight-details full-width q-ml-sm">
                <div class="row justify-between items-center">
                  <div class="weight-amount text-weight-bold">
                    {{ product.name }}
                  </div>
                  <!-- Stock Indicator (Effective) -->
                  <div
                    class="text-caption text-weight-bold"
                    :class="getEffectiveStock(product) > 0 ? 'text-green' : 'text-red'"
                  >
                    {{
                      getEffectiveStock(product) > 0
                        ? `${getEffectiveStock(product)} Available`
                        : 'Sold Out'
                    }}
                  </div>
                </div>
                <div class="weight-fees text-grey-7 text-caption">
                  Fees: {{ formatCurrency(product.factoring_fees) }}
                </div>
              </div>
            </div>

            <div v-if="goldInventory.length === 0" class="text-center q-pa-lg text-grey">
              No products available.
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Shared: Success Dialog -->
    <q-dialog v-model="showSuccessDialog" persistent position="bottom">
      <q-card class="success-dialog">
        <q-card-section class="text-center q-pt-xl q-pb-md">
          <div class="success-icon">
            <q-icon name="check" color="white" size="48px" />
          </div>
          <div class="text-h6 text-weight-medium q-mt-lg">Added to Cart!</div>
          <div class="text-body2 text-grey-6 q-mt-sm">
            Inventory updated. Check your cart to checkout.
          </div>
        </q-card-section>

        <q-card-section class="q-px-lg q-pb-lg">
          <q-btn
            label="Continue Shopping"
            color="gold"
            text-color="white"
            no-caps
            unelevated
            rounded
            class="full-width q-mb-sm action-btn"
            @click="continueShopping"
          />
          <q-btn
            label="Go to Checkout"
            color="white"
            text-color="gold"
            no-caps
            unelevated
            rounded
            class="full-width outline-btn"
            @click="goToCheckout"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onActivated, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useMarketStore } from 'src/stores/market-store'
import { useInventoryStore } from 'src/stores/inventory-store'
import { useUsersStore } from 'src/stores/users-store'
import { useTransactionsStore } from 'src/stores/transactions-store' // Added

const router = useRouter()
const $q = useQuasar()
const emit = defineEmits(['item-added'])

// Stores
const marketStore = useMarketStore()
const inventoryStore = useInventoryStore()
const userStore = useUsersStore()
const transactionsStore = useTransactionsStore()

// --- STATE ---
const tab = ref('manual')
const loading = ref(false)
const showSuccessDialog = ref(false)

// Manual Tab State
const selectedWeightId = ref(null)
const selectedWeightDisplay = ref('')
const selectedSplitIndex = ref(0)
const showWeightDialog = ref(false)

// Smart Tab State
const targetWeight = ref(null)
const selectedOptionIndex = ref(0)
const generatedOptions = ref([])

// --- COMPUTED PROPERTIES ---

const goldRate = computed(() => marketStore.goldRate)
const goldInventory = computed(() => inventoryStore.availableGoldProducts || [])
const userBalance = computed(() => parseFloat(userStore.user?.wallet_balance || 0))

const formattedLastUpdate = computed(() => {
  if (!goldRate.value.updatedAt) return 'Loading...'
  return new Date(goldRate.value.updatedAt).toLocaleString()
})

// *** CRITICAL HELPER: Effective Stock ***
// Returns: Real Database Stock - Quantity currently in user's cart
const getEffectiveStock = (product) => {
  const cartItem = transactionsStore.cartItems.find((item) => item.product === product.id)
  const inCartQty = cartItem ? cartItem.quantity : 0
  return Math.max(product.available_stock - inCartQty, 0)
}

// Calculate Total Available Weight considering what's already in the cart
const totalEffectiveWeight = computed(() => {
  return goldInventory.value.reduce((total, p) => {
    return total + parseFloat(p.weight_grams) * getEffectiveStock(p)
  }, 0)
})

// --- MANUAL TAB COMPUTED LOGIC ---

// 1. Valid Splits (Using EFFECTIVE Stock)
const validSplits = computed(() => {
  if (!selectedWeightId.value) return []

  const targetProduct = goldInventory.value.find((p) => p.id === selectedWeightId.value)
  if (!targetProduct) return []

  const targetTotalWeight = parseFloat(targetProduct.weight_grams)

  const options = []

  goldInventory.value.forEach((p) => {
    const pWeight = parseFloat(p.weight_grams)
    const ratio = targetTotalWeight / pWeight

    if (Math.abs(ratio - Math.round(ratio)) < 0.001) {
      const count = Math.round(ratio)
      // Check EFFECTIVE stock
      if (getEffectiveStock(p) >= count) {
        options.push({
          count: count,
          product: p,
          weight: pWeight,
        })
      }
    }
  })

  return options.sort((a, b) => a.count - b.count)
})

const currentSplit = computed(() => {
  if (validSplits.value.length === 0) return null
  const idx = Math.min(selectedSplitIndex.value, validSplits.value.length - 1)
  return validSplits.value[idx]
})

const currentManualWeight = computed(() => {
  if (!currentSplit.value) return 0
  return currentSplit.value.count * parseFloat(currentSplit.value.product.weight_grams)
})

const calculatedManualPrice = computed(() => {
  if (!currentSplit.value) return 0

  const { count, product } = currentSplit.value
  const basePrice = goldRate.value.buyPrice
  const weight = parseFloat(product.weight_grams)
  const fees = parseFloat(product.factoring_fees)

  const pricePerItem = basePrice * weight + fees
  return pricePerItem * count
})

// --- LIFECYCLE ---
const loadData = async () => {
  try {
    loading.value = true
    await Promise.all([
      marketStore.fetchRates(true),
      inventoryStore.fetchProducts(),
      userStore.fetchCurrentUser(),
      transactionsStore.fetchCart(), // Fetch cart to ensure effective stock is accurate
    ])
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(loadData)
onActivated(loadData)

// --- HELPER METHODS ---
const formatCurrency = (val) => {
  if (!val && val !== 0) return '0 EGP'
  return Math.round(val).toLocaleString() + ' EGP'
}

const formatWeight = (val) => {
  return `${parseFloat(val)} ${parseFloat(val) === 1 ? 'Gram' : 'Grams'}`
}

const resetState = () => {
  generatedOptions.value = []
  targetWeight.value = null
  selectedOptionIndex.value = 0
  // Recalculate options if switching back
}

// --- MANUAL TAB ACTIONS ---

const selectWeightManual = (product) => {
  // Allow selection even if effective stock is 0,
  // because user might be able to fulfill this weight using smaller bars.
  selectedWeightId.value = product.id
  selectedWeightDisplay.value = product.name
  selectedSplitIndex.value = 0
  showWeightDialog.value = false
}

const prevSplit = () => {
  if (selectedSplitIndex.value > 0) selectedSplitIndex.value--
}

const nextSplit = () => {
  if (selectedSplitIndex.value < validSplits.value.length - 1) selectedSplitIndex.value++
}

const addToCartManual = async () => {
  if (!currentSplit.value) return
  const { count, product } = currentSplit.value

  const itemToAdd = [
    {
      product_id: product.id,
      quantity: count,
    },
  ]

  await saveToCart(itemToAdd)
}

// --- SMART TAB ACTIONS (Uses getEffectiveStock) ---

const calculateOptionsFromInput = (val) => {
  calculateOptionsInternal(val)
}

function calculateOptionsInternal(weightTarget) {
  if (!weightTarget || weightTarget <= 0) {
    generatedOptions.value = []
    return
  }

  const results = []

  const bestValueCombo = calculateCombination(weightTarget, 'desc')
  if (bestValueCombo) {
    results.push({
      label: 'Best Value',
      description: 'Lowest manufacturing fees',
      ...bestValueCombo,
    })
  }

  const flexibleCombo = calculateCombination(weightTarget, 'asc')
  if (flexibleCombo) {
    const isDuplicate =
      JSON.stringify(flexibleCombo.items) === JSON.stringify(bestValueCombo?.items)
    if (!isDuplicate) {
      results.push({
        label: 'Maximum Flexibility',
        description: 'Easier to resell in parts',
        ...flexibleCombo,
      })
    }
  }

  generatedOptions.value = results
  if (results.length > 0) selectedOptionIndex.value = 0
}

function calculateCombination(target, sortOrder = 'desc') {
  // Sort Inventory
  const sortedInventory = [...goldInventory.value].sort((a, b) => {
    const wa = parseFloat(a.weight_grams)
    const wb = parseFloat(b.weight_grams)
    return sortOrder === 'desc' ? wb - wa : wa - wb
  })

  let remainingWeight = target
  let totalFees = 0
  let totalPrice = 0
  const selectedItems = []

  for (const product of sortedInventory) {
    if (remainingWeight <= 0) break
    const weight = parseFloat(product.weight_grams)

    // USE EFFECTIVE STOCK (Database - Cart)
    const stock = getEffectiveStock(product)

    if (weight <= remainingWeight + 0.001) {
      const maxWeCanTake = Math.floor(remainingWeight / weight)
      const qtyToTake = Math.min(maxWeCanTake, stock)

      if (qtyToTake > 0) {
        const basePrice = goldRate.value.buyPrice
        const mfgFee = parseFloat(product.factoring_fees)
        const itemCost = (basePrice * weight + mfgFee) * qtyToTake

        selectedItems.push({
          product: product,
          quantity: qtyToTake,
          cost: itemCost,
        })

        totalFees += mfgFee * qtyToTake
        totalPrice += itemCost
        remainingWeight -= weight * qtyToTake
      }
    }
  }

  if (Math.abs(remainingWeight) < 0.01) {
    return { items: selectedItems, totalFees, totalPrice }
  }
  return null
}

const addPackageToCart = async () => {
  const option = generatedOptions.value[selectedOptionIndex.value]
  if (!option) return

  const itemsToAdd = option.items.map((item) => ({
    product_id: item.product.id,
    quantity: item.quantity,
  }))

  await saveToCart(itemsToAdd)

  targetWeight.value = null
  generatedOptions.value = []
}

// --- SHARED ACTIONS ---

const saveToCart = async (items) => {
  loading.value = true
  try {
    const promises = items.map((item) => transactionsStore.addToCart(item))
    await Promise.all(promises)

    showSuccessDialog.value = true
    emit('item-added')

    // CRITICAL: Refresh data so Effective Stock updates immediately
    await loadData()
  } catch (error) {
    console.error(error)
    $q.notify({
      type: 'negative',
      message: error.response?.data?.error || 'Failed to add to cart.',
    })
  } finally {
    loading.value = false
  }
}

const continueShopping = () => {
  showSuccessDialog.value = false
  selectedWeightId.value = null
  selectedWeightDisplay.value = ''
  selectedSplitIndex.value = 0
}

const goToCheckout = () => {
  showSuccessDialog.value = false
  router.push('/cart')
}
</script>

<style scoped>
.text-gold {
  color: #fdc82a;
}

.custom-input :deep(.q-field__control) {
  border-radius: 28px;
  background: white;
}

/* Tabs */
:deep(.q-tab__label) {
  font-weight: 600;
}

/* Option Cards */
.option-card {
  border: 2px solid transparent;
  transition: all 0.2s ease;
  border-radius: 12px;
}
.selected-card {
  border-color: #fdc82a;
  background-color: #fffdf5;
}

/* Quantity Selector */
.quantity-selector-rounded {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 50px;
  background: white;
}
.quantity-selector-rounded.disabled {
  opacity: 0.5;
  pointer-events: none;
}
.quantity-display-center {
  font-size: 20px;
  font-weight: 700;
  min-width: 60px;
  text-align: center;
}

/* Buttons */
.add-cart-btn {
  height: 56px;
  background: #fdc82a !important;
  color: black !important;
}
.cart-content {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0 8px;
}
.cart-quantity {
  background: rgba(0, 0, 0, 0.1);
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

/* Dialog */
.weight-dialog {
  border-radius: 16px 16px 0 0;
  max-width: 100%;
}
.dialog-handle {
  width: 40px;
  height: 4px;
  background: #e0e0e0;
  border-radius: 2px;
  margin: 8px auto;
}
.weight-option-item {
  display: flex;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
}
.disabled-item {
  opacity: 0.6;
  cursor: not-allowed;
  background-color: #f9f9f9;
}
.weight-radio :deep(.q-radio__inner) {
  color: #fdc82a;
}

/* Success Modal */
.success-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #fdc82a;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}
.action-btn {
  height: 48px;
  font-weight: 600;
}
.outline-btn {
  height: 48px;
  font-weight: 600;
  border: 2px solid #fdc82a;
}
</style>
