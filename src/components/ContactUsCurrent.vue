<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="tab-content">
    <!-- Show illustration and help text only if there are no complaints -->
    <template v-if="openTickets.length === 0">
      <!-- Mail Icon -->
      <div class="text-center">
        <div class="mail-icon-container bg-gold">
          <q-icon name="mail" size="40px" color="white" />
        </div>
      </div>

      <!-- Illustration -->
      <div class="text-center">
        <div class="illustration-container">
          <!-- Person with letter -->
          <div class="person-container">
            <div class="person-head"></div>
            <div class="person-body"></div>
          </div>
        </div>
      </div>

      <!-- Content Text -->
      <div class="text-center q-mb-xl">
        <div class="text-h6 text-weight-medium q-mb-sm">Need help?</div>
        <div class="text-body2 text-grey-6 content-text">
          Send us a ticket and we will get back to you as soon
          as possible. We are here to assist you!
        </div>
      </div>
    </template>

    <!-- Complaints List -->
    <div v-else>
      <div class="text-h6 text-weight-bold q-mb-md">Your Complaints</div>
      <q-list bordered class="complaints-list">
        <q-item v-for="ticket in openTickets" :key="ticket.id" class="complaint-item">
          <q-item-section>
            <q-item-label class="complaint-title">{{ ticket.subject }}</q-item-label>
            <q-item-label caption class="complaint-message">{{ ticket.description }}</q-item-label>
            <q-item-label caption class="complaint-status">
              Status:
              <span :class="{
                'status-inprogress': ticket.status !== 'CLOSED'
              }">
                {{ticket.status.replace('_', ' ').toLowerCase().replace(/(^|\s)\S/g, l => l.toUpperCase())}}
              </span>
              <span class="complaint-date">{{ formatDate(ticket.created_at) }}</span>
            </q-item-label>
            <q-item-label v-if="ticket.admin_response" caption class="admin-response">
              <span class="text-grey-7">Admin Response:</span> {{ ticket.admin_response }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
      <!-- REMOVE PAGINATION CONTROLS -->
      <!-- <div class="q-mt-lg flex flex-center">
        <q-pagination v-model="currentPage" :max="totalPages" color="amber-6" size="md"
          @update:model-value="onPageChange" />
      </div> -->
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useSupportStore } from 'src/stores/support-store'
import { useUsersStore } from 'src/stores/users-store'


const tickets = ref([])
const supportStore = useSupportStore()
const userStore = useUsersStore()
const supportData = ref(null)

const loading = ref(false)
const userId = ref(null)
const user = ref(null)

const fetchTickets = async () => {
  loading.value = true
  try {
    await supportStore.fetchUserSupportTickets(userStore.$state.currentUser.id)
    supportData.value = supportStore.mySupportTickets
  } catch {
    console.log('Error fetching support tickets')
    tickets.value = []
  } finally {
    loading.value = false
  }
}

const openTickets = computed(() =>
  supportData.value ? supportData.value.filter(t => t.status !== 'CLOSED') : []
)
/*
const closedTickets = computed(() =>
  supportData.value ? supportData.value.filter(t => t.status === 'CLOSED') : []
)
*/

onMounted(async () => {
  user.value = await userStore.getCurrentUser
  console.log('Current User:', user.value)
  userId.value = user.value?.id
  fetchTickets()
  console.log('Support Data:', supportData.value)
})

function formatDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleString()
}
</script>

<style scoped>
/* Mail Icon Container */
.mail-icon-container {
  position: relative;
  width: 80px;
  height: 60px;
  background: linear-gradient(135deg, #FDC82A 0%, #F4B942 100%);
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  margin-bottom: 40px;
}

/* Illustration Container */
.illustration-container {
  position: relative;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 40px 0;
}

.person-container {
  position: relative;
  z-index: 2;
}

.person-head {
  width: 50px;
  height: 50px;
  background: #F4C2A1;
  border-radius: 50%;
  margin: 0 auto 10px;
  position: relative;
}

.person-head::after {
  content: '';
  position: absolute;
  top: 15px;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 20px;
  background: #8B4513;
  border-radius: 15px 15px 0 0;
}

.person-body {
  width: 80px;
  height: 100px;
  background: #8B4513;
  border-radius: 10px;
  margin: 0 auto;
  position: relative;
}

.person-body::before {
  content: '';
  position: absolute;
  top: 15px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 20px;
  background: white;
  border-radius: 10px;
}

.person-body::after {
  content: '';
  position: absolute;
  top: 70px;
  left: -15px;
  width: 25px;
  height: 18px;
  background: #FDC82A;
  border-radius: 2px;
}

/* Content Text */
.content-text {
  line-height: 1.5;
  max-width: 300px;
  margin: 0 auto;
}

/* Gold background utility */
.bg-gold {
  background-color: #FDC82A !important;
}

/* Complaints List */
.complaints-list {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  margin-bottom: 2rem;
}

.complaint-item {
  border-bottom: 1px solid #eee;
}

.complaint-title {
  font-weight: bold;
  font-size: 1.1em;
}

.complaint-message {
  color: #666;
  margin-top: 2px;
}

.complaint-status {
  margin-top: 4px;
  font-size: 0.95em;
}

.status-open {
  color: #FDC82A;
  font-weight: bold;
}

.status-inprogress {
  color: #FFA726;
  font-weight: bold;
}

.complaint-date {
  float: right;
  color: #aaa;
  font-size: 0.9em;
}

.admin-response {
  margin-top: 4px;
  color: #388E3C;
  font-size: 0.97em;
}
.status-closed {
  color: #4CAF50;
  font-weight: bold;
}
</style>
