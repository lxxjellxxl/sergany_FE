<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <q-page class="q-pa-md bg-brand">
    <!-- Header -->
    <div class="row items-center q-mb-lg">
      <q-btn flat round icon="arrow_back" color="grey-7" @click="goBack" />
      <div class="text-h5 text-weight-bold q-ml-sm">Submit Your ID Card</div>
    </div>

    <div class="page-content">
      <!-- Description -->
      <div class="text-body2 text-grey-7 q-mb-xl description-text">
        To verify your identity, please take clear photos of both the front and back of your ID card. Ensure all details
        are visible and the images are not blurry or obstructed.
      </div>

      <!-- ID Card Front Side -->
      <div class="upload-section q-mb-lg">
        <div class="text-body2 text-weight-medium q-mb-md">ID card Front side</div>

        <div class="upload-area front-side" :class="{ 'has-image': frontImage }" @click="selectFrontImage">
          <div v-if="!frontImage" class="upload-placeholder">
            <q-icon name="add_a_photo" size="40px" color="gold" />
            <div class="text-body2 text-grey-6 q-mt-sm">ID card Front side</div>
          </div>

          <div v-else class="image-preview">
            <img :src="frontImageUrl" alt="ID Front" class="uploaded-image" />
            <q-btn round icon="close" size="sm" color="red" class="remove-btn" @click.stop="removeFrontImage" />
          </div>
        </div>
      </div>

      <!-- ID Card Back Side -->
      <div class="upload-section q-mb-xl">
        <div class="text-body2 text-weight-medium q-mb-md">ID card Back side</div>

        <div class="upload-area back-side" :class="{ 'has-image': backImage }" @click="selectBackImage">
          <div v-if="!backImage" class="upload-placeholder">
            <q-icon name="add_a_photo" size="40px" color="gold" />
            <div class="text-body2 text-grey-6 q-mt-sm">ID card Back side</div>
          </div>

          <div v-else class="image-preview">
            <img :src="backImageUrl" alt="ID Back" class="uploaded-image" />
            <q-btn round icon="close" size="sm" color="red" class="remove-btn" @click.stop="removeBackImage" />
          </div>
        </div>
      </div>

      <!-- Next Button -->
      <q-btn label="Next" :color="canProceed ? 'gold' : 'grey-5'" text-color="white" no-caps unelevated
        :disable="!canProceed" class="full-width next-btn" @click="proceedToNext" />

      <!-- Hidden File Inputs -->
      <input ref="frontFileInput" type="file" accept="image/*" style="display: none" @change="handleFrontImageSelect" />
      <input ref="backFileInput" type="file" accept="image/*" style="display: none" @change="handleBackImageSelect" />
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Refs
const frontFileInput = ref(null)
const backFileInput = ref(null)
const frontImage = ref(null)
const backImage = ref(null)
const frontImageUrl = ref('')
const backImageUrl = ref('')

// Computed
const canProceed = computed(() => {
  return frontImage.value && backImage.value
})

// Methods
const goBack = () => {
  router.go(-1)
}

const selectFrontImage = () => {
  frontFileInput.value.click()
}

const selectBackImage = () => {
  backFileInput.value.click()
}

const handleFrontImageSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    frontImage.value = file
    frontImageUrl.value = URL.createObjectURL(file)
  }
}

const handleBackImageSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    backImage.value = file
    backImageUrl.value = URL.createObjectURL(file)
  }
}

const removeFrontImage = () => {
  frontImage.value = null
  frontImageUrl.value = ''
  frontFileInput.value.value = ''
}

const removeBackImage = () => {
  backImage.value = null
  backImageUrl.value = ''
  backFileInput.value.value = ''
}

const proceedToNext = () => {
  if (canProceed.value) {
    console.log('Proceeding with images:', {
      front: frontImage.value,
      back: backImage.value
    })
    // Navigate to next step or submit
    // router.push('/identity-verification/selfie')
  }
}
</script>

<style scoped>
.page-content {
  width: 90%;
  margin: 0 auto;
}

.description-text {
  line-height: 1.6;
}

.upload-section {
  width: 100%;
}

.upload-area {
  width: 100%;
  height: 200px;
  border: 2px dashed #FDC82A;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  background: rgba(253, 200, 42, 0.05);
}

.upload-area:hover {
  background: rgba(253, 200, 42, 0.1);
  border-color: #F39C12;
}

.upload-area.has-image {
  border-style: solid;
  background: transparent;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.image-preview {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.uploaded-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 8px;
}

.remove-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(244, 67, 54, 0.9) !important;
}

.next-btn {
  height: 48px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  margin-top: 20px;
}

.next-btn[disabled] {
  background: #E0E0E0 !important;
  color: #9E9E9E !important;
}

/* Dark theme support */
.body--dark .upload-area {
  background: rgba(253, 200, 42, 0.1);
}

.body--dark .upload-area:hover {
  background: rgba(253, 200, 42, 0.15);
}

.body--dark .next-btn[disabled] {
  background: #424242 !important;
  color: #757575 !important;
}
</style>
