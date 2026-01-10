import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'boot/axios'

export const useAssetsStore = defineStore('assets', {
  state: () => ({
    myGoldAssets: [],
    loading: false,
    error: null,
  }),

  getters: {
    totalGoldValue: (state) => {
      return state.myGoldAssets.reduce((total, asset) => total + (asset.value || 0), 0)
    },
    goldAssetsCount: (state) => state.myGoldAssets.length,
  },

  actions: {
    async fetchMyGoldAssets() {
      this.loading = true
      this.error = null

      try {
        const response = await api.get('/assets/my-gold/')
        this.myGoldAssets = response.data
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch gold assets'
        throw error
      } finally {
        this.loading = false
      }
    },

    clearAssets() {
      this.myGoldAssets = []
      this.error = null
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAssetsStore, import.meta.hot))
}
