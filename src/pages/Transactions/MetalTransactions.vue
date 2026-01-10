<!-- eslint-disable vue/multi-word-component-names -->
<template>
  HERE
  <q-page class="q-pa-md bg-brand">
    <!-- Header -->
    <div class="row items-center q-mb-lg">
      <q-btn flat round icon="arrow_back" color="grey-7" @click="goBack" />
      <div class="text-h5 text-weight-bold q-ml-sm">Metal Transactions</div>
    </div>

    <!-- Empty Transactions State -->
    <div class="column items-center justify-center full-height">
      <!-- Character Illustration -->
      <div class="character-illustration q-mb-lg">
        <!-- Document/Receipt -->
        <div class="document-container">
          <div class="document">
            <div class="document-header"></div>
            <div class="document-lines">
              <div class="line"></div>
              <div class="line short"></div>
              <div class="line"></div>
            </div>
          </div>
        </div>

        <!-- Character -->
        <div class="character-body">
          <div class="character-head">
            <div class="character-face"></div>
          </div>
          <div class="character-shirt"></div>
          <div class="character-arms">
            <div class="arm-left"></div>
            <div class="arm-right"></div>
          </div>
        </div>

        <!-- Table/Surface -->
        <div class="table-surface"></div>
      </div>

      <!-- Title -->
      <div class="text-h6 text-weight-bold q-mb-md text-center">First time here?</div>

      <!-- Description -->
      <div class="text-body2 text-grey-7 text-center" style="max-width: 300px; line-height: 1.5">
        Your transaction page is all set! We'll update you as soon as you make your first move.
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
</script>

<style scoped>
.full-height {
  min-height: calc(100vh - 140px);
  height: 100%;
  width: 100%;
}

/* Character illustration */
.character-illustration {
  position: relative;
  width: 250px;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Document/Receipt */
.document-container {
  position: absolute;
  top: 20px;
  left: 30px;
  z-index: 1;
}

.document {
  width: 60px;
  height: 80px;
  background: white;
  border: 2px solid #ddd;
  border-radius: 4px;
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.document-header {
  width: 30px;
  height: 8px;
  background: #f39c12;
  margin: 8px auto 6px;
  border-radius: 2px;
}

.document-lines {
  padding: 0 8px;
}

.line {
  height: 2px;
  background: #ddd;
  margin-bottom: 4px;
  border-radius: 1px;
}

.line.short {
  width: 60%;
}

/* Character body */
.character-body {
  position: relative;
  z-index: 2;
}

.character-head {
  width: 60px;
  height: 60px;
  background: #f4c2a1;
  border-radius: 50%;
  position: relative;
  margin: 0 auto 5px;
}

.character-face {
  width: 6px;
  height: 6px;
  background: #333;
  border-radius: 50%;
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  box-shadow:
    -12px 0 0 #333,
    12px 0 0 #333,
    0 15px 0 2px #333;
}

.character-shirt {
  width: 80px;
  height: 100px;
  background: #f39c12;
  border-radius: 20px 20px 10px 10px;
  margin: 0 auto;
  position: relative;
}

.character-shirt::before {
  content: '';
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 10px;
  height: 60px;
  background: #333;
  border-radius: 5px;
}

.character-arms {
  position: absolute;
  top: 70px;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 40px;
}

.arm-left,
.arm-right {
  width: 30px;
  height: 15px;
  background: #f4c2a1;
  border-radius: 15px;
  position: absolute;
  top: 0;
}

.arm-left {
  left: 0;
  transform: rotate(-20deg);
}

.arm-right {
  right: 0;
  transform: rotate(20deg);
}

/* Table/Surface */
.table-surface {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  height: 30px;
  background: linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%);
  border-radius: 50%;
  z-index: 0;
}
</style>
