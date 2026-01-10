<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <q-page class="q-pa-md bg-brand">
    <div class="bckgnd"></div>

    <!-- Stacked Wallet Cards -->
    <div
      class="cards-container q-mb-lg"
      @touchstart="handleTouchStart"
      @touchend="handleTouchEnd"
      @mousedown="handleMouseDown"
      @mouseup="handleMouseUp"
    >
      <!-- Background Card (Bronze) -->
      <q-card
        class="wallet-card-bronze background-card"
        :class="{ 'card-hidden': currentCard === 'bronze' }"
        flat
      >
        <q-card-section class="q-pa-md">
          <div class="row items-center justify-between q-mb-md">
            <div class="text-white text-caption">Available for withdrawal</div>
            <div class="wallet-logo text-white text-body1 text-weight-bold">سرجاني</div>
          </div>
          <div class="text-white text-h4 text-weight-bold q-mb-sm">
            {{ balanceVisible ? formattedBalance : '*****' }} EGP
          </div>
          <div class="row items-center q-mb-md">
            <div class="text-white text-caption q-mr-xs">Processing</div>
            <q-icon name="help_outline" color="white" size="14px" />
          </div>

          <img src="/serganyLogo2.png" class="sergany-logo" alt="سرجاني Logo" />

          <div class="text-white text-h6 text-weight-medium q-mb-lg">
            {{ balanceVisible ? formattedBalance : '*****' }} EGP
          </div>
          <div class="row q-gutter-md">
            <q-btn
              flat
              no-caps
              :icon="balanceVisible ? 'visibility_off' : 'visibility'"
              :label="balanceVisible ? 'Hide Balance' : 'Show Balance'"
              color="white"
              text-color="white"
              class="text-caption"
              @click.stop="toggleBalance"
            />
            <q-btn
              flat
              no-caps
              icon="account_balance_wallet"
              label="Withdraw"
              color="white"
              text-color="white"
              class="text-caption"
              @click.stop="withdraw"
            />
          </div>
        </q-card-section>
      </q-card>

      <!-- Foreground Card (Gold) -->
      <q-card
        class="wallet-card-gold foreground-card"
        :class="{ 'card-hidden': currentCard === 'bronze' }"
        flat
      >
        <q-card-section class="q-pa-md">
          <div class="row items-center justify-between q-mb-md">
            <div class="text-white text-caption">Total</div>
            <div class="wallet-logo text-white text-body1 text-weight-bold">سرجاني</div>
          </div>
          <div class="text-white text-h4 text-weight-bold q-mb-sm">
            {{ balanceVisible ? formattedBalance : '*****' }} EGP
          </div>
          <div class="row items-center q-mb-md">
            <div class="text-white text-caption q-mr-xs">Available</div>
            <q-icon name="help_outline" color="white" size="14px" />
          </div>

          <img src="/serganyLogo.png" class="sergany-logo" alt="سرجاني Logo" />

          <div class="text-white text-h6 text-weight-medium q-mb-lg">
            {{ balanceVisible ? formattedBalance : '*****' }} EGP
          </div>
          <div class="row q-gutter-md">
            <q-btn
              flat
              no-caps
              :icon="balanceVisible ? 'visibility_off' : 'visibility'"
              :label="balanceVisible ? 'Hide Balance' : 'Show Balance'"
              color="white"
              text-color="white"
              class="text-caption"
              @click.stop="toggleBalance"
            />
            <q-btn
              flat
              no-caps
              icon="add_circle_outline"
              label="Add Balance"
              color="white"
              text-color="white"
              class="text-caption"
              @click.stop="addBalance"
            />
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Page Indicators -->
    <div class="text-center q-mb-lg">
      <div
        class="indicator-dot"
        :class="{ 'active-gold': currentCard === 'gold' }"
        @click="currentCard = 'gold'"
      ></div>
      <div
        class="indicator-dot q-ml-xs"
        :class="{ 'active-bronze': currentCard === 'bronze' }"
        @click="currentCard = 'bronze'"
      ></div>
    </div>

    <!-- Transactions History -->
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h6 text-weight-medium">Transactions History</div>
      <q-btn
        flat
        no-caps
        label="See All"
        color="grey-6"
        class="text-caption"
        @click="showAllTransactions = true"
      />
    </div>

    <!-- Deposit Transactions List (show only 5) -->
    <div v-if="depositTransactions.length > 0">
      <q-list separator>
        <q-item
          v-for="tx in depositTransactions.slice(0, 5)"
          :key="tx.id"
          class="transaction-item q-mb-md"
          clickable
          @click="openTransaction(tx)"
        >
          <q-item-section avatar>
            <q-avatar size="48px">
              <img :src="tx.proof_image" alt="Proof" />
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-bold text-body2">
              Deposit - {{ tx.system_bank_details?.bank_name || 'Bank' }}
            </q-item-label>
            <q-item-label caption>
              <span class="text-grey-7">From:</span> {{ tx.sender_bank_name }}
              <span class="q-ml-md text-grey-7">To:</span>
              {{ tx.system_bank_details?.account_holder }}
            </q-item-label>
            <q-item-label caption>
              <span class="text-grey-7">Date:</span> {{ formatDate(tx.created_at) }}
            </q-item-label>
          </q-item-section>
          <q-item-section side top>
            <div class="text-body1 text-weight-bold text-right">
              {{ Number(tx.amount).toLocaleString() }} EGP
            </div>
            <q-badge :color="getStatusColor(tx.status)" class="q-mt-xs q-badge-align-right">
              {{ tx.status.charAt(0) + tx.status.slice(1).toLowerCase() }}
            </q-badge>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
    <!-- Empty State -->
    <div v-else class="column items-center justify-center q-mt-lg q-pt-lg">
      <div class="empty-placeholder q-mb-md">
        <q-icon name="receipt_long" size="80px" color="grey-4" />
      </div>
      <div class="text-body2 text-grey-6 text-center" style="max-width: 280px">
        Make your first move to see your transactions here
      </div>
    </div>

    <!-- Transaction Details Dialog -->
    <q-dialog v-model="showTransactionDialog" persistent>
      <q-card class="q-pa-md" style="max-width: 400px; width: 100%; border-radius: 30px">
        <q-card-section>
          <div class="row items-center q-mb-md">
            <q-avatar size="56px">
              <img :src="selectedTransaction?.proof_image" alt="Proof" />
            </q-avatar>
            <div class="q-ml-md">
              <div class="text-h6 text-weight-bold">Deposit Details</div>
              <q-badge
                :color="getStatusColor(selectedTransaction?.status)"
                class="q-mt-xs q-badge-align-right"
              >
                {{
                  selectedTransaction?.status.charAt(0) +
                  selectedTransaction?.status.slice(1).toLowerCase()
                }}
              </q-badge>
            </div>
          </div>
          <div class="q-mb-sm">
            <span class="text-grey-7">Amount: </span>
            <span class="text-weight-bold"
              >{{ Number(selectedTransaction?.amount).toLocaleString() }} EGP</span
            >
          </div>
          <div class="q-mb-sm">
            <span class="text-grey-7">Date: </span>
            <span>{{ formatDate(selectedTransaction?.created_at) }}</span>
          </div>
          <div class="q-mb-sm">
            <span class="text-grey-7">Sender Bank: </span>
            <span>{{ selectedTransaction?.sender_bank_name }}</span>
          </div>
          <div class="q-mb-sm">
            <span class="text-grey-7">System Bank: </span>
            <span>{{ selectedTransaction?.system_bank_details?.bank_name }}</span>
          </div>
          <div class="q-mb-sm">
            <span class="text-grey-7">Account Holder: </span>
            <span>{{ selectedTransaction?.system_bank_details?.account_holder }}</span>
          </div>
          <div class="q-mb-sm">
            <span class="text-grey-7">Account Number: </span>
            <span>{{ selectedTransaction?.system_bank_details?.account_number }}</span>
          </div>
          <div class="q-mb-sm">
            <span class="text-grey-7">IBAN: </span>
            <span>{{ selectedTransaction?.system_bank_details?.iban }}</span>
          </div>
          <div class="q-mb-sm" v-if="selectedTransaction?.transaction_reference">
            <span class="text-grey-7">Transaction Reference: </span>
            <span>{{ selectedTransaction?.transaction_reference }}</span>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Close" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Add Balance Banks Dialog -->
    <q-dialog v-model="showBanksDialog" persistent>
      <q-card class="q-pa-md" style="max-width: 420px; width: 100%; border-radius: 30px">
        <q-card-section>
          <div class="text-h6 text-weight-bold q-mb-md">Available Banks</div>
          <q-list>
            <q-item
              v-for="bank in banks"
              :key="bank.id"
              class="bank-item q-mb-sm"
              clickable
              @click="selectBank(bank)"
            >
              <q-item-section avatar>
                <div v-if="bank.bank_name === 'CIB'" class="bank-logo-square">
                  <img src="/CIB Logo.png" alt="CIB Logo" />
                </div>
                <div v-else-if="bank.bank_name === 'HSBC'" class="bank-logo-square">
                  <img src="/HSBC Logo.png" alt="HSBC Logo" />
                </div>
                <div v-else class="bank-logo-square">
                  <q-icon name="account_balance" size="32px" />
                </div>
              </q-item-section>
              <q-item-section>
                <div class="text-weight-bold">{{ bank.bank_name }}</div>
                <div class="text-caption text-grey-7">
                  Account Holder: {{ bank.account_holder }}
                </div>
                <div class="text-caption text-grey-7">Account #: {{ bank.account_number }}</div>
                <div class="text-caption text-grey-7">IBAN: {{ bank.iban }}</div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Close" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Deposit Form Dialog -->
    <q-dialog v-model="showDepositFormDialog" persistent>
      <q-card class="q-pa-md" style="max-width: 420px; width: 100%; border-radius: 30px">
        <q-card-section>
          <div class="text-h6 text-weight-bold q-mb-md">Deposit Details</div>
          <div class="q-mb-md">
            <div class="text-caption text-grey-7 q-mb-xs">Deposit to:</div>
            <div class="row items-center">
              <div v-if="selectedBank?.bank_name === 'CIB'" class="bank-logo-square q-mr-sm">
                <img src="/CIB Logo.png" alt="CIB Logo" />
              </div>
              <div v-else-if="selectedBank?.bank_name === 'HSBC'" class="bank-logo-square q-mr-sm">
                <img src="/HSBC Logo.png" alt="HSBC Logo" />
              </div>
              <div v-else class="bank-logo-square q-mr-sm">
                <q-icon name="account_balance" size="32px" />
              </div>
              <div>
                <div class="text-weight-bold">{{ selectedBank?.bank_name }}</div>
                <div class="text-caption text-grey-7">
                  Account Holder: {{ selectedBank?.account_holder }}
                </div>
                <div class="text-caption text-grey-7">
                  Account #: {{ selectedBank?.account_number }}
                </div>
                <div class="text-caption text-grey-7">IBAN: {{ selectedBank?.iban }}</div>
              </div>
            </div>
          </div>
          <q-input
            v-model="depositForm.amount"
            label="Amount"
            type="number"
            min="1"
            class="q-mb-md"
          />
          <q-input
            v-model="depositForm.sender_bank_name"
            label="Sender Bank Name"
            class="q-mb-md"
          />
          <q-input
            v-model="depositForm.transaction_reference"
            label="Transaction Reference (optional)"
            class="q-mb-md"
          />
          <div class="q-mb-md">
            <div class="text-caption text-grey-7 q-mb-xs">Upload Screenshot</div>
            <div :class="['uploader-border', { 'uploader-error': showUploaderError }]">
              <label class="custom-uploader-label">
                <q-icon name="cloud_upload" color="primary" size="32px" class="q-mr-sm" />
                <span class="custom-uploader-text">
                  <span v-if="!depositForm.proof_image">Click or drag image here</span>
                  <span v-else class="text-positive">Image selected</span>
                </span>
                <input
                  type="file"
                  accept="image/*"
                  class="custom-uploader-input"
                  @change="onCustomFileChange"
                />
              </label>
            </div>
            <div v-if="depositForm.proof_image_url" class="q-mt-sm">
              <img
                :src="depositForm.proof_image_url"
                alt="Screenshot"
                class="uploaded-image-preview"
              />
            </div>
            <div v-if="showUploaderError" class="text-negative text-caption q-mt-xs">
              Please upload a screenshot.
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="grey-7" @click="closeDepositForm" rounded />
          <q-btn
            unelevated
            color="amber-7"
            label="Submit"
            @click="submitDeposit"
            :loading="depositSubmitting"
            rounded
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- All Transactions Dialog -->
    <q-dialog v-model="showAllTransactions" persistent>
      <q-card style="max-width: 600px; width: 100%; border-radius: 24px">
        <q-card-section>
          <div class="row items-center justify-between q-mb-md">
            <div class="text-h6 text-weight-bold">All Transactions</div>
            <q-btn flat round dense icon="close" @click="showAllTransactions = false" />
          </div>
          <q-list separator>
            <q-item
              v-for="tx in depositTransactions"
              :key="tx.id"
              class="transaction-item q-mb-md"
              clickable
              @click="openTransaction(tx)"
            >
              <q-item-section avatar>
                <q-avatar size="48px">
                  <img :src="tx.proof_image" alt="Proof" />
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-bold text-body2">
                  Deposit - {{ tx.system_bank_details?.bank_name || 'Bank' }}
                </q-item-label>
                <q-item-label caption>
                  <span class="text-grey-7">From:</span> {{ tx.sender_bank_name }}
                  <span class="q-ml-md text-grey-7">To:</span>
                  {{ tx.system_bank_details?.account_holder }}
                </q-item-label>
                <q-item-label caption>
                  <span class="text-grey-7">Date:</span> {{ formatDate(tx.created_at) }}
                </q-item-label>
              </q-item-section>
              <q-item-section side top>
                <div class="text-body1 text-weight-bold text-right">
                  {{ Number(tx.amount).toLocaleString() }} EGP
                </div>
                <q-badge :color="getStatusColor(tx.status)" class="q-mt-xs q-badge-align-right">
                  {{ tx.status.charAt(0) + tx.status.slice(1).toLowerCase() }}
                </q-badge>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- KEYPAD PIN DIALOG (For Show Balance) -->
    <q-dialog v-model="showPinDialog" persistent position="bottom">
      <q-card
        class="q-pa-md column items-center"
        style="border-radius: 20px 20px 0 0; padding-bottom: 30px"
      >
        <div class="text-h6 text-weight-bold q-mb-sm">Enter PIN</div>
        <div class="text-caption text-grey-7 q-mb-lg">Enter 6-digit PIN to show balance</div>

        <!-- Dots -->
        <div class="dots-wrapper q-mb-lg">
          <div
            v-for="n in 6"
            :key="n"
            class="dot"
            :class="{
              'dot-active': n <= pinArray.length,
              'dot-error': errorShake,
            }"
          >
            <div v-if="n <= pinArray.length" class="dot-inner" />
          </div>
        </div>

        <!-- Error Message Placeholder -->
        <div style="height: 20px" class="q-mb-md text-center">
          <transition name="fade">
            <div v-if="errorShake" class="text-negative text-caption text-weight-bold">
              Invalid PIN
            </div>
          </transition>
        </div>

        <!-- Keypad -->
        <div class="keypad-grid q-mb-md">
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

        <q-btn
          flat
          label="Cancel"
          color="grey-7"
          rounded
          class="full-width"
          @click="closePinDialog"
        />
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useNotificationsStore } from 'src/stores/notifications-store'
import { useWalletStore } from 'src/stores/wallet-store'
import { useUsersStore } from 'src/stores/users-store'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'

