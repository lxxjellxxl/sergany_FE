<template>
  <!-- Debug Banner -->
  <!-- <div class="bg-blue-10 text-white text-center q-pa-xs text-caption">Target: {{ apiUrl }}</div> -->

  <div class="q-pa-lg">
    <div class="logo-container serganyLogo text-center q-mb-md">
      <!-- Fixed: Use imported logo for reliable path resolution -->
      <img :src="logo" alt="Sergany Logo" width="250" />
    </div>

    <div class="welcome-text q-mb-xl">
      <h4 class="text-h4 text-weight-bold q-mb-sm text-dark">Welcome to Sergany</h4>
      <p class="text-body2 text-grey-7 q-mb-none">Login to continue.</p>
    </div>

    <q-form @submit="onLogin" class="login-form">
      <!-- Email Input -->
      <div class="q-mb-md">
        <q-input
          v-model="loginForm.email"
          type="email"
          placeholder="Email"
          filled
          dense
          class="custom-input"
        />
      </div>

      <!-- Password Input -->
      <div class="q-mb-sm">
        <q-input
          v-model="loginForm.password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Password"
          filled
          dense
          class="custom-input"
        >
          <template v-slot:append>
            <q-btn
              flat
              round
              dense
              :icon="showPassword ? 'visibility_off' : 'visibility'"
              @click="showPassword = !showPassword"
            />
          </template>
        </q-input>

        <!-- Forgot Password Link -->
        <div v-if="showForgotPassword" class="text-right q-mt-xs q-px-xs">
          <router-link
            to="/forgot-password"
            class="text-caption text-grey-7"
            style="text-decoration: none"
          >
            <span class="text-grey-7 text-body2"> Forgot Password? </span>
          </router-link>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="generalError" class="q-mb-md">
        <q-banner class="text-white bg-negative rounded-borders">
          {{ generalError }}
        </q-banner>
      </div>

      <!-- Login Button -->
      <q-btn
        type="submit"
        label="Login"
        color="amber-6"
        class="full-width text-weight-bold"
        :loading="loading"
        rounded
      />

      <!-- Debug Info -->
      <!-- <div
        v-if="debugLog"
        class="q-mt-lg bg-grey-3 q-pa-sm rounded-borders"
        style="word-break: break-all; font-family: monospace; font-size: 10px"
      >
        <strong>DEBUG INFO:</strong>
        <pre>{{ debugLog }}</pre>
      </div> -->

      <!-- Signup Link -->
      <div class="text-center q-mt-xl">
        <span class="text-grey-7 text-body2">
          Do not have an account yet?
          <router-link to="/register" class="text-amber-6 text-decoration-none text-weight-bold">
            Signup
          </router-link>
        </span>
      </div>
    </q-form>
  </div>
</template>

<script setup>
import { ref, reactive, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'src/stores/auth-store'
import { useUsersStore } from 'src/stores/users-store'
import logo from 'src/assets/serganyLogo - gold.png' // Import logo directly

const apiUrl = process.env.API_BASE_URL
const $q = useQuasar()
const router = useRouter()
const authStore = useAuthStore()
const userStore = useUsersStore()

const showPassword = ref(false)
const showForgotPassword = ref(false)
const loading = ref(false)
const generalError = ref('')
const debugLog = ref('')

const loginForm = reactive({
  email: '',
  password: '',
})

const onLogin = async () => {
  loading.value = true
  generalError.value = ''
  debugLog.value = 'Sending request...'

  try {
    // --- THE FIX ---
    // Using 'email' key because Django Djoser LOGIN_FIELD = 'email'
    const credentials = {
      email: loginForm.email,
      password: loginForm.password,
    }

    await authStore.tokenLogin(credentials)

    $q.notify({ type: 'positive', message: 'Login Success' })
    debugLog.value = 'LOGIN SUCCESS!'

    await userStore.fetchCurrentUser()
    if (userStore.isAdmin) {
      router.replace('/dashboard')
    } else {
      router.replace('/')
    }
  } catch (error) {
    showForgotPassword.value = true

    // --- Capture Debug Info ---
    const debugData = {
      message: error.message,
      code: error.code,
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      method: error.config?.method,
      requestHeaders: error.config?.headers,
      responseStatus: error.response?.status,
      responseData: error.response?.data,
    }

    debugLog.value = JSON.stringify(debugData, null, 2)
    // --------------------------

    if (error.response) {
      const data = error.response.data
      if (data.non_field_errors) {
        generalError.value = data.non_field_errors[0]
      } else {
        generalError.value = `Login failed: ${error.response.status}`
      }
    } else if (error.request) {
      generalError.value = 'Network Error: Server not reachable.'
    } else {
      generalError.value = error.message
    }
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.custom-input {
  :deep(.q-field__control) {
    background: #f5f5f5;
    border-radius: 12px;
  }
}
.q-btn {
  height: 50px;
}
</style>
