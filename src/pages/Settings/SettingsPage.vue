<template>
  <q-page class="q-pa-md bg-brand">
    <!-- User Profile Section -->
    <div class="text-center q-mb-xl">
      <div class="text-h5 text-weight-bold">{{ firstName }} {{ lastName }}</div>
    </div>

    <!-- Login Button (Only if needed, usually hidden for logged in users) -->
    <!-- Keeping it as per your provided code -->

    <!-- Account Section -->
    <div class="q-mb-lg">
      <div class="text-caption text-grey-6 text-weight-medium q-mb-md">ACCOUNT</div>

      <!-- Account Info -->
      <q-card class="settings-item q-mb-sm rounded-small-borders" @click="goToAccountInfo">
        <q-item clickable v-ripple class="q-py-lg">
          <q-item-section avatar>
            <q-icon name="person" color="grey-7" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-medium text-body1">Account Info</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="chevron_right" color="amber-6" />
          </q-item-section>
        </q-item>
      </q-card>

      <!-- Identity Verification (Disabled if Verified) -->
      <q-card
        class="settings-item q-mb-sm rounded-small-borders"
        :class="{ 'disabled-card': isKycVerified }"
        @click="!isKycVerified ? goToIdentityVerification() : null"
      >
        <q-item clickable v-ripple :disable="isKycVerified" class="q-py-lg">
          <q-item-section avatar>
            <q-icon name="verified_user" :color="isKycVerified ? 'positive' : 'grey-7'" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-medium text-body1">
              Identity verification
              <span
                v-if="isKycVerified"
                class="text-positive text-caption q-ml-sm text-weight-bold"
              >
                (Verified)
              </span>
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon
              :name="isKycVerified ? 'check_circle' : 'chevron_right'"
              :color="isKycVerified ? 'positive' : 'amber-6'"
            />
          </q-item-section>
        </q-item>
      </q-card>

      <!-- Metal Transactions -->
      <q-card class="settings-item q-mb-sm rounded-small-borders" @click="goToMetalTransactions">
        <q-item clickable v-ripple class="q-py-lg">
          <q-item-section avatar>
            <q-icon name="bar_chart" color="grey-7" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-medium text-body1">Metal Transactions</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="chevron_right" color="amber-6" />
          </q-item-section>
        </q-item>
      </q-card>

      <!-- Refer & Earn -->
      <q-card class="settings-item q-mb-sm rounded-small-borders" @click="goToReferEarn">
        <q-item clickable v-ripple class="q-py-lg">
          <q-item-section avatar>
            <q-icon name="help_outline" color="grey-7" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-medium text-body1">Refer & Earn</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="chevron_right" color="amber-6" />
          </q-item-section>
        </q-item>
      </q-card>

      <!-- Vouchers -->
      <q-card class="settings-item q-mb-sm rounded-small-borders">
        <q-item clickable v-ripple class="q-py-lg">
          <q-item-section avatar>
            <q-icon name="confirmation_number" color="grey-7" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-medium text-body1">Vouchers</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="chevron_right" color="amber-6" />
          </q-item-section>
        </q-item>
      </q-card>
    </div>

    <!-- Security Section -->
    <div class="q-mb-lg">
      <div class="text-caption text-grey-6 text-weight-medium q-mb-md">SECURITY</div>

      <!-- Security & Privacy -->
      <q-card class="settings-item q-mb-sm rounded-small-borders" @click="goToSecurity">
        <q-item clickable v-ripple class="q-py-lg">
          <q-item-section avatar>
            <q-icon name="security" color="grey-7" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-medium text-body1">Security</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="chevron_right" color="amber-6" />
          </q-item-section>
        </q-item>
      </q-card>
    </div>

    <!-- Appearance Section -->
    <div class="q-mb-lg">
      <div class="text-caption text-grey-6 text-weight-medium q-mb-md">APPEARANCE</div>

      <!-- Language -->
      <q-card class="settings-item q-mb-sm rounded-small-borders" @click="goToLanguage">
        <q-item clickable v-ripple class="q-py-lg">
          <q-item-section avatar>
            <q-icon name="language" color="grey-7" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-medium text-body1">Language</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="chevron_right" color="amber-6" />
          </q-item-section>
        </q-item>
      </q-card>

      <!-- Theme -->
      <q-card class="settings-item q-mb-sm rounded-small-borders" @click="goToTheme">
        <q-item clickable v-ripple class="q-py-lg">
          <q-item-section avatar>
            <q-icon name="palette" color="grey-7" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-medium text-body1">Theme</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="chevron_right" color="amber-6" />
          </q-item-section>
        </q-item>
      </q-card>
    </div>

    <!-- Help Section -->
    <div class="q-mb-lg">
      <div class="text-caption text-grey-6 text-weight-medium q-mb-md">HELP</div>

      <!-- Contact us -->
      <q-card class="settings-item q-mb-sm rounded-small-borders" @click="goToContact">
        <q-item clickable v-ripple class="q-py-lg">
          <q-item-section avatar>
            <q-icon name="support_agent" color="grey-7" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-medium text-body1">Contact us</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="chevron_right" color="amber-6" />
          </q-item-section>
        </q-item>
      </q-card>

      <!-- FAQ -->
      <q-card class="settings-item q-mb-sm rounded-small-borders" @click="goToFAQ">
        <q-item clickable v-ripple class="q-py-lg">
          <q-item-section avatar>
            <q-icon name="help" color="grey-7" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-medium text-body1">FAQ</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="chevron_right" color="amber-6" />
          </q-item-section>
        </q-item>
      </q-card>
    </div>

    <!-- Logout Button -->
    <div class="q-mt-xl q-mb-lg">
      <q-btn
        label="Logout"
        icon="logout"
        color="amber-14"
        rounded
        outline
        class="full-width q-py-md text-weight-bold"
        :loading="loading"
        size="md"
        no-caps
        @click="handleLogout"
      />
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'src/stores/auth-store'
import { useUsersStore } from 'src/stores/users-store'
import { useNotificationsStore } from 'src/stores/notifications-store'

