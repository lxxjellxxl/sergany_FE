<template>
  <q-page class="bg-brand">
    <!-- Header Section -->
    <div class="header-section bg-gold q-pa-md">
      <div class="row items-center justify-between q-mb-lg">
        <q-btn flat round icon="arrow_back" color="white" @click="goBack" />
        <div class="text-h5 text-weight-bold text-white">Refer, Earn, Redeem!</div>
        <div style="width: 40px"></div>
        <!-- Spacer -->
      </div>

      <div class="text-center q-mt-lg">
        <div class="text-subtitle2 text-white q-mb-xs">Total Points</div>
        <div class="text-h1 text-weight-bold text-white q-mb-lg">{{ totalPoints }}</div>
        <!-- Optional: Show monetary value if you have a conversion rate -->
        <div class="text-subtitle2 text-white">Accumulated Rewards</div>
      </div>

      <q-card flat class="rounded-borders q-mb-md redeem-card">
        <q-item clickable v-ripple class="q-py-md" @click="goToRedeemPoints">
          <q-item-section avatar>
            <q-avatar size="40px" class="bg-grey-3">
              <q-icon name="card_giftcard" color="grey-7" />
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-medium">Redeem points</q-item-label>
            <q-item-label caption>Convert points to wallet balance</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="chevron_right" color="grey-5" />
          </q-item-section>
        </q-item>
      </q-card>
    </div>

    <!-- Content -->
    <div class="q-pa-md">
      <!-- Main Content Card -->
      <q-card flat class="rounded-borders q-pa-lg q-mb-lg q-mt-xl">
        <div class="text-body1 q-mb-lg">
          You're ready! Share this code and earn points when friends make their first purchase.
        </div>

        <!-- Referral Code Section -->
        <div class="q-mb-lg">
          <div class="text-caption text-grey-6 q-mb-sm">Your referral code</div>
          <div
            class="referral-code-container bg-grey-2 q-pa-md rounded-borders row items-center justify-between"
          >
            <div class="text-h6 text-grey-8 text-weight-bold">{{ referralCode }}</div>
            <div>
              <q-btn flat round icon="content_copy" color="grey-7" @click="copyCode" />
              <q-btn flat round icon="share" color="grey-7" @click="shareLink" />
            </div>
          </div>
        </div>

        <!-- Stats Section (Placeholder until backend supports specific counts) -->
        <div class="row q-col-gutter-md q-mb-md">
          <div class="col-6">
            <q-card flat class="bg-grey-2 q-pa-md text-center rounded-small-borders">
              <div class="text-caption text-grey-6 q-mb-xs">Status</div>
              <div class="text-weight-bold text-amber-8">Active</div>
            </q-card>
          </div>
          <div class="col-6">
            <q-card flat class="bg-grey-2 q-pa-md text-center rounded-small-borders">
              <div class="text-caption text-grey-6 q-mb-xs">Points Value</div>
              <div class="text-weight-bold text-amber-8">Coming Soon</div>
            </q-card>
          </div>
        </div>
      </q-card>

      <!-- How It Works -->
      <q-card flat class="rounded-borders q-pa-lg">
        <div class="text-subtitle1 text-weight-medium text-grey-6 q-mb-md">HOW IT WORKS</div>

        <!-- Step 1 -->
        <div class="row q-mb-md">
          <div class="col-auto q-pr-md">
            <q-avatar size="24px" class="bg-gold text-white text-weight-bold">1</q-avatar>
          </div>
          <div class="col">
            <div class="text-weight-medium q-mb-xs text-brand">Share Your Code</div>
            <div class="text-body2 text-grey-7">
              Send your unique referral code to friends via your favorite messaging apps or social
              media platforms.
            </div>
          </div>
        </div>

        <!-- Step 2 -->
        <div class="row">
          <div class="col-auto q-pr-md">
            <q-avatar size="24px" class="bg-gold text-white text-weight-bold">2</q-avatar>
          </div>
          <div class="col">
            <div class="text-weight-medium q-mb-xs text-brand">Friends Make a Purchase</div>
            <div class="text-body2 text-grey-7">
              When your friends use your code and make their first purchase, you earn points
              automatically.
            </div>
          </div>
        </div>
      </q-card>
    </div>

    <!-- Insufficient Points Dialog -->
    <q-dialog
      v-model="showInsufficientPointsDialog"
      position="bottom"
      class="insufficient-points-dialog"
    >
      <q-card class="dialog-card q-pa-lg">
        <div class="text-center">
          <div class="warning-icon-container q-mb-md">
            <q-avatar size="60px" class="bg-orange-2">
              <q-icon name="warning" color="orange-8" size="30px" />
            </q-avatar>
          </div>

          <div class="text-h6 text-weight-bold q-mb-sm">Insufficient Points</div>

          <div class="text-body2 text-grey-7 q-mb-lg">
            You don't have enough points to redeem a voucher right now. Keep earning points through
            referrals!
          </div>

          <q-btn
            unelevated
            color="amber-6"
            rounded
            label="Dismiss"
            class="full-width q-py-sm"
            @click="showInsufficientPointsDialog = false"
          />
        </div>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useUsersStore } from 'src/stores/users-store'

