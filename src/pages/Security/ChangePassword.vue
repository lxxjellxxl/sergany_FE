<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <q-page class="q-pa-md bg-brand">
    <!-- Header -->
    <div class="row items-center q-mb-lg">
      <q-btn flat round icon="arrow_back" color="grey-7" @click="goBack" />
      <div class="text-h5 text-weight-bold q-ml-sm">Change Password</div>
    </div>

    <!-- Password Requirements -->
    <div class="q-mb-xl">
      <div class="text-body2 text-grey-7" style="line-height: 1.5;">
        Your new password must be at least 8 characters long and should include a mix of uppercase and lowercase
        letters, numbers, and special symbols (e.g., !, @, #). Avoid using common words or easily guessed combinations.
      </div>
    </div>

    <!-- Form -->
    <div class="q-gutter-lg">
      <!-- Current Password -->
      <div>
        <div class="text-body2 text-grey-7 q-mb-sm">Current Password</div>
        <q-input v-model="currentPassword" :type="showCurrentPassword ? 'text' : 'password'" filled
          placeholder="Enter Current Password" class="password-input">
          <template v-slot:append>
            <q-icon :name="showCurrentPassword ? 'visibility_off' : 'visibility'" class="cursor-pointer text-grey-5"
              @click="showCurrentPassword = !showCurrentPassword" />
          </template>
        </q-input>
      </div>

      <!-- New Password -->
      <div>
        <div class="text-body2 text-grey-7 q-mb-sm">New Password</div>
        <q-input v-model="newPassword" :type="showNewPassword ? 'text' : 'password'" filled
          placeholder="Enter New Password" class="password-input">
          <template v-slot:append>
            <q-icon :name="showNewPassword ? 'visibility_off' : 'visibility'" class="cursor-pointer text-grey-5"
              @click="showNewPassword = !showNewPassword" />
          </template>
        </q-input>
      </div>

      <!-- Confirm New Password -->
      <div>
        <div class="text-body2 text-grey-7 q-mb-sm">Confirm New Password</div>
        <q-input v-model="confirmPassword" :type="showConfirmPassword ? 'text' : 'password'" filled
          placeholder="Confirm New Password" class="password-input">
          <template v-slot:append>
            <q-icon :name="showConfirmPassword ? 'visibility_off' : 'visibility'" class="cursor-pointer text-grey-5"
              @click="showConfirmPassword = !showConfirmPassword" />
          </template>
        </q-input>
      </div>
    </div>

    <!-- Save Button -->
    <div class="q-mt-xl">
      <q-btn unelevated color="amber-6" rounded label="Save" class="full-width q-py-sm text-weight-medium"
        :disable="!isFormValid" @click="savePassword" />
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Form data
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

// Password visibility toggles
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

// Form validation
const isFormValid = computed(() => {
  return currentPassword.value.length > 0 &&
    newPassword.value.length >= 8 &&
    confirmPassword.value === newPassword.value
})

// Methods
const goBack = () => {
  router.go(-1)
}

const savePassword = () => {
  if (!isFormValid.value) return

  // Here you would typically make an API call to change the password
  console.log('Password change request:', {
    currentPassword: currentPassword.value,
    newPassword: newPassword.value
  })

  // Show success message and navigate back
  // For now, just navigate back
  router.go(-1)
}
</script>

<style scoped>
.password-input :deep(.q-field__control) {
  border-radius: 8px;
}

.password-input :deep(.q-field__native) {
  padding: 12px 16px;
}
</style>