const $q = useQuasar()
const notificationsStore = useNotificationsStore()
const walletStore = useWalletStore()
const usersStore = useUsersStore()

// Reactive data
const currentCard = ref('gold')
const touchStartX = ref(0)
const touchStartY = ref(0)
const balanceVisible = ref(false) // Default hidden for security
const unreadCount = ref(0)
const depositTransactions = ref([])
const showTransactionDialog = ref(false)
const selectedTransaction = ref(null)
const showBanksDialog = ref(false)
const banks = ref([])
const showDepositFormDialog = ref(false)
const selectedBank = ref(null)
const depositForm = ref({
  amount: '',
  sender_bank_name: '',
  transaction_reference: '',
  proof_image: null,
  proof_image_url: '',
})
const depositSubmitting = ref(false)
const showUploaderError = ref(false)
const showAllTransactions = ref(false)

// --- PIN Keypad Logic ---
const showPinDialog = ref(false)
const pinArray = ref([])
const errorShake = ref(false)

const keys = [
  ...Array.from({ length: 9 }, (_, i) => ({ type: 'digit', value: String(i + 1) })),
  { type: 'empty' },
  { type: 'digit', value: '0' },
  { type: 'backspace' },
]

// Computed balance for display
const formattedBalance = computed(() => {
  const val = usersStore.currentUser?.wallet_balance
  return val ? Number(val).toLocaleString() : '0'
})

