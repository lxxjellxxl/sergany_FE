import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'boot/axios'

export const useMarketStore = defineStore('market', {
  state: () => ({
    rates: [], // Stores raw data from backend
    loading: false,
    error: null,
    lastUpdated: null,
  }),

  getters: {
    // Helper to get Gold Buy/Sell prices easily
    goldRate: (state) => {
      const rate = state.rates.find((r) => r.metal_type === 'GOLD')
      if (!rate) return { buyPrice: 0, sellPrice: 0 }

      return {
        buyPrice: parseFloat(rate.buy_price_per_gram),
        sellPrice: parseFloat(rate.sell_price_per_gram),
        updatedAt: rate.updated_at,
      }
    },

    // Helper to get Silver Buy/Sell prices easily
    silverRate: (state) => {
      const rate = state.rates.find((r) => r.metal_type === 'SILVER')
      if (!rate) return { buyPrice: 0, sellPrice: 0 }

      return {
        buyPrice: parseFloat(rate.buy_price_per_gram),
        sellPrice: parseFloat(rate.sell_price_per_gram),
        updatedAt: rate.updated_at,
      }
    },

    isDataFresh: (state) => {
      if (!state.lastUpdated) return false
      // Data is considered "fresh" for 5 minutes
      const fiveMinutesAgo = Date.now() - 5 * 60 * 1000
      return state.lastUpdated > fiveMinutesAgo
    },
  },

  actions: {
    async fetchRates(forceRefresh = false) {
      // If data is fresh and we already have rates, don't call API
      if (!forceRefresh && this.isDataFresh && this.rates.length > 0) {
        return this.rates
      }

      this.loading = true
      this.error = null

      try {
        const response = await api.get('/api/market/rates/')

        // Safety Check: Handle Pagination
        const results = Array.isArray(response.data) ? response.data : response.data.results

        this.rates = results || []
        this.lastUpdated = Date.now()
        return this.rates
      } catch (error) {
        console.error('Market Rate Error:', error)
        this.error = error.response?.data?.message || 'Failed to fetch market rates'
      } finally {
        this.loading = false
      }
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMarketStore, import.meta.hot))
}
