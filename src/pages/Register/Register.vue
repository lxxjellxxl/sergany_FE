<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <q-layout>
    <q-page-container>
      <q-page class="q-pa-lg">
        <!-- Logo -->
        <div class="logo-container serganyLogo text-center q-mb-md">
          <img src="/serganyLogo - gold.png" alt="Sergany Logo" width="250" />
        </div>

        <!-- Welcome Text -->
        <div class="welcome-text q-mb-xl">
          <h4 class="text-h4 text-weight-bold q-mb-sm text-dark">Welcome Aboard!</h4>
          <p class="text-body2 text-grey-7 q-mb-none">
            Let's create your account! Just enter your information below, and you'll be ready to go
            in no time.
          </p>
        </div>

        <!-- Register Form -->
        <q-form @submit="onRegister" class="register-form">
          <!-- First Name Field -->
          <div class="q-mb-md">
            <label class="text-body2 text-dark q-mb-xs block text-weight-medium">First name</label>
            <q-input
              v-model="registerForm.firstName"
              type="text"
              placeholder="First name"
              filled
              dense
              class="custom-input"
              bg-color="grey-2"
              :rules="[(val) => !!val || 'First name is required']"
            />
          </div>

          <!-- Last Name Field -->
          <div class="q-mb-md">
            <label class="text-body2 text-dark q-mb-xs block text-weight-medium">Last name</label>
            <q-input
              v-model="registerForm.lastName"
              type="text"
              placeholder="Last name"
              filled
              dense
              class="custom-input"
              bg-color="grey-2"
              :rules="[(val) => !!val || 'Last name is required']"
            />
          </div>

          <!-- Country Code Field -->
          <div class="q-mb-md">
            <label class="text-body2 text-dark q-mb-xs block text-weight-medium"
              >Country Code</label
            >
            <q-select
              v-model="registerForm.countryCode"
              :options="countryOptions"
              option-label="label"
              option-value="value"
              emit-value
              map-options
              filled
              dense
              class="custom-input"
              bg-color="grey-2"
              :rules="[(val) => !!val || 'Country code is required']"
            >
              <template v-slot:prepend>
                <span style="font-size: 20px">{{ getSelectedCountryFlag }}</span>
              </template>
            </q-select>
          </div>

          <!-- Phone Number Field -->
          <div class="q-mb-md">
            <label class="text-body2 text-dark q-mb-xs block text-weight-medium"
              >Phone number</label
            >
            <q-input
              v-model="registerForm.phoneNumber"
              type="tel"
              placeholder="Phone number"
              filled
              dense
              class="custom-input"
              bg-color="grey-2"
              :rules="[
                (val) => !!val || 'Phone number is required',
                (val) => /^[0-9+\-\s()]+$/.test(val) || 'Please enter a valid phone number',
              ]"
            />
          </div>

          <!-- Email Field -->
          <div class="q-mb-md">
            <label class="text-body2 text-dark q-mb-xs block text-weight-medium">E-mail</label>
            <q-input
              v-model="registerForm.email"
              type="email"
              placeholder="Enter your E-mail"
              filled
              dense
              class="custom-input"
              bg-color="grey-2"
              :rules="[
                (val) => !!val || 'Email is required',
                (val) => /.+@.+\..+/.test(val) || 'Please enter a valid email',
              ]"
            />
          </div>

          <!-- Referral Code Field -->
          <div class="q-mb-md">
            <label class="text-body2 text-dark q-mb-xs block text-weight-medium"
              >Referral Code (Optional)</label
            >
            <q-input
              v-model="registerForm.referralCode"
              type="text"
              placeholder="Referral Code (Optional)"
              filled
              dense
              class="custom-input"
              :bg-color="isReferralFixed ? 'grey-3' : 'grey-2'"
              :readonly="isReferralFixed"
            >
              <template v-if="isReferralFixed" v-slot:append>
                <q-icon name="lock" size="xs" color="grey-6" />
              </template>
            </q-input>
          </div>

          <!-- Password Field -->
          <div class="q-mb-md">
            <label class="text-body2 text-dark q-mb-xs block text-weight-medium">Password</label>
            <q-input
              v-model="registerForm.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Enter Password"
              filled
              dense
              class="custom-input"
              bg-color="grey-2"
              :rules="[
                (val) => !!val || 'Password is required',
                (val) => val.length >= 6 || 'Password must be at least 6 characters',
              ]"
            >
              <template v-slot:append>
                <q-btn
                  flat
                  round
                  dense
                  :icon="showPassword ? 'visibility_off' : 'visibility'"
                  @click="showPassword = !showPassword"
                  class="text-grey-6 q-mt-md"
                />
              </template>
            </q-input>
          </div>

          <!-- Confirm Password Field -->
          <div class="q-mb-md">
            <label class="text-body2 text-dark q-mb-xs block text-weight-medium"
              >Confirm Password</label
            >
            <q-input
              v-model="registerForm.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="Confirm Password"
              filled
              dense
              class="custom-input"
              bg-color="grey-2"
              :rules="[
                (val) => !!val || 'Please confirm your password',
                (val) => val === registerForm.password || 'Passwords do not match',
              ]"
            >
              <template v-slot:append>
                <q-btn
                  flat
                  round
                  dense
                  :icon="showConfirmPassword ? 'visibility_off' : 'visibility'"
                  @click="showConfirmPassword = !showConfirmPassword"
                  class="text-grey-6 q-mt-md"
                />
              </template>
            </q-input>
          </div>

          <!-- Terms and Conditions -->
          <div class="q-mb-xl">
            <q-checkbox
              v-model="registerForm.acceptTerms"
              class="text-body2"
              required
              :rules="[(val) => !!val || 'You must accept the terms and conditions']"
            >
              <span class="text-grey-7">
                By creating an account, you agree to our
                <router-link
                  to="/terms"
                  class="text-amber-6 text-decoration-none text-weight-medium"
                >
                  Terms and conditions
                </router-link>
              </span>
            </q-checkbox>
          </div>

          <!-- Signup Button -->
          <q-btn
            type="submit"
            label="Signup"
            color="amber-6"
            class="full-width text-weight-bold"
            :loading="loading"
            :disable="!registerForm.acceptTerms || loading"
            size="lg"
            no-caps
            rounded
          />

          <!-- Login Link -->
          <div class="text-center q-mt-xl">
            <span class="text-grey-7 text-body2">
              Already have an account?
              <router-link to="/login" class="text-amber-6 text-decoration-none text-weight-bold">
                Login
              </router-link>
            </span>
          </div>
        </q-form>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'src/stores/auth-store'

