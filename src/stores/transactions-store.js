import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'boot/axios'
import { useUsersStore } from './users-store' // Import to update balance after buy

export const useTransactionsStore = defineStore('transactions', {
  state: () => ({
    // History
    transactionHistory: [],
    nextPage: null,

    // Cart (New)
    cart: {
      items: [],
      total_cart_price: 0,
    },

    // UI States
    loading: false,
    cartLoading: false,
    error: null,
  }),

  getters: {
    // History Getters
    transactionsCount: (state) => state.transactionHistory.length,
    recentTransactions: (state) => {
      return [...state.transactionHistory]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 10)
    },

    // Cart Getters
    cartItemCount: (state) => {
      return state.cart.items?.reduce((total, item) => total + item.quantity, 0) || 0
    },
    cartTotal: (state) => state.cart.total_cart_price || 0,
    cartItems: (state) => state.cart.items || [],
  },

  actions: {
    // --- HISTORY ACTIONS ---

    async fetchTransactionHistory() {
      this.loading = true
      this.error = null

      try {
        const response = await api.get('/api/transactions/history/')

        if (response.data.results) {
          this.transactionHistory = response.data.results
          this.nextPage = response.data.next
        } else {
          this.transactionHistory = response.data
        }
        return this.transactionHistory
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch history'
        console.error(error)
      } finally {
        this.loading = false
      }
    },

    // --- CART ACTIONS (New) ---

    async fetchCart() {
      this.cartLoading = true
      try {
        // GET /api/transactions/cart/
        // Returns: { id, items: [...], total_cart_price: 1234 }
        const response = await api.get('/api/transactions/cart/')
        this.cart = response.data
        return this.cart
      } catch (error) {
        console.error('Fetch Cart Error:', error)
        // Don't set global error for cart fetch, just log it
      } finally {
        this.cartLoading = false
      }
    },

    async addToCart(payload) {
      // Payload: { product_id: 1, quantity: 2 }
      this.cartLoading = true
      this.error = null
      try {
        await api.post('/api/transactions/cart/add/', payload)
        // Refresh cart to get updated prices and structure
        await this.fetchCart()
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to add to cart'
        throw error
      } finally {
        this.cartLoading = false
      }
    },

    async removeFromCart(itemId) {
      // Payload: { item_id: 5 } -> The ID of the CartItem (not product)
      this.cartLoading = true
      try {
        await api.post('/api/transactions/cart/remove/', { item_id: itemId })
        await this.fetchCart()
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to remove item'
        throw error
      } finally {
        this.cartLoading = false
      }
    },

    async clearCart() {
      this.cartLoading = true
      try {
        await api.post('/api/transactions/cart/clear/')
        this.cart = { items: [], total_cart_price: 0 }
      } catch (error) {
        console.error(error)
      } finally {
        this.cartLoading = false
      }
    },

    // --- BUY / SELL ACTIONS ---

    async buyTransaction(buyPayload) {
      // Payload: { pin: "1234", items: [...], coupon_code: "..." }
      this.loading = true
      this.error = null

      try {
        const response = await api.post('/api/transactions/buy/', buyPayload)

        // 1. Add to history
        const newTx = {
          ...response.data,
          created_at: new Date().toISOString(),
          type: 'buy',
        }
        this.transactionHistory.unshift(newTx)

        // 2. Refresh User Balance (Crucial)
        const userStore = useUsersStore()
        await userStore.fetchCurrentUser()

        // 3. Clear Cart (Since purchase succeeded)
        await this.fetchCart()

        return response.data
      } catch (error) {
        this.error = error.response?.data?.error || 'Buy transaction failed'
        throw error
      } finally {
        this.loading = false
      }
    },

    async sellTransaction(sellPayload) {
      this.loading = true
      this.error = null

      try {
        const response = await api.post('/api/transactions/sell/', sellPayload)

        this.transactionHistory.unshift({
          ...response.data,
          created_at: new Date().toISOString(),
          type: 'sell',
        })

        // Refresh balance
        const userStore = useUsersStore()
        await userStore.fetchCurrentUser()

        return response.data
      } catch (error) {
        this.error = error.response?.data?.error || 'Sell transaction failed'
        throw error
      } finally {
        this.loading = false
      }
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTransactionsStore, import.meta.hot))
}
