<template>
  <q-page class="q-pa-md bg-brand">
    <!-- Header -->
    <div class="row items-center justify-between q-mb-lg">
      <div class="row items-center">
        <q-btn flat round icon="arrow_back" color="grey-7" @click="goBack" />
        <div class="text-h5 text-weight-bold q-ml-sm">Account Info</div>
      </div>
      <!-- Edit Toggle -->
      <q-btn
        v-if="!isEditing"
        flat
        no-caps
        color="amber-6"
        label="Edit"
        class="text-weight-bold"
        @click="startEdit"
      />
      <q-btn v-else flat no-caps color="grey-6" label="Cancel" @click="cancelEdit" />
    </div>

    <!-- User Avatar -->
    <div class="text-center q-mb-xl">
      <q-avatar size="80px" class="bg-gold text-white shadow-2">
        <div v-if="firstName" class="text-h4 text-weight-bold">
          {{ firstName.charAt(0).toUpperCase() }}
        </div>
        <q-icon v-else name="person" size="40px" />
      </q-avatar>
      <div class="q-mt-sm text-grey-8 text-weight-medium">{{ email }}</div>
    </div>

    <!-- Form Fields -->
    <div class="q-gutter-y-md" style="max-width: 500px; margin: 0 auto">
      <!-- First Name -->
      <div>
        <div class="text-caption text-grey-7 q-mb-xs q-ml-xs text-weight-medium">First Name</div>
        <q-input
          v-model="firstName"
          rounded
          outlined
          dense
          :readonly="!isEditing"
          :bg-color="isEditing ? 'white' : 'grey-2'"
          class="account-input"
          hide-bottom-space
        />
      </div>

      <!-- Last Name -->
      <div>
        <div class="text-caption text-grey-7 q-mb-xs q-ml-xs text-weight-medium">Last Name</div>
        <q-input
          v-model="lastName"
          rounded
          outlined
          dense
          :readonly="!isEditing"
          :bg-color="isEditing ? 'white' : 'grey-2'"
          class="account-input"
          hide-bottom-space
        />
      </div>

      <!-- Email (Read Only) -->
      <div>
        <div class="text-caption text-grey-7 q-mb-xs q-ml-xs text-weight-medium">Email</div>
        <q-input
          v-model="email"
          rounded
          outlined
          dense
          readonly
          bg-color="grey-2"
          class="account-input"
          hide-bottom-space
        >
          <template v-slot:append>
            <q-icon name="lock" size="xs" color="grey-5" />
          </template>
        </q-input>
      </div>

      <!-- Phone Number (Read Only) -->
      <div>
        <div class="text-caption text-grey-7 q-mb-xs q-ml-xs text-weight-medium">Phone Number</div>
        <q-input
          v-model="phoneNumber"
          rounded
          outlined
          dense
          readonly
          bg-color="grey-2"
          class="account-input"
          hide-bottom-space
        >
          <template v-slot:append>
            <q-icon name="lock" size="xs" color="grey-5" />
          </template>
        </q-input>
      </div>

      <!-- Save Changes Button -->
      <transition name="scale">
        <div v-if="isEditing" class="text-center q-mt-xl">
          <q-btn
            unelevated
            color="gold"
            text-color="white"
            rounded
            label="Save Changes"
            class="full-width text-weight-bold"
            size="lg"
            :loading="loading"
            :disable="!hasChanges"
            @click="saveChanges"
          />
        </div>
      </transition>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useUsersStore } from 'src/stores/users-store'

const router = useRouter()
const $q = useQuasar()
const usersStore = useUsersStore()

// State
const isEditing = ref(false)
const loading = ref(false)

// Form Data
const firstName = ref('')
const lastName = ref('')
const email = ref('')
const phoneNumber = ref('')

// Original values snapshot (for cancel/compare)
const originalValues = ref({})

// --- LIFECYCLE ---
onMounted(async () => {
  await loadUserData()
})

const loadUserData = async () => {
  try {
    // Ensure we have the latest data from server
    const fetchedUser = await usersStore.fetchCurrentUser()

    // Populate form
    firstName.value = fetchedUser?.first_name || ''
    lastName.value = fetchedUser?.last_name || ''
    email.value = fetchedUser?.email || ''
    phoneNumber.value = fetchedUser?.phone || ''
  } catch (error) {
    console.error('Error fetching user profile:', error)
  }
}

// --- COMPUTED ---
const hasChanges = computed(() => {
  return (
    firstName.value !== originalValues.value.firstName ||
    lastName.value !== originalValues.value.lastName
  )
})

// --- ACTIONS ---

const goBack = () => {
  if (isEditing.value && hasChanges.value) {
    // Confirm if user wants to leave with unsaved changes
    $q.dialog({
      title: 'Discard Changes?',
      message: 'You have unsaved changes. Are you sure you want to leave?',
      cancel: true,
      persistent: true,
    }).onOk(() => {
      router.go(-1)
    })
  } else {
    router.go(-1)
  }
}

const startEdit = () => {
  // Snapshot current values
  originalValues.value = {
    firstName: firstName.value,
    lastName: lastName.value,
  }
  isEditing.value = true
}

const cancelEdit = () => {
  // Revert changes
  firstName.value = originalValues.value.firstName
  lastName.value = originalValues.value.lastName
  isEditing.value = false
}

const saveChanges = async () => {
  if (!firstName.value || !lastName.value) {
    $q.notify({ type: 'warning', message: 'First name and Last name are required.' })
    return
  }

  loading.value = true
  try {
    // Send update to API (Only send editable fields)
    // Note: Phone/Email updates usually require a different flow with OTP
    await usersStore.partialUpdateCurrentUser({
      first_name: firstName.value,
      last_name: lastName.value,
    })

    // Update snapshot
    originalValues.value = {
      firstName: firstName.value,
      lastName: lastName.value,
    }

    isEditing.value = false

    $q.notify({
      type: 'positive',
      message: 'Profile updated successfully!',
      position: 'top',
    })
  } catch (error) {
    console.error('Failed to update user:', error)
    $q.notify({
      type: 'negative',
      message: error.response?.data?.detail || 'Failed to update profile. Please try again.',
      position: 'top',
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.bg-gold {
  background-color: #fdc82a !important;
}
.text-gold {
  color: #fdc82a !important;
}

/* Input Styling */
.account-input :deep(.q-field__control) {
  border-radius: 12px !important;
}

.account-input :deep(.q-field__native) {
  padding: 8px 4px;
  font-weight: 500;
}

/* Remove border when readonly for cleaner look */
.account-input.q-field--readonly :deep(.q-field__control:before) {
  border-style: dashed;
  opacity: 0.5;
}

/* Focus State */
.q-field--focused .q-field__control:after {
  border-color: #fdc82a !important;
  border-width: 2px;
}

/* Transition for Save Button */
.scale-enter-active,
.scale-leave-active {
  transition: all 0.3s ease;
}
.scale-enter-from,
.scale-leave-to {
  transform: scale(0.9);
  opacity: 0;
}
</style>
