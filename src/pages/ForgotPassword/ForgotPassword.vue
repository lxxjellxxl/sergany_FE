<template>
  <q-layout>
    <q-page-container>
      <q-page class="forgot-password-page">
        <div class="forgot-password-container">
          <div class="header-section q-mb-lg">
            <q-btn flat round icon="arrow_back" class="back-btn text-grey-8" @click="goBack" />
            <h5 class="page-title text-grey-8 text-weight-medium q-ma-none">Forgot password</h5>
          </div>

          <div class="content-section">
            <div class="title-section q-mb-xl">
              <h4 class="main-title text-weight-bold q-mb-sm text-dark">
                Forgot Your Password? We've Got You!
              </h4>
              <p class="description text-body2 text-grey-7 q-mb-none">
                Just enter your email or phone number, and we'll send you an OTP to reset your
                password.
              </p>
            </div>

            <q-form @submit="onSendOTP" class="reset-form">
              <div class="q-mb-md">
                <label class="text-body2 text-dark q-mb-xs block text-weight-medium">E-mail</label>
                <q-input
                  v-model="email"
                  type="email"
                  placeholder="E-mail"
                  filled
                  dense
                  class="custom-input"
                  bg-color="grey-2"
                  lazy-rules
                  :rules="[
                    (val) => !!val || 'Email is required',
                    (val) =>
                      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ||
                      'Please enter a valid email address',
                  ]"
                />
              </div>

              <div class="q-mb-xl">
                <p class="text-body2 text-grey-7 q-mb-xs">
                  Want to use your phone instead?
                  <router-link
                    to="/reset-phone"
                    class="text-amber-6 text-decoration-none text-weight-medium"
                  >
                    Reset with phone
                  </router-link>
                </p>
              </div>

              <q-btn
                type="submit"
                label="Send OTP"
                color="amber-6"
                class="full-width text-weight-bold"
                :loading="loading"
                size="lg"
                no-caps
                rounded
              />
            </q-form>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useUsersStore } from 'src/stores/users-store'

// Setup hooks
const $q = useQuasar()
const router = useRouter()
const userStore = useUsersStore()

// State
const loading = ref(false)
const email = ref('') // Simplified from reactive object since it's just one field

// Actions
const goBack = () => {
  router.go(-1)
}

const onSendOTP = async () => {
  loading.value = true

  try {
    // Call store action
    await userStore.resetPassword(email.value)

    $q.notify({
      type: 'positive',
      message: 'OTP has been sent to your email. Please check your inbox.',
      position: 'top',
    })

    // Redirect to OTP verification page
    await router.push({
      name: 'verify-otp',
      query: { email: email.value, type: 'password-reset' },
    })
  } catch (error) {
    console.error(error)
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Failed to send OTP. Please try again.',
      position: 'top',
    })
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.forgot-password-page {
  background: #f8f9fa;
  min-height: 100vh;
  padding: 1rem;
}

.forgot-password-container {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  background: white;
  min-height: 100vh;
  padding: 2rem 1.5rem;
}

.header-section {
  display: flex;
  align-items: center;
  gap: 1rem;

  .back-btn {
    padding: 8px;
    margin-left: -8px;
  }

  .page-title {
    font-size: 1.25rem;
    line-height: 1.2;
  }
}

.content-section {
  .main-title {
    font-size: 1.5rem;
    line-height: 1.3;
    color: #1a1a1a;
    margin: 0 0 0.5rem 0;
  }

  .description {
    line-height: 1.5;
    color: #666;
    margin: 0;
  }
}

.custom-input {
  :deep(.q-field__control) {
    height: 56px;
    border-radius: 12px;
    background: #f5f5f5;

    // Remove borders for cleaner look
    &:before,
    &:after {
      border: none;
    }
  }

  :deep(.q-field__native) {
    padding: 16px 0; // Adjusted padding
    font-size: 16px;
    color: #1a1a1a;
  }

  :deep(.q-placeholder) {
    color: #999;
    font-size: 16px;
  }
}

// Mobile responsive logic
@media (max-width: 480px) {
  .forgot-password-container {
    padding: 1.5rem 1rem;
    border-radius: 0;
  }

  .content-section .main-title {
    font-size: 1.25rem;
  }
}

// Desktop specific logic
@media (min-width: 481px) {
  .forgot-password-page {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .forgot-password-container {
    min-height: auto;
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
    margin: 2rem auto;
    padding: 3rem 2.5rem;
  }
}
</style>
