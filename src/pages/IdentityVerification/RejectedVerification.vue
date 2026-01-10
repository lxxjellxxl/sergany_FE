<template>
    <!-- Header -->
  <div class="row items-center justify-between q-mb-lg q-pa-md">
    <q-btn flat round icon="arrow_back" color="grey-7" @click="goBack" />
    <div class="text-h5 text-weight-bold">Identity verification</div>
    <div style="width: 40px;"></div> <!-- Spacer for centering -->
  </div>

  <div class="rejected-verification">
    <div class="icon-container">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="12" fill="#F44336" />
        <path d="M8 8l8 8M16 8l-8 8" stroke="#fff" stroke-width="2" fill="none" />
      </svg>
    </div>
    <h2>Documents Rejected</h2>
    <p>Your documents were rejected. Please upload correct documents to continue the verification process.</p>
    <button class="submit-btn" @click="goToSubmitID">Submit Correct Documents</button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
function goToSubmitID() {
  router.push('/submit-id')
}

function goBack() {
  router.go(-1)
}

</script>

<style scoped>
.rejected-verification {
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
  color: #F44336;
  margin-bottom: 0.5rem;
}

p {
  color: #555;
  margin-bottom: 0.25rem;
}

.submit-btn {
  margin-top: 2rem;
  padding: 0.75rem 2rem;
  background: #FFD700;
  color: #333;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.submit-btn:hover {
  background: #FFC107;
}
</style>
