<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <q-page class="q-pa-md bg-brand">
    <!-- Header -->
    <div class="row items-center q-mb-lg">
      <q-btn flat round icon="arrow_back" color="grey-7" @click="goBack" />
      <div class="text-h5 text-weight-bold q-ml-sm">Security</div>
    </div>

    <!-- Security Section -->
    <div class="q-mb-lg">
      <div class="text-caption text-grey-6 text-weight-medium q-mb-md">SECURITY</div>

      <!-- Change Password -->
      <q-card class="security-option q-mb-md rounded-small-borders" @click="goToChangePassword">
        <q-item class="q-py-lg">
          <q-item-section avatar>
            <q-icon name="lock" color="grey-7" size="24px" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-medium text-body1">Change Password</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="chevron_right" color="amber-6" />
          </q-item-section>
        </q-item>
      </q-card>

      <!-- Change PIN -->
      <q-card class="security-option q-mb-md rounded-small-borders" @click="changePIN">
        <q-item class="q-py-lg">
          <q-item-section avatar>
            <q-icon name="pin" color="grey-7" size="24px" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-medium text-body1">Change PIN</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="chevron_right" color="amber-6" />
          </q-item-section>
        </q-item>
      </q-card>
    </div>

    <!-- Privacy Section -->
    <div class="q-mb-lg">
      <div class="text-caption text-grey-6 text-weight-medium q-mb-md">PRIVACY</div>

      <!-- Privacy -->
      <q-card class="security-option q-mb-md rounded-small-borders" @click="privacy">
        <q-item class="q-py-lg">
          <q-item-section avatar>
            <q-icon name="shield" color="grey-7" size="24px" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-medium text-body1">Privacy</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="chevron_right" color="amber-6" />
          </q-item-section>
        </q-item>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

// Methods
const goBack = () => {
  router.go(-1)
}

function goToChangePassword() {
  router.push('/changePassword')
}

const changePIN = () => {
  router.push('/set-pin-code')
  // Navigate to change PIN page when implemented
}

const privacy = () => {
  console.log('Privacy clicked')
  // Navigate to privacy page when implemented
}
</script>

<style scoped>
.rounded-borders {
  border-radius: 12px;
}

.security-option {
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
  box-shadow: none !important;
}

.security-option:hover {
  border-color: #FDC82A;
}

.security-options,
.privacy-options {
  width: 100%;
}
</style>