// Lifecycle
onMounted(async () => {
  await Promise.all([
    notificationsStore.fetchUnreadCount(),
    usersStore.fetchCurrentUser(), // Fetch latest balance from backend
  ])
  unreadCount.value = notificationsStore.unreadCount

  // Fetch deposit transactions
  try {
    const data = await walletStore.fetchDeposits()
    if (data && Array.isArray(data.results)) {
      depositTransactions.value = data.results
    } else if (walletStore.deposits && Array.isArray(walletStore.deposits.results)) {
      depositTransactions.value = walletStore.deposits.results
    }
  } catch {
    depositTransactions.value = []
  }
})

// Methods
function toggleBalance() {
  if (balanceVisible.value) {
    // If visible, just hide it
    balanceVisible.value = false
  } else {
    // If hidden, require PIN first
    pinArray.value = []
    errorShake.value = false
    showPinDialog.value = true
  }
}

function closePinDialog() {
  showPinDialog.value = false
  pinArray.value = []
  errorShake.value = false
}

// Watch pin entry
watch(
  pinArray,
  (val) => {
    if (val.length === 6) {
      verifyPin()
    }
  },
  { deep: true },
)

function onKeyClick(key) {
  if (errorShake.value) return // Block input during error animation

  if (key.type === 'digit' && pinArray.value.length < 6) {
    if (navigator.vibrate) navigator.vibrate(10)
    pinArray.value.push(key.value)
  } else if (key.type === 'backspace') {
    pinArray.value.pop()
  }
}

