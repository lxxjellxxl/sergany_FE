import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'boot/axios'

export const useInventoryStore = defineStore('inventory', {
  state: () => ({
    products: [],
    loading: false,
    error: null,
  }),

  getters: {
    productsCount: (state) => state.products.length,

    // Fixed: Logic changed from comma (,) to AND (&&)
    availableGoldProducts: (state) =>
      state.products.filter(
        (product) => product.is_active === true && product.metal_type === 'GOLD',
      ),

    availableSilverProducts: (state) =>
      state.products.filter(
        (product) => product.is_active === true && product.metal_type === 'SILVER',
      ),

    // Helper: Returns true if we have physical bars in the safe
    hasStock: (state) => (productId) => {
      const product = state.products.find((p) => p.id === productId)
      return product && product.available_stock > 0
    },
  },

  actions: {
    async fetchProducts() {
      this.loading = true
      this.error = null

      try {
        const response = await api.get('/api/inventory/products/')

        // Safety Check: Django might return { results: [...] } or just [...]
        const results = Array.isArray(response.data) ? response.data : response.data.results

        this.products = results || []
        return this.products
      } catch (error) {
        console.error('Inventory Fetch Error:', error)
        this.error = error.response?.data?.message || 'Failed to fetch products'
        // Don't throw here if you want the UI to just show an empty state instead of crashing
      } finally {
        this.loading = false
      }
    },

    getProductById(productId) {
      return this.products.find((product) => product.id === productId)
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useInventoryStore, import.meta.hot))
}
