<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <q-page class="q-pa-md bg-brand">
    <!-- Header -->
    <div class="row items-center q-mb-lg">
      <q-btn flat round icon="arrow_back" color="grey-7" @click="goBack" />
      <div class="text-h5 text-weight-bold q-ml-sm">Identity Verification</div>
    </div>

    <div class="page-content">
      <!-- Phone Illustration -->
      <div class="illustration-container q-mb-xl">
        <div class="phone-container">
          <div class="phone-frame">
            <div class="phone-screen">
              <div class="profile-icon">
                <q-avatar size="30px" class="bg-amber-3">
                  <q-icon name="person" color="amber-8" size="20px" />
                </q-avatar>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Content Section -->
      <div class="content-section">
        <!-- Main Title -->
        <div class="text-h6 text-weight-bold q-mb-md">Why verify your identity?</div>

        <!-- Description -->
        <div class="text-body2 text-grey-7 q-mb-xl description-text">
          Verifying your identity helps us keep your account secure, protect your personal information, and ensure that
          only you have access to your transactions and services.
        </div>

        <!-- Requirements Section -->
        <div class="text-h6 text-weight-medium q-mb-md">Identity Verification Requirements:</div>

        <!-- Requirements List -->
        <div class="requirements-list q-mb-xl">
          <div class="requirement-item q-mb-md">
            <div class="requirement-bullet"></div>
            <div class="requirement-text">
              You must provide a valid government-issued ID to complete the identity verification process.
            </div>
          </div>

          <div class="requirement-item q-mb-md">
            <div class="requirement-bullet"></div>
            <div class="requirement-text">
              Ensure that the photos of your ID are clear and show all details without any blur or obstruction. Both
              front
              and back of the ID must be visible.
            </div>
          </div>

          <div class="requirement-item q-mb-md">
            <div class="requirement-bullet"></div>
            <div class="requirement-text">
              Ensure that your ID is not expired. Only valid, up-to-date documentation will be accepted for
              verification.
            </div>
          </div>

          <div class="requirement-item q-mb-md">
            <div class="requirement-bullet"></div>
            <div class="requirement-text">
              You be asked to take a selfie while holding your ID to further verify your identity. Make sure your face
              and
              ID are clearly visible.
            </div>
          </div>

          <div class="requirement-item">
            <div class="requirement-bullet"></div>
            <div class="requirement-text">
              Verification will be rejected if any submitted documents appear tampered with, altered, or manipulated in
              any way.
            </div>
          </div>
        </div>

        <!-- Next Button -->
        <q-btn label="Next" color="gold" text-color="white" no-caps unelevated class="full-width next-btn"
          @click="proceedToUpload" />
      </div>
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

const proceedToUpload = () => {
  router.push('/submit-id')
}
</script>

<style scoped>
.page-content {
  width: 90%;
  margin: 0 auto;
}

/* Illustration Container */
.illustration-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  margin: 40px 0;
}

.phone-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.phone-frame {
  width: 60px;
  height: 100px;
  background: #333;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
}

.phone-screen {
  width: 50px;
  height: 80px;
  background: #FDC82A;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.profile-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.hand-illustration {
  position: absolute;
  bottom: -20px;
  left: -10px;
  width: 80px;
  height: 60px;
  background: #F4A261;
  border-radius: 20px 20px 10px 10px;
  transform: rotate(-15deg);
  z-index: 1;
}

.hand-illustration::before {
  content: '';
  position: absolute;
  top: 10px;
  right: -5px;
  width: 15px;
  height: 30px;
  background: #F4A261;
  border-radius: 8px;
  transform: rotate(20deg);
}

.hand-illustration::after {
  content: '';
  position: absolute;
  top: 15px;
  right: -15px;
  width: 12px;
  height: 25px;
  background: #F4A261;
  border-radius: 6px;
  transform: rotate(40deg);
}

/* Content Section */
.content-section {
  max-width: 100%;
}

.description-text {
  line-height: 1.6;
}

/* Requirements List */
.requirements-list {
  margin-left: 0;
}

.requirement-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 16px;
}

.requirement-bullet {
  width: 6px;
  height: 6px;
  background-color: #333;
  border-radius: 50%;
  margin-top: 8px;
  margin-right: 12px;
  flex-shrink: 0;
}

.requirement-text {
  flex: 1;
  font-size: 14px;
  line-height: 1.5;
  color: #666;
}

/* Next Button */
.next-btn {
  height: 48px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  background: #FDC82A !important;
  margin-top: 20px;
}

/* Dark theme support */
.body--dark .requirement-bullet {
  background-color: #fff;
}

.body--dark .requirement-text {
  color: #bbb;
}

.body--dark .phone-frame {
  background: #555;
}
</style>