async function verifyPin() {
  $q.loading.show({ message: 'Verifying...' })
  try {
    const enteredPin = pinArray.value.join('')
    // Verify PIN with backend (reusing the secure endpoint logic)
    await api.post('/api/wallet/my-balance/', { pin: enteredPin })

    // Success
    balanceVisible.value = true
    showPinDialog.value = false
    $q.notify({ type: 'positive', message: 'Balance unlocked', position: 'top' })
  } catch (error) {
    // Error Handling
    errorShake.value = true
    if (navigator.vibrate) navigator.vibrate([50, 50, 50])
    setTimeout(() => {
      errorShake.value = false
      pinArray.value = [] // Clear pin to retry
    }, 800)
  } finally {
    $q.loading.hide()
  }
}

async function addBalance() {
  try {
    const data = await walletStore.fetchBanks()
    if (data && Array.isArray(data.results)) {
      banks.value = data.results
    } else if (walletStore.banks && Array.isArray(walletStore.banks.results)) {
      banks.value = walletStore.banks.results
    }
    showBanksDialog.value = true
  } catch {
    banks.value = []
    showBanksDialog.value = true
  }
}

function withdraw() {
  console.log('Withdraw clicked')
}

function switchCard() {
  currentCard.value = currentCard.value === 'gold' ? 'bronze' : 'gold'
}

