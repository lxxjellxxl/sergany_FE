<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <q-page class="q-pa-md bg-brand">
    <!-- Header -->
    <div class="row items-center q-mb-lg">
      <q-btn flat round icon="arrow_back" color="grey-7" @click="goBack" />
      <div class="text-h5 text-weight-bold q-ml-sm">Notifications</div>
    </div>
    <!-- Notifications List -->
    <div
      v-if="
        (Array.isArray(notifications) && notifications.length > 0) ||
        (notifications.results && notifications.results.length > 0)
      "
      class="q-mb-lg"
    >
      <q-list bordered class="notification-list q-pa-sm">
        <q-item
          v-for="notif in notifications.results || notifications"
          :key="notif.id"
          clickable
          v-ripple
          @click="handleNotificationClick(notif)"
        >
          <q-item-section avatar>
            <q-avatar size="40px" class="bg-amber-3">
              <q-icon name="notifications" color="amber-8" />
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label :class="notif.is_read ? 'text-regular' : 'text-bold'">
              {{ notif.title || 'Notification' }}
            </q-item-label>
            <q-item-label caption>{{ notif.message }}</q-item-label>
            <q-item-label caption class="text-grey-6">{{
              formatDate(notif.created_at)
            }}</q-item-label>
          </q-item-section>
          <q-item-section side v-if="!notif.is_read">
            <q-badge color="amber-6" label="New" />
          </q-item-section>
        </q-item>
      </q-list>
      <!-- Pagination Controls -->
      <div class="q-mt-lg flex flex-center">
        <q-pagination
          v-model="currentPage"
          :max="totalPages"
          color="amber-6"
          size="md"
          @update:model-value="onPageChange"
        />
      </div>
    </div>

    <!-- Empty Notifications State -->
    <div v-else class="column items-center justify-center full-height">
      <!-- Bell Icon with Animation -->
      <div class="notification-icon-container q-mb-lg">
        <q-avatar size="60px" class="bg-amber-3">
          <q-icon name="notifications" color="amber-8" size="30px" />
        </q-avatar>
        <div class="sound-wave wave-1"></div>
        <div class="sound-wave wave-2"></div>
        <div class="sound-wave wave-3"></div>
      </div>

      <!-- Character Illustration -->
      <div class="character-illustration q-mb-lg">
        <div class="character-body">
          <div class="character-head">
            <div class="character-face"></div>
          </div>
          <div class="character-shirt"></div>
          <div class="character-arms">
            <div class="arm-left"></div>
            <div class="arm-right"></div>
          </div>
        </div>
        <div class="wheat-left"></div>
        <div class="wheat-right"></div>
      </div>

      <div class="text-h6 text-weight-bold q-mb-md text-center">First time here?</div>
      <div class="text-body2 text-grey-7 text-center" style="max-width: 300px; line-height: 1.5">
        This is where you'll see all your important notifications.
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted, watch } from 'vue'
import { useNotificationsStore } from 'src/stores/notifications-store'
const router = useRouter()

const notificationsStore = useNotificationsStore()
const notifications = ref({})
const unreadCount = ref(0)
const currentPage = ref(1)
const totalPages = ref(1)
const pageSize = 10

// Methods
const goBack = () => {
  router.go(-1)
}

const handleNotificationClick = async (notif) => {
  if (!notif.is_read) {
    await notificationsStore.markNotificationAsRead(notif.id)
    // Only update the clicked notification locally, avoid refetching all
    const notifList = notifications.value.results || []
    const idx = notifList.findIndex((n) => n.id === notif.id)
    if (idx !== -1) {
      notifList[idx].is_read = true
    }
  }
  // You can add navigation or dialog logic here if needed
}

const fetchPage = async (page = 1) => {
  try {
    const data = await notificationsStore.fetchNotifications({ page })
    notifications.value = data
    unreadCount.value = await notificationsStore.fetchUnreadCount()

    // If backend returns a raw array, totalPages should be 1
    if (Array.isArray(data)) {
      totalPages.value = 1
    } else {
      totalPages.value = Math.ceil((data.count || 0) / pageSize)
    }
  } catch (error) {
    console.error('Fetch error:', error)
  }
}

onMounted(() => {
  fetchPage(currentPage.value)
})

const onPageChange = (page) => {
  currentPage.value = page
}

watch(currentPage, (page) => {
  fetchPage(page)
})

function formatDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleString()
}
</script>

<style scoped>
.notification-list {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.text-bold {
  font-weight: bold;
}

.text-regular {
  font-weight: normal;
}

.full-height {
  min-height: calc(100vh - 140px);
  height: 100%;
  width: 100%;
}

.notification-icon-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Sound wave animations */
.sound-wave {
  position: absolute;
  border: 2px solid #f39c12;
  border-radius: 50%;
  animation: wave-pulse 2s infinite;
}

.wave-1 {
  width: 80px;
  height: 80px;
  animation-delay: 0s;
}

.wave-2 {
  width: 100px;
  height: 100px;
  animation-delay: 0.3s;
}

.wave-3 {
  width: 120px;
  height: 120px;
  animation-delay: 0.6s;
}

@keyframes wave-pulse {
  0% {
    opacity: 0.7;
    transform: scale(0.8);
  }

  50% {
    opacity: 0.3;
    transform: scale(1);
  }

  100% {
    opacity: 0;
    transform: scale(1.2);
  }
}

/* Character illustration */
.character-illustration {
  position: relative;
  width: 200px;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.character-body {
  position: relative;
  z-index: 2;
}

.character-head {
  width: 60px;
  height: 60px;
  background: #f4c2a1;
  border-radius: 50%;
  position: relative;
  margin: 0 auto 5px;
}

.character-face {
  width: 6px;
  height: 6px;
  background: #333;
  border-radius: 50%;
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  box-shadow:
    -12px 0 0 #333,
    12px 0 0 #333,
    0 15px 0 2px #333;
}

.character-shirt {
  width: 80px;
  height: 100px;
  background: #f39c12;
  border-radius: 20px 20px 10px 10px;
  margin: 0 auto;
  position: relative;
}

.character-shirt::before {
  content: '';
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 10px;
  height: 60px;
  background: #333;
  border-radius: 5px;
}

.character-arms {
  position: absolute;
  top: 70px;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 40px;
}

.arm-left,
.arm-right {
  width: 30px;
  height: 15px;
  background: #f4c2a1;
  border-radius: 15px;
  position: absolute;
  top: 0;
}

.arm-left {
  left: 0;
  transform: rotate(-20deg);
}

.arm-right {
  right: 0;
  transform: rotate(20deg);
}

/* Decorative wheat/leaves */
.wheat-left,
.wheat-right {
  position: absolute;
  width: 40px;
  height: 80px;
  background: #f39c12;
  border-radius: 20px 5px;
  top: 50%;
  transform: translateY(-50%);
}

.wheat-left {
  left: 20px;
  transform: translateY(-50%) rotate(-15deg);
}

.wheat-right {
  right: 20px;
  transform: translateY(-50%) rotate(15deg);
}

.wheat-left::before,
.wheat-right::before {
  content: '';
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 30px;
  background: #f39c12;
  border-radius: 10px;
}
</style>
