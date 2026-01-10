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

        <div class="upload-area front-side" :class="{ 'has-image': frontImage }">
          <div v-if="!frontImage" class="upload-placeholder">
            <q-icon name="add_a_photo" size="40px" color="gold" />
            <div class="text-body2 text-grey-6 q-mt-sm q-mb-md">ID card Front side</div>

            <!-- Upload options -->
            <div class="upload-options">
              <q-btn outline color="gold" icon="photo_library" label="Upload" size="sm" @click="selectFrontImage"
                class="q-mr-sm" />
              <q-btn outline color="gold" icon="photo_camera" label="Camera" size="sm" @click="openFrontCamera" />
            </div>
          </div>

          <div v-else class="image-preview">
            <img :src="frontImageUrl" alt="ID Front" class="uploaded-image" />
            <q-btn round icon="close" size="sm" color="red" class="remove-btn" @click.stop="removeFrontImage" />
          </div>
        </div>
      </div>

      <!-- ID Card Back Side -->
      <div class="upload-section q-mb-lg">
        <div class="text-body2 text-weight-medium q-mb-md">ID card Back side</div>

        <div class="upload-area back-side" :class="{ 'has-image': backImage }">
          <div v-if="!backImage" class="upload-placeholder">
            <q-icon name="add_a_photo" size="40px" color="gold" />
            <div class="text-body2 text-grey-6 q-mt-sm q-mb-md">ID card Back side</div>

            <!-- Upload options -->
            <div class="upload-options">
              <q-btn outline color="gold" icon="photo_library" label="Upload" size="sm" @click="selectBackImage"
                class="q-mr-sm" />
              <q-btn outline color="gold" icon="photo_camera" label="Camera" size="sm" @click="openBackCamera" />
            </div>
          </div>

          <div v-else class="image-preview">
            <img :src="backImageUrl" alt="ID Back" class="uploaded-image" />
            <q-btn round icon="close" size="sm" color="red" class="remove-btn" @click.stop="removeBackImage" />
          </div>
        </div>
      </div>

      <!-- Selfie Photo -->
      <div class="upload-section q-mb-xl">
        <div class="text-body2 text-weight-medium q-mb-md">Selfie Photo</div>

        <div class="upload-area selfie-area" :class="{ 'has-image': selfieImage }" @click="openSelfieCamera">
          <div v-if="!selfieImage" class="upload-placeholder">
            <q-icon name="face" size="40px" color="gold" />
            <div class="text-body2 text-grey-6 q-mt-sm">Take a selfie</div>
          </div>

          <div v-else class="image-preview">
            <img :src="selfieImageUrl" alt="Selfie" class="uploaded-image" />
            <q-btn round icon="close" size="sm" color="red" class="remove-btn" @click.stop="removeSelfieImage" />
          </div>
        </div>
      </div>

      <!-- Next Button -->
      <q-btn :label="isSubmitting ? 'Submitting...' : 'Submit Documents'"
        :color="canProceed && !isSubmitting ? 'gold' : 'grey-5'" text-color="white" no-caps unelevated
        :disable="!canProceed || isSubmitting" :loading="isSubmitting" class="full-width next-btn"
        @click="proceedToNext" />

      <!-- Hidden File Inputs -->
      <input ref="frontFileInput" type="file" accept="image/*" style="display: none" @change="handleFrontImageSelect" />
      <input ref="backFileInput" type="file" accept="image/*" style="display: none" @change="handleBackImageSelect" />
    </div>

    <!-- Camera Modal -->
    <q-dialog v-model="showCamera" persistent>
      <q-card class="camera-card">
        <q-card-section class="text-center">
          <div class="text-h6 q-mb-md">
            {{ cameraMode === 'front' ? 'Take Front ID Photo' :
              cameraMode === 'back' ? 'Take Back ID Photo' : 'Take Your Selfie' }}
          </div>

          <!-- Camera Video -->
          <div class="camera-container">
            <video ref="videoElement" autoplay playsinline class="camera-video"></video>

            <!-- Camera overlay with dynamic guidance -->
            <div class="camera-overlay">
              <div v-if="cameraMode === 'selfie'" class="selfie-frame">
                <q-icon name="face" size="60px" color="gold" class="face-guide" />
              </div>
              <div v-else class="id-frame">
                <div class="corner top-left"></div>
                <div class="corner top-right"></div>
                <div class="corner bottom-left"></div>
                <div class="corner bottom-right"></div>
                <div class="id-guide-text">
                  {{ cameraMode === 'front' ? 'Front ID' : 'Back ID' }}
                </div>
              </div>
            </div>
          </div>

          <!-- Hidden canvas for capturing -->
          <canvas ref="canvasElement" style="display: none;"></canvas>
        </q-card-section>

        <q-card-actions align="center" class="q-pa-md">
          <!-- Capture Button -->
          <q-btn round size="lg" color="gold" icon="camera" @click="capturePhoto" class="capture-btn" />

          <!-- Cancel Button -->
          <q-btn flat label="Cancel" color="grey-7" @click="closeCamera" class="q-ml-md" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/auth-store'