// Touch events for mobile swipe
function handleTouchStart(event) {
  touchStartX.value = event.touches[0].clientX
  touchStartY.value = event.touches[0].clientY
}

function handleTouchEnd(event) {
  const touchEndX = event.changedTouches[0].clientX
  const touchEndY = event.changedTouches[0].clientY
  const deltaX = touchEndX - touchStartX.value
  const deltaY = touchEndY - touchStartY.value

  // Check if horizontal swipe (not vertical scroll)
  if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
    event.preventDefault()
    switchCard()
  }
}

// Mouse events for desktop drag
function handleMouseDown(event) {
  touchStartX.value = event.clientX
  touchStartY.value = event.clientY
}

function handleMouseUp(event) {
  const mouseEndX = event.clientX
  const mouseEndY = event.clientY
  const deltaX = mouseEndX - touchStartX.value
  const deltaY = mouseEndY - touchStartY.value

  // Check if horizontal drag (not just click)
  if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 30) {
    event.preventDefault()
    switchCard()
  }
}

function openTransaction(tx) {
  selectedTransaction.value = tx
  showTransactionDialog.value = true
}

function selectBank(bank) {
  selectedBank.value = bank
  showBanksDialog.value = false
  showDepositFormDialog.value = true
  depositForm.value = {
    amount: '',
    sender_bank_name: '',
    transaction_reference: '',
    proof_image: null,
    proof_image_url: '',
  }
}

