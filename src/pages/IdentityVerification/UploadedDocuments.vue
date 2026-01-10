<template>
  <div class="verification-complete">
    <div class="icon-container">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="12" fill="#4CAF50" />
        <path d="M7 13l3 3 7-7" stroke="#fff" stroke-width="2" fill="none" />
      </svg>
    </div>
    <h2>Documents Uploaded</h2>
    <p>Your documents have been successfully uploaded and are now under review.</p>
    <p>We will notify you once the verification is complete.</p>
    <button class="home-btn" @click="goHome">Back to Home</button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
function goHome() {
  router.push('/')
}
// ...existing code...
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

.home-btn {
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

.home-btn:hover {
  background: #FFC107;
}
</style>
