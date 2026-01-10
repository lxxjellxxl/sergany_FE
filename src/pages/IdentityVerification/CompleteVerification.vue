<template>

      <!-- Header -->
  <div class="row items-center justify-between q-mb-lg q-pa-md">
    <q-btn flat round icon="arrow_back" color="grey-7" @click="goBack" />
    <div class="text-h5 text-weight-bold">Identity verification</div>
    <div style="width: 40px;"></div> <!-- Spacer for centering -->
  </div>

  <div class="verification-complete">
    <div class="icon-container">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="12" fill="#4CAF50" />
        <path d="M7 13l3 3 7-7" stroke="#fff" stroke-width="2" fill="none" />
      </svg>
    </div>
    <h2>Verification Successful</h2>
    <p>Your documents have been uploaded and you are now verified.</p>
    <p>Thank you for completing the verification process.</p>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
function goBack() {
  router.go(-1)
}
</script>

<style scoped>
.verification-complete {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  padding: 2rem;
}

.icon-container {
  margin-bottom: 1.5rem;
}

h2 {
  color: #4CAF50;
  margin-bottom: 0.5rem;
}

p {
  color: #555;
  margin-bottom: 0.25rem;
}
</style>
