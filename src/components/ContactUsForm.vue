<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <q-page class="q-pa-md bg-brand">
    <!-- Header -->
    <div class="row items-center q-mb-lg">
      <q-btn flat round icon="arrow_back" color="grey-7" @click="goBack" />
      <div class="text-h5 text-weight-bold q-ml-sm">Contact us</div>
    </div>

    <div class="page-content">
      <!-- Form Description -->
      <div class="text-body2 text-grey-6 q-mb-lg form-description">
        Please fill out the form below to get in touch with us.
      </div>

      <!-- Contact Form -->
      <div class="contact-form">
        <!-- Select Subject -->
        <div class="q-mb-md">
          <label class="text-body2 text-weight-medium q-mb-sm block">Select Subject</label>
          <q-input v-model="selectedSubjectDisplay" placeholder="Select Subject" filled readonly
            class="form-select cursor-pointer" @click="showSubjectDialog = true">
            <template v-slot:append>
              <q-icon name="keyboard_arrow_down" class="cursor-pointer subject-arrow"
                @click="showSubjectDialog = true" />
            </template>
          </q-input>
        </div>

        <!-- Subject Selection Dialog -->
        <q-dialog v-model="showSubjectDialog" position="bottom">
          <q-card class="subject-dialog">
            <q-card-section class="q-pb-none">
              <div class="text-center">
                <div class="dialog-handle"></div>
              </div>
              <div class="text-h6 text-weight-medium q-mt-md">Select Subject</div>
            </q-card-section>

            <q-card-section>
              <q-option-group v-model="selectedSubject" :options="subjectOptionsWithLabels" color="gold" type="radio"
                class="subject-options" />
            </q-card-section>

            <q-card-section class="q-pt-none">
              <q-btn label="Confirm" color="gold" text-color="white" no-caps unelevated class="full-width confirm-btn"
                @click="confirmSubject" />
            </q-card-section>
          </q-card>
        </q-dialog>

        <!-- File Upload -->
        <div class="q-mb-md">
          <label class="text-body2 text-grey-6 q-mb-sm q-mt-lg block file-label">
            If you have any relevant images or screenshots, please upload them here. (Optional)
          </label>
          <q-file v-model="attachedFile" filled class="form-file">
            <template v-slot:prepend>
              <q-icon name="attach_file" class="file-clickable" />
            </template>
            <template v-slot:append>
              <span v-if="!attachedFile" class="file-placeholder file-clickable">Select attachment</span>
              <q-icon v-else name="refresh" class="cursor-pointer" @click.stop="attachedFile = null" />
            </template>
          </q-file>
        </div>

        <!-- Message -->
        <div class="q-mb-xl">
          <label class="text-body2 text-weight-medium q-mb-sm q-mt-lg block">Write Your Message</label>
          <q-input v-model="message" type="textarea" placeholder="Write your message here" filled rows="6"
            class="form-textarea" />
        </div>

        <!-- Send Button -->
        <q-btn label="Send" color="gold" text-color="white" no-caps unelevated class="full-width send-btn"
          @click="sendTicket" />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useSupportStore } from 'src/stores/support-store'
import { useQuasar } from 'quasar'

// Define emits
const emit = defineEmits(['close', 'ticket-sent'])

// Reactive data
const selectedSubject = ref(null)
const selectedSubjectDisplay = ref('')
const attachedFile = ref(null)
const message = ref('')
const showSubjectDialog = ref(false)

// Subject options with labels and values for radio buttons
const subjectOptionsWithLabels = [
  { label: 'Wallet Management', value: 'wallet' },
  { label: 'Selling Gold', value: 'selling' },
  { label: 'Buying Gold', value: 'buying' },
  { label: 'Orders', value: 'orders' }
]

const $q = useQuasar()

// Methods
const goBack = () => {
  emit('close')
}

const confirmSubject = () => {
  if (selectedSubject.value) {
    const selectedOption = subjectOptionsWithLabels.find(option => option.value === selectedSubject.value)
    selectedSubjectDisplay.value = selectedOption?.label || ''
  }
  showSubjectDialog.value = false
}

const sendTicket = async () => {
  if (!selectedSubject.value || !message.value.trim()) {
    // Show validation message
    return
  }

  const ticketData = {
    subject: selectedSubjectDisplay.value,
    description: message.value
  }

  try {
    await useSupportStore().createSupportTicket(ticketData)
    emit('ticket-sent', ticketData)
    // Reset form fields
    selectedSubject.value = null
    selectedSubjectDisplay.value = ''
    attachedFile.value = null
    message.value = ''
    // Show popup message
    $q.notify({
      type: 'positive',
      message: 'Your complaint has been sent and will be replied to within 24 hours.',
      position: 'top',
      timeout: 3000
    })
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to send complaint. Please try again.',
      position: 'top',
      timeout: 3000
    })
    console.error('Failed to send ticket:', error)
  }
}

</script>

<style scoped>
.page-content {
  width: 90%;
  margin: 0 auto;
}

.form-description {
  line-height: 1.5;
}

.contact-form {
  max-width: 100%;
}

.block {
  display: block;
}

.file-label {
  font-size: 12px;
  line-height: 1.4;
}

.file-placeholder {
  color: #9E9E9E;
  font-size: 16px;
  padding: 12px 0;
}

.file-clickable {
  pointer-events: none;
}

.form-file {
  cursor: pointer;
}

.form-file :deep(.q-field__control) {
  cursor: pointer;
}

.form-file :deep(.q-field__prepend),
.form-file :deep(.q-field__append) {
  pointer-events: none;
}

.subject-arrow {
  pointer-events: auto;
}

/* Form styling */
.form-select :deep(.q-field__control),
.form-file :deep(.q-field__control),
.form-textarea :deep(.q-field__control) {
  border-radius: 8px;
  background: #f8f8f8;
}

.form-select :deep(.q-field__native),
.form-file :deep(.q-field__native) {
  padding: 12px 16px;
  color: #9E9E9E;
}

.form-textarea :deep(.q-field__native) {
  padding: 16px;
  min-height: 120px;
  resize: vertical;
}

/* Send Button */
.send-btn {
  height: 48px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  background: #FDC82A !important;
}

/* Subject Dialog */
.subject-dialog {
  border-radius: 16px 16px 0 0;
  max-width: 100%;
}

.dialog-handle {
  width: 40px;
  height: 4px;
  background: #E0E0E0;
  border-radius: 2px;
  margin: 8px auto;
}

.subject-options {
  gap: 16px;
}

.subject-options :deep(.q-radio) {
  padding: 12px 0;
  width: 100%;
}

.subject-options :deep(.q-radio__label) {
  font-size: 16px;
  font-weight: 400;
}

.subject-options :deep(.q-radio__inner) {
  color: #FDC82A;
}

.confirm-btn {
  height: 48px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  background: #FDC82A !important;
  margin-top: 16px;
}

/* Dark theme support */
.body--dark .form-select :deep(.q-field__control),
.body--dark .form-file :deep(.q-field__control),
.body--dark .form-textarea :deep(.q-field__control) {
  background: #2d2d2d !important;
}

.body--dark .form-select :deep(.q-field__native),
.body--dark .form-file :deep(.q-field__native),
.body--dark .form-textarea :deep(.q-field__native) {
  color: #fff !important;
}
</style>