const router = useRouter()
const $q = useQuasar()
const authStore = useAuthStore()
const usersStore = useUsersStore()
const notificationsStore = useNotificationsStore()

// Reactive data
const firstName = ref('')
const lastName = ref('')
const loading = ref(false)
const user = ref(null)

const unreadCount = ref(0)

// Computed
const isKycVerified = computed(() => {
  return user.value?.is_kyc_verified === true
})

onMounted(async () => {
  user.value = usersStore.getCurrentUser
  try {
    unreadCount.value = await notificationsStore.fetchUnreadCount()
    user.value = await usersStore.fetchCurrentUser()
    firstName.value = user.value?.first_name || ''
    lastName.value = user.value?.last_name || ''
  } catch {
    // Handle error if needed
  }
})

// Methods
const goToAccountInfo = () => {
  router.push('/account-info')
}

const goToIdentityVerification = () => {
  if (isKycVerified.value) return // Block if verified

  if (!user.value) {
    router.push('/identity-verification')
    return
  }
  if (user.value.kyc_request_status === 'APPROVED') {
    router.push('/complete-verification')
  } else if (user.value.kyc_request_status === 'PENDING') {
    router.push('/pending-verification')
  } else if (user.value.kyc_request_status === 'REJECTED') {
    router.push('/rejected-verification')
  } else {
    router.push('/identity-verification')
  }
}

const goToReferEarn = () => {
  router.push({ path: '/refer-earn', query: { referralCode: user.value?.referral_code || '' } })
}

const goToLanguage = () => {
  router.push('/language')
}

function goToMetalTransactions() {
  router.push('/transactions')
}
function goToSecurity() {
  router.push('/security')
}

function goToTheme() {
  router.push('/theme')
}

function goToContact() {
  router.push('/contact-us')
}

function goToFAQ() {
  router.push('/faqs')
}

function goToLoginPage() {
  router.push('/login')
}

const handleLogout = async () => {
  loading.value = true

  try {
    $q.dialog({
      title: 'Logout',
      message: 'Are you sure you want to logout?',
      cancel: {
        label: 'Cancel',
        color: 'grey-7',
        flat: true,
        rounded: true,
        noCaps: true,
      },
      ok: {
        label: 'Logout',
        color: 'amber-6', // Matches theme
        unelevated: true,
        rounded: true,
        noCaps: true,
      },
      persistent: true,
    })
      .onOk(async () => {
        try {
          await authStore.logout()
          $q.notify({
            type: 'positive',
            message: 'Logged out successfully!',
            position: 'top',
            timeout: 2000,
          })
          router.push('/login')
        } catch (error) {
          console.error('Logout error:', error)
          $q.notify({
            type: 'negative',
            message: 'Logout failed. Please try again.',
            position: 'top',
            timeout: 3000,
          })
        } finally {
          loading.value = false
        }
      })
      .onCancel(() => {
        loading.value = false
      })
  } catch (error) {
    console.error('Dialog error:', error)
    loading.value = false
  }
}
</script>

<style scoped>
.settings-item {
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
  box-shadow: none !important;
}

.settings-item:hover {
  border-color: #fdc82a;
}

/* Disabled State for Verified Cards */
.disabled-card {
  opacity: 0.7;
  cursor: default !important;
  background-color: #f9f9f9;
}

.disabled-card:hover {
  border-color: transparent !important;
}
</style>
