<template>
  <q-page class="q-pa-md bg-brand">
    <!-- Header -->
    <div class="row items-center justify-between q-mb-lg">
      <q-btn flat round icon="arrow_back" color="grey-7" @click="goBack" />
      <div class="text-h5 text-weight-bold">Language</div>
      <div style="width: 40px;"></div> <!-- Spacer for centering -->
    </div>

    <!-- Subtitle -->
    <div class="text-body2 text-grey-6 q-mb-lg">Select app language</div>

    <!-- Language Options -->
    <div class="language-options">
      <!-- English -->
      <q-card class="language-option q-mb-md rounded-small-borders" @click="selectLanguage('en')">
        <q-item class="q-py-lg">
          <q-item-section>
            <q-item-label class="text-weight-medium text-body1">English</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-radio v-model="selectedLanguage" val="en" color="amber-6" class="language-radio" />
          </q-item-section>
        </q-item>
      </q-card>

      <!-- Arabic -->
      <q-card class="language-option q-mb-md rounded-small-borders" @click="selectLanguage('ar')">
        <q-item class="q-py-lg">
          <q-item-section>
            <q-item-label class="text-weight-medium text-body1">العربية</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-radio v-model="selectedLanguage" val="ar" color="amber-6" class="language-radio" />
          </q-item-section>
        </q-item>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const router = useRouter()
const $q = useQuasar()

// Selected language (English is default/selected as shown in image)
const selectedLanguage = ref('en')

// Methods
const goBack = () => {
  router.go(-1)
}

const selectLanguage = (language) => {
  selectedLanguage.value = language

  // Here you would typically save the language preference
  // and apply the language change to your app
  console.log('Selected language:', language)

  // Show confirmation
  $q.notify({
    message: language === 'en' ? 'Language changed to English' : 'تم تغيير اللغة إلى العربية',
    color: 'positive',
    position: 'top'
  })
}
</script>

<style scoped>
.language-option {
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
  box-shadow: none !important;
}

.language-option:hover {
  border-color: #FDC82A;
}

.language-radio {
  pointer-events: none;
}

.language-options {
  width: 100%;
}
</style>