const $q = useQuasar()
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// Reactive state
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(false)
const isReferralFixed = ref(false)

const registerForm = reactive({
  firstName: '',
  lastName: '',
  countryCode: '+20',
  phoneNumber: '',
  email: '',
  referralCode: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false,
})

// Country options
const countryOptions = [
  { label: '+2 Egypt', value: '+2', flag: '🇪🇬' },
  { label: '+1 USA', value: '+1', flag: '🇺🇸' },
  { label: '+44 UK', value: '+44', flag: '🇬🇧' },
]

// Computed
const getSelectedCountryFlag = computed(() => {
  const selectedCountry = countryOptions.find(
    (country) => country.value === registerForm.countryCode,
  )
  return selectedCountry?.flag || '🇪🇬'
})

// Lifecycle Hook to check URL
onMounted(() => {
  if (route.query.ref) {
    registerForm.referralCode = route.query.ref
    isReferralFixed.value = true // Disable editing
  }
})

// Methods
const onRegister = async () => {
  loading.value = true

  try {
    // Prepare registration data
    const registrationData = {
      first_name: registerForm.firstName,
      last_name: registerForm.lastName,
      username: registerForm.email,
      email: registerForm.email,
      phone: registerForm.countryCode + registerForm.phoneNumber,
      password: registerForm.password,
    }

    // Add referral code only if provided
    if (registerForm.referralCode) {
      registrationData.referral_code_used = registerForm.referralCode
    }

    // Call auth store
    await authStore.register(registrationData)

    $q.notify({
      type: 'positive',
      message: 'Registration successful! Please check your email for verification.',
      position: 'top',
      timeout: 5000,
    })

    // Reset Form
    Object.keys(registerForm).forEach((key) => {
      if (typeof registerForm[key] === 'string') {
        registerForm[key] = ''
      } else if (typeof registerForm[key] === 'boolean') {
        registerForm[key] = false
      }
    })
    registerForm.countryCode = '+20'
    isReferralFixed.value = false

    router.push('/login')
  } catch (error) {
    console.error('Registration error:', error)

    let errorMessage = 'Registration failed. Please try again.'

    if (error.response?.data) {
      if (typeof error.response.data === 'string') {
        errorMessage = error.response.data
      } else if (error.response.data.message) {
        errorMessage = error.response.data.message
      } else {
        // Build error message from fields
        const errors = []
        Object.keys(error.response.data).forEach((field) => {
          const fieldError = error.response.data[field]
          const msg = Array.isArray(fieldError) ? fieldError[0] : fieldError
          errors.push(`${field}: ${msg}`)
        })
        if (errors.length > 0) errorMessage = errors.join(', ')
      }
    }

    $q.notify({
      type: 'negative',
      message: errorMessage,
      position: 'top',
      timeout: 5000,
    })
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.register-form-wrapper {
  width: 100%;
  padding: 2rem 1.5rem;
}

.serganyLogo {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;

  img {
    max-width: 100%;
    height: auto;
  }
}

.welcome-text {
  text-align: left;

  h4 {
    margin: 0 0 0.5rem 0;
    font-size: 1.75rem;
    line-height: 1.3;
    color: #1a1a1a;
  }

  p {
    margin: 0;
    line-height: 1.5;
    color: #666;
  }
}

.custom-input {
  :deep(.q-field__control) {
    height: 56px;
    border-radius: 12px;
    background: #f5f5f5;

    &:before {
      border: none;
    }
    &:after {
      border: none;
    }
  }

  :deep(.q-field__native) {
    padding: 16px 20px;
    font-size: 16px;
    color: #1a1a1a;
  }

  :deep(.q-placeholder) {
    color: #999;
    font-size: 16px;
  }

  :deep(.q-field--filled .q-field__control) {
    background: #f5f5f5;
  }
}

.q-btn {
  font-size: 16px;
  font-weight: 700;
  height: 56px;
}

.q-checkbox {
  :deep(.q-checkbox__label) {
    font-size: 14px;
    line-height: 1.4;
  }
}

// Mobile responsive
@media (max-width: 480px) {
  .register-form-wrapper {
    padding: 1.5rem 1rem;
  }
  .welcome-text h4 {
    font-size: 1.5rem;
  }
}

// Desktop styles
@media (min-width: 481px) {
  .register-form-wrapper {
    padding: 3rem 2.5rem;
    background: white;
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
    margin: 2rem auto;
  }
}
</style>
