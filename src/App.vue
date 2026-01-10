<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from 'src/stores/auth-store'

const authStore = useAuthStore()

onMounted(() => {
  // Initialize authentication state on app startup
  authStore.initializeAuth()
})
</script>