import { Notify } from 'quasar'

const router = useRouter()
const authStore = useAuthStore()

// Refs
const frontFileInput = ref(null)
const backFileInput = ref(null)
const frontImage = ref(null)
const backImage = ref(null)
const frontImageUrl = ref('')
const backImageUrl = ref('')
const selfieImage = ref(null)
const selfieImageUrl = ref('')
const isSubmitting = ref(false)

// Camera refs
const videoElement = ref(null)
const canvasElement = ref(null)
const showCamera = ref(false)
const cameraStream = ref(null)
const cameraMode = ref('selfie') // 'front', 'back', 'selfie'

// Computed
const canProceed = computed(() => {
  return frontImage.value && backImage.value && selfieImage.value
})

/*
const isAuthorized = computed(() => {
  return authStore.isLoggedIn
})
*/

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

const removeSelfieImage = () => {
  selfieImage.value = null
  selfieImageUrl.value = ''
}

// Camera Methods
const openFrontCamera = () => {
  cameraMode.value = 'front'
  openCamera()
}

const openBackCamera = () => {
  cameraMode.value = 'back'
  openCamera()
}

const openSelfieCamera = () => {
  cameraMode.value = 'selfie'
  openCamera()
}

const openCamera = async () => {
  try {
    showCamera.value = true

    // Wait for dialog to open
    await new Promise(resolve => setTimeout(resolve, 100))

    // Configure camera based on mode
    const cameraConfig = {
      video: {
        width: { ideal: cameraMode.value === 'selfie' ? 640 : 1280 },
        height: { ideal: cameraMode.value === 'selfie' ? 480 : 720 }
      }
    }

    // Use front camera for selfie, back camera for ID documents
    if (cameraMode.value === 'selfie') {
      cameraConfig.video.facingMode = 'user' // Front camera
    } else {
      cameraConfig.video.facingMode = 'environment' // Back camera
    }

    const stream = await navigator.mediaDevices.getUserMedia(cameraConfig)
    cameraStream.value = stream

    if (videoElement.value) {
      videoElement.value.srcObject = stream
    }

  } catch (error) {
    console.error('Camera access denied:', error)
    showCamera.value = false
  }
}

const capturePhoto = () => {
  if (!videoElement.value || !canvasElement.value) return

  const video = videoElement.value
  const canvas = canvasElement.value
  const context = canvas.getContext('2d')

  // Set canvas dimensions to match video
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight

  // Draw the current video frame to canvas
  context.drawImage(video, 0, 0, canvas.width, canvas.height)

  // Convert canvas to blob
  canvas.toBlob((blob) => {
    if (blob) {
      // Create file from blob with appropriate name
      const fileName = `${cameraMode.value}_${Date.now()}.jpg`
      const file = new File([blob], fileName, {
        type: 'image/jpeg'
      })

      // Create URL for preview
      const imageUrl = URL.createObjectURL(blob)

      // Set the captured image based on mode
      if (cameraMode.value === 'front') {
        frontImage.value = file
        frontImageUrl.value = imageUrl
      } else if (cameraMode.value === 'back') {
        backImage.value = file
        backImageUrl.value = imageUrl
      } else if (cameraMode.value === 'selfie') {
        selfieImage.value = file
        selfieImageUrl.value = imageUrl
      }

      // Close camera
      closeCamera()
    }
  }, 'image/jpeg', 0.8)
}