function closeDepositForm() {
  showDepositFormDialog.value = false
  selectedBank.value = null
  depositForm.value = {
    amount: '',
    sender_bank_name: '',
    transaction_reference: '',
    proof_image: null,
    proof_image_url: '',
  }
}

function onCustomFileChange(event) {
  const files = event.target.files
  if (files && files.length > 0) {
    depositForm.value.proof_image = files[0]
    const reader = new FileReader()
    reader.onload = (e) => {
      depositForm.value.proof_image_url = e.target.result
    }
    reader.readAsDataURL(files[0])
  }
}

async function submitDeposit() {
  showUploaderError.value = false
  if (
    !depositForm.value.amount ||
    !depositForm.value.sender_bank_name ||
    !depositForm.value.proof_image
  ) {
    if (!depositForm.value.proof_image) {
      showUploaderError.value = true
    }
    return
  }
  depositSubmitting.value = true
  try {
    const formData = new FormData()
    formData.append('amount', depositForm.value.amount)
    formData.append('system_bank_id', selectedBank.value.id)
    formData.append(
      'system_bank_details',
      JSON.stringify({
        bank_name: selectedBank.value.bank_name,
        account_number: selectedBank.value.account_number,
        account_holder: selectedBank.value.account_holder,
        iban: selectedBank.value.iban,
        is_active: selectedBank.value.is_active,
        is_company_bank: selectedBank.value.is_company_bank,
      }),
    )
    formData.append('sender_bank_name', depositForm.value.sender_bank_name)
    if (depositForm.value.transaction_reference) {
      formData.append('transaction_reference', depositForm.value.transaction_reference)
    }
    formData.append('proof_image', depositForm.value.proof_image)

    const { api } = await import('boot/axios')
    await api.post('/api/wallet/deposit/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    const data = await walletStore.fetchDeposits()
    if (data && Array.isArray(data.results)) {
      depositTransactions.value = data.results
    } else if (walletStore.deposits && Array.isArray(walletStore.deposits.results)) {
      depositTransactions.value = walletStore.deposits.results
    }

    showDepositFormDialog.value = false
    selectedBank.value = null
    depositForm.value = {
      amount: '',
      sender_bank_name: '',
      transaction_reference: '',
      proof_image: null,
      proof_image_url: '',
    }
  } catch {
    // Error handled
  } finally {
    depositSubmitting.value = false
  }
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const day = String(date.getDate()).padStart(2, '0')
  const month = date.toLocaleString('en-US', { month: 'short' })
  const year = date.getFullYear()
  let hours = date.getHours()
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12
  hours = hours ? hours : 12
  return `${day} ${month} ${year} - ${String(hours).padStart(2, '0')}:${minutes} ${ampm}`
}

function getStatusColor(status) {
  if (status === 'APPROVED') return 'positive'
  if (status === 'PENDING') return 'warning'
  if (status === 'REJECTED') return 'negative'
  return 'grey'
}
</script>

<style scoped>
.cards-container {
  position: relative;
  height: 250px;
  cursor: pointer;
}

.wallet-card-gold {
  background: linear-gradient(135deg, #f1c40f 0%, #f39c12 100%);
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(241, 196, 15, 0.3);
}

.wallet-card-bronze {
  background: linear-gradient(135deg, #917244 0%, #917244 100%);
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(139, 69, 19, 0.3);
}

.background-card {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
  transform: translateY(15px) scale(0.95);
  transition: all 0.3s ease;
}

.foreground-card {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2;
  transition: all 0.3s ease;
}

.card-hidden {
  transform: translateY(0) scale(1);
  z-index: 1;
}

.foreground-card.card-hidden {
  transform: translateY(15px) scale(0.95);
  z-index: 1;
}

.background-card.card-hidden {
  transform: translateY(0) scale(1);
  z-index: 2;
}

.wallet-logo {
  font-family: 'Cairo', sans-serif;
}

.empty-placeholder {
  width: 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 20px;
}

.indicator-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #e0e0e0;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.indicator-dot.active-gold {
  background: linear-gradient(135deg, #f1c40f 0%, #f39c12 100%);
  transform: scale(1.2);
}

.indicator-dot.active-bronze {
  background: linear-gradient(135deg, #917244 0%, #a0522d 100%);
  transform: scale(1.2);
}

.bckgnd {
  background-image: url('/serganyLogo.png');
}

.sergany-logo {
  width: 300px;
  height: 250px;
  margin-bottom: 10px;
  position: absolute;
  top: 0;
  right: 0;
  opacity: 0.4;
}

.transaction-item {
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  padding: 10px 15px;
}

.body--dark .transaction-item {
  background: #232323 !important;
}

/* Preserve wallet card colors in dark mode */
.body--dark .wallet-card-gold {
  background: linear-gradient(135deg, #f1c40f 0%, #f39c12 100%) !important;
}

.body--dark .wallet-card-bronze {
  background: linear-gradient(135deg, #917244 0%, #917244 100%) !important;
}

/* Dark mode empty placeholder */
.body--dark .empty-placeholder {
  background: #2d2d2d !important;
}

.bank-item {
  border-radius: 8px;
  background: #f9f9f9;
  padding: 12px 10px;
  margin-bottom: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
}

.body--dark .bank-item {
  background: #232323 !important;
}

.bank-logo-square {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bank-logo-square img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.uploader-border {
  border: 1.5px solid #e0e0e0;
  border-radius: 8px;
  padding: 0;
  transition: border-color 0.2s;
  background: #fafbfc;
  min-height: 56px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.uploader-error {
  border-color: #e53935 !important;
}

.custom-uploader-label {
  display: flex;
  align-items: center;
  width: 100%;
  cursor: pointer;
  padding: 12px 16px;
  min-height: 56px;
  transition: background 0.2s;
}

.custom-uploader-label:hover {
  background: #f5f5f5;
}

.custom-uploader-input {
  display: none;
}

.custom-uploader-text {
  font-size: 15px;
  color: #666;
}

.uploaded-image-preview {
  max-width: 120px;
  max-height: 120px;
  border-radius: 8px;
  margin-top: 6px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.q-badge-align-right {
  float: right;
}

/* Keypad Styles */
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

.keypad-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  width: 100%;
  max-width: 320px;
  margin: 0 auto;
}
.keypad-btn {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  font-size: 24px;
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
