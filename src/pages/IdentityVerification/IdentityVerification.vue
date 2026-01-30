<template>
  <q-page class="q-pa-md bg-brand">
    <!-- Header -->
    <div class="row items-center justify-between q-mb-lg">
      <q-btn flat round icon="arrow_back" color="grey-7" @click="goBack" />
      <div class="text-h5 text-weight-bold">Identity verification</div>
      <div style="width: 40px"></div>
      <!-- Spacer for centering -->
    </div>

    <!-- Content Container -->
    <div class="column items-center q-mt-xl">
      <!-- Placeholder Image -->
      <div class="placeholder-container q-mb-xl q-mt-xl">
        <div class="placeholder-container bg-grey-4 rounded-borders flex flex-center">
          <div class="text-grey-6 text-center">
            <div class="text-body2">Illustration Placeholder</div>
          </div>
        </div>
      </div>

      <!-- Message Section -->
      <div class="text-center q-mb-xl">
        <div class="text-h6 text-weight-bold q-mb-md">No document uploaded!</div>
        <div class="text-body2 text-grey-6 q-px-md">
          We're waiting for your document to start the<br />
          verification process.
        </div>
      </div>

      <!-- Upload Button -->
      <q-btn
        label="Upload Documents"
        class="bg-gold text-white full-width q-py-sm text-weight-bold upload-btn"
        no-caps
        rounded
        size="md"
        @click="handleUpload"
      />
    </div>
  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router'
// Import the users store and get fetchCurrentUser from it

const router = useRouter()

// Methods
const goBack = () => {
  router.go(-1)
}

const handleUpload = () => {
  router.push('/upload-documents')
}
</script>

<style scoped>
.placeholder-container {
  width: 200px;
  height: 150px;
}

.placeholder-box {
  width: 100%;
  height: 100%;
  border: 2px dashed #d0d0d0;
  background-color: #f5f5f5 !important;
}

/* Dark theme placeholder background */
.body--dark .bg-grey-4 {
  background-color: #2d2d2d !important;
}

.upload-btn {
  max-width: 300px;
  width: 100%;
}

.rounded-borders {
  border-radius: 12px;
}
</style>