const closeCamera = () => {
  // Stop camera stream
  if (cameraStream.value) {
    cameraStream.value.getTracks().forEach(track => {
      track.stop()
    })
    cameraStream.value = null
  }

  showCamera.value = false
}

const proceedToNext = async () => {
  if (!canProceed.value || isSubmitting.value) return

  isSubmitting.value = true

  try {
    const kycData = new FormData()
    kycData.append('id_front', frontImage.value)
    kycData.append('id_back', backImage.value)
    kycData.append('selfie', selfieImage.value)

    await authStore.submitKyc(kycData)

    Notify.create({
      type: 'positive',
      message: 'Documents submitted successfully!',
      position: 'top-right'
    })

    router.push('/uploaded-documents')
  } catch (error) {
    console.error('KYC submission failed:', error)

    const fallback = 'Failed to submit documents. Please try again.'
    const message = error.response?.data?.message || error.response?.data?.detail || error.message || fallback

    Notify.create({
      type: 'negative',
      message,
      position: 'top-right'
    })
  } finally {
    isSubmitting.value = false
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

/* Upload options styling */
.upload-options {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-top: 8px;
}

/* Selfie area styling */
.selfie-area {
  border-color: #4CAF50;
  background: rgba(76, 175, 80, 0.05);
}

.selfie-area:hover {
  background: rgba(76, 175, 80, 0.1);
  border-color: #45a049;
}

/* Camera Styles */
.camera-card {
  width: 90vw;
  max-width: 400px;
  max-height: 90vh;
}

.camera-container {
  position: relative;
  width: 100%;
  max-width: 320px;
  margin: 0 auto;
  border-radius: 12px;
  overflow: hidden;
  background: #000;
}

.camera-video {
  width: 100%;
  height: auto;
  display: block;
}

.camera-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.selfie-frame {
  position: relative;
  width: 200px;
  height: 200px;
  border: 3px solid rgba(253, 200, 42, 0.8);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.1);
}

.face-guide {
  opacity: 0.7;
}

.id-frame {
  position: relative;
  width: 80%;
  height: 60%;
  border: 2px solid rgba(253, 200, 42, 0.8);
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.corner {
  position: absolute;
  width: 20px;
  height: 20px;
  border: 3px solid #FDC82A;
}

.corner.top-left {
  top: -3px;
  left: -3px;
  border-right: none;
  border-bottom: none;
}

.corner.top-right {
  top: -3px;
  right: -3px;
  border-left: none;
  border-bottom: none;
}

.corner.bottom-left {
  bottom: -3px;
  left: -3px;
  border-right: none;
  border-top: none;
}

.corner.bottom-right {
  bottom: -3px;
  right: -3px;
  border-left: none;
  border-top: none;
}

.id-guide-text {
  color: #FDC82A;
  font-weight: bold;
  font-size: 16px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
}

.capture-btn {
  width: 70px !important;
  height: 70px !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

/* Dark theme support */
.body--dark .upload-area {
  background: rgba(253, 200, 42, 0.1);
}

.body--dark .upload-area:hover {
  background: rgba(253, 200, 42, 0.15);
}

.body--dark .selfie-area {
  background: rgba(76, 175, 80, 0.1);
}

.body--dark .selfie-area:hover {
  background: rgba(76, 175, 80, 0.15);
}

.body--dark .next-btn[disabled] {
  background: #424242 !important;
  color: #757575 !important;
}

.body--dark .camera-card {
  background: #1E1E1E;
}
</style>
