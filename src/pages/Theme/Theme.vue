<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <q-page class="q-pa-md bg-brand">
    <!-- Header -->
    <div class="row items-center q-mb-lg">
      <q-btn flat round icon="arrow_back" color="grey-7" @click="goBack" />
      <div class="text-h5 text-weight-bold q-ml-sm">Theme</div>
    </div>

    <!-- Description -->
    <div class="q-mb-lg">
      <div class="text-body2 text-grey-6">Select app theme</div>
    </div>

    <!-- Theme Options -->
    <!-- Light Theme -->
    <q-card class="theme-option q-mb-sm rounded-small-borders" @click="selectTheme('light')">
      <q-item class="q-py-lg">
        <q-item-section>
          <q-item-label class="text-weight-medium text-body1">Light</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-radio v-model="selectedTheme" val="light" color="amber-6" class="theme-radio" />
        </q-item-section>
      </q-item>
    </q-card>

    <!-- Dark Theme -->
    <q-card class="theme-option q-mb-sm rounded-small-borders" @click="selectTheme('dark')">
      <q-item class="q-py-lg">
        <q-item-section>
          <q-item-label class="text-weight-medium text-body1">Dark</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-radio v-model="selectedTheme" val="dark" color="amber-6" class="theme-radio" />
        </q-item-section>
      </q-item>
    </q-card>

    <!-- System Default Theme -->
    <q-card class="theme-option q-mb-sm rounded-small-borders" @click="selectTheme('system')">
      <q-item class="q-py-lg">
        <q-item-section>
          <q-item-label class="text-weight-medium text-body1">System default</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-radio v-model="selectedTheme" val="system" color="amber-6" class="theme-radio" />
        </q-item-section>
      </q-item>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Dark } from 'quasar'

const router = useRouter()

// Theme state
const selectedTheme = ref('light')

// Methods
const goBack = () => {
  router.go(-1)
}

const selectTheme = (theme) => {
  selectedTheme.value = theme
  applyTheme(theme)
}

const applyTheme = (theme) => {
  console.log('Applying theme:', theme)
  console.log('Dark mode before:', Dark.isActive)

  switch (theme) {
    case 'light':
      Dark.set(false)
      localStorage.setItem('theme', 'light')
      break
    case 'dark':
      Dark.set(true)
      localStorage.setItem('theme', 'dark')
      break
    case 'system':
      Dark.set('auto')
      localStorage.setItem('theme', 'system')
      break
  }

  console.log('Dark mode after:', Dark.isActive)
}

const loadSavedTheme = () => {
  const savedTheme = localStorage.getItem('theme') || 'light'
  selectedTheme.value = savedTheme
  applyTheme(savedTheme)
}

// Watch for theme changes and apply them
watch(selectedTheme, (newTheme) => {
  applyTheme(newTheme)
})

// Load saved theme on mount
onMounted(() => {
  loadSavedTheme()
})
</script>

<style scoped>
.rounded-borders {
  border-radius: 12px;
}

.theme-option {
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
  box-shadow: none !important;
}

.theme-option:hover {
  border-color: #FDC82A;
}

.theme-radio {
  pointer-events: none;
}

.theme-options {
  width: 100%;
}
</style>
