<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <q-page class="q-pa-md bg-brand">
    <!-- Header -->
    <div class="row items-center q-mb-lg">
      <q-btn flat round icon="arrow_back" color="grey-7" @click="goBack" />
      <div class="text-h5 text-weight-bold q-ml-sm">FAQ</div>
    </div>

    <!-- Search Bar -->
    <q-input v-model="searchQuery" filled placeholder="Search" class="q-mb-lg search-input">
      <template v-slot:prepend>
        <q-icon name="search" color="grey-5" />
      </template>
    </q-input>

    <!-- Popular Topics -->
    <div class="text-body2 text-grey-6 q-mb-md">Popular Topics</div>

    <!-- FAQ Items -->
    <div class="faq-list">
      <!-- No results message -->
      <div v-if="filteredFAQs.length === 0 && searchQuery.trim()" class="text-center q-pa-lg">
        <div class="text-body1 text-grey-6">No FAQs found matching "{{ searchQuery }}"</div>
        <div class="text-body2 text-grey-5 q-mt-sm">Try different keywords</div>
      </div>

      <!-- Dynamic FAQ Items -->
      <q-card v-for="faq in filteredFAQs" :key="faq.id" class="faq-item q-mb-sm rounded-small-borders">
        <q-expansion-item expand-separator expand-icon="expand_more" expanded-icon="expand_less"
          expand-icon-class="text-gold" header-class="text-weight-medium text-body2 q-py-md" class="faq-expansion">
          <template v-slot:header>
            <q-item-section>
              <q-item-label class="text-weight-medium text-body2">{{ faq.question }}</q-item-label>
            </q-item-section>
          </template>

          <q-card-section class="q-pt-none">
            <div class="text-body2 text-grey-7">
              {{ faq.answer }}
            </div>
          </q-card-section>
        </q-expansion-item>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Reactive data
const searchQuery = ref('')

// FAQ data
const faqItems = ref([
  {
    id: 1,
    question: "What is Sergany?",
    answer: "Sergany is a digital gold investment platform that allows you to buy, sell, and store gold digitally with complete security and transparency."
  },
  {
    id: 2,
    question: "Is my money safe on Sergany?",
    answer: "Yes, your money is completely safe. We use bank-level security measures and your gold is stored in secure vaults with full insurance coverage."
  },
  {
    id: 3,
    question: "How much gold can I buy?",
    answer: "You can buy gold starting from as little as 1 EGP. There's no maximum limit, allowing you to invest according to your budget and financial goals."
  },
  {
    id: 4,
    question: "Can I request my gold ingots?",
    answer: "Yes, you can request physical delivery of your gold in the form of ingots or coins. Delivery charges may apply based on your location."
  },
  {
    id: 5,
    question: "How can I contact Sergany customer support?",
    answer: "You can contact our customer support through the app's contact form, email support@sergany.com, or call our helpline during business hours."
  },
  {
    id: 6,
    question: "How does Sergany work?",
    answer: "Sergany allows you to buy gold digitally at live market prices. Your gold is stored securely in our vaults and you can sell it anytime at current market rates."
  },
  {
    id: 7,
    question: "What is a gold ingot?",
    answer: "A gold ingot is a pure gold bar that is cast into a convenient shape for storage, transport, and trading. It represents physical gold ownership."
  },
  {
    id: 8,
    question: "Can I sell my gold ingots at any time?",
    answer: "Yes, you can sell your gold holdings at any time during market hours at the current live gold price. The process is instant and secure."
  }
])

// Computed property for filtered FAQs
const filteredFAQs = computed(() => {
  if (!searchQuery.value.trim()) {
    return faqItems.value
  }

  const query = searchQuery.value.toLowerCase().trim()
  return faqItems.value.filter(item =>
    item.question.toLowerCase().includes(query) ||
    item.answer.toLowerCase().includes(query)
  )
})

// Methods
const goBack = () => {
  router.go(-1)
}
</script>

<style scoped>
.search-input :deep(.q-field__control) {
  border-radius: 8px;
}

.search-input :deep(.q-field__native) {
  padding: 12px 16px;
}

.faq-item {
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
  margin-bottom: 20px;
  box-shadow: none !important;
}

.faq-item:hover {
  border-color: #FDC82A;
}

/* Gold color for expansion arrows */
.text-gold {
  color: #FDC82A !important;
}

/* Remove grey background on q-expansion-item hover */
.faq-item :deep(.q-expansion-item__toggle-icon),
.faq-item :deep(.q-expansion-item__container),
.faq-item :deep(.q-item) {
  background-color: transparent !important;
}

.faq-item :deep(.q-item):hover {
  background-color: transparent !important;
}

/* Dark theme styling */
.body--dark .search-input :deep(.q-field__control) {
  background: #2d2d2d !important;
}
</style>