const router = useRouter()
const $q = useQuasar()
const usersStore = useUsersStore()

// State
const showInsufficientPointsDialog = ref(false)

// Computed Data from Store
const referralCode = computed(() => usersStore.currentUser?.referral_code || '---')
const totalPoints = computed(() => usersStore.currentUser?.points_balance || 0)

// Lifecycle
onMounted(async () => {
  // Ensure we have latest user data
  if (!usersStore.currentUser) {
    await usersStore.fetchCurrentUser()
  }
})

// Methods
const goBack = () => {
  router.go(-1)
}

const goToRedeemPoints = () => {
  if (totalPoints.value < 100) {
    // Assume 100 is min for now
    showInsufficientPointsDialog.value = true
  } else {
    $q.notify({
      message: 'Redemption feature coming soon!',
      color: 'info',
      position: 'top',
    })
  }
}

const copyCode = () => {
  if (!referralCode.value) return

  navigator.clipboard
    .writeText(referralCode.value)
    .then(() => {
      $q.notify({
        message: 'Referral code copied!',
        color: 'positive',
        position: 'top',
        timeout: 1000,
      })
    })
    .catch(() => {
      $q.notify({
        message: 'Failed to copy',
        color: 'negative',
        position: 'top',
      })
    })
}

const shareLink = () => {
  const url = `${window.location.origin}/register?ref=${referralCode.value}`

  if (navigator.share) {
    navigator
      .share({
        title: 'Join Sergany',
        text: `Use my referral code ${referralCode.value} to join Sergany!`,
        url: url,
      })
      .catch(console.error)
  } else {
    // Fallback: Copy URL
    navigator.clipboard.writeText(url)
    $q.notify({
      message: 'Referral link copied!',
      color: 'positive',
      position: 'top',
    })
  }
}
</script>

<style scoped>
.header-section {
  width: 98%;
  margin: auto;
  border-bottom-left-radius: 30px;
  border-bottom-right-radius: 30px;
  padding-bottom: 80px; /* Space for the floating card */
}

.redeem-card {
  margin-top: -40px; /* Pull up to overlap header */
  margin-left: 16px;
  margin-right: 16px;
  background: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.rounded-borders {
  border-radius: 12px;
}

.rounded-small-borders {
  border-radius: 8px;
}

.referral-code-container {
  border: 1px dashed #bdbdbd;
}

.text-gold {
  color: #fdc82a;
}
.bg-gold {
  background: #fdc82a;
}

/* Dark Mode Support */
.body--dark .bg-grey-2 {
  background-color: #2d2d2d !important;
}
.body--dark .redeem-card {
  background-color: #1e1e1e !important;
}
.body--dark .text-grey-6 {
  color: #aaa !important;
}
.body--dark .text-grey-8 {
  color: #fff !important;
}
</style>
