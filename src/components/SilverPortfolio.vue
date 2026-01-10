<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <!-- Portfolio Balance Card -->
  <q-card class="q-mb-lg rounded-borders-lg shadow-2" flat>
    <q-card-section>
      <div class="row items-start justify-between q-mb-md">
        <div>
          <div class="row items-baseline q-gutter-xs">
            <div class="text-h3 text-weight-bold text-grey-8">{{ balanceVisible ? '0' : '*****' }}</div>
            <div class="text-grey-6 text-body2">Gram</div>
          </div>
          <div class="row items-baseline q-gutter-xs q-mt-sm">
            <div class="text-h6 text-grey-8">≈ {{ balanceVisible ? '0' : '*****' }}</div>
            <div class="text-grey-6 text-caption">EGP</div>
          </div>
        </div>
        <div class="text-right">
          <div class="text-grey-6 text-caption">06 Dec 2025 - 03:11 PM</div>
          <div class="text-grey-6 text-caption q-mt-xs">{{ balanceVisible ? '0' : '***' }} % ({{ balanceVisible ? '0' :
            '***' }} EGP)</div>
        </div>
      </div>

      <q-btn flat dense no-caps :icon="balanceVisible ? 'visibility_off' : 'visibility'"
        :label="balanceVisible ? 'Hide Balance' : 'Show Balance'" color="grey-7" class="text-caption"
        @click="toggleBalance" />
    </q-card-section>
  </q-card>

  <!-- Empty State -->
  <div class="column items-center justify-center q-pt-sm">
    <div class="empty-placeholder q-mb-md">
      <q-icon name="account_balance_wallet" size="90px" color="grey-4" />
    </div>

    <div class="text-h6 text-weight-medium text-grey-8 q-mb-sm">
      Ready to Own Silver?
    </div>

    <div class="text-body2 text-grey-6 text-center q-mb-lg" style="max-width: 280px">
      You don't have any silver right now. Tap below to add your first silver.
    </div>

    <q-btn unelevated no-caps label="Buy Silver Now!" color="grey-8" text-color="white"
      class="q-px-xl q-py-sm text-weight-medium" rounded @click="buySilver" />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

// Props from parent
defineProps({
  balanceVisible: {
    type: Boolean,
    default: true
  }
})

// Emits to parent
const emit = defineEmits(['toggleBalance'])

function buySilver() {
  router.push('/')
}

function toggleBalance() {
  emit('toggleBalance')
}
</script>

<style scoped>
.rounded-borders-lg {
  border-radius: 16px;
}

.empty-placeholder {
  width: 150px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f5f5 0%, #d3d3d3 100%);
  border-radius: 50%;
}
</style>
