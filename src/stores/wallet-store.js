import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'boot/axios'

export const useWalletStore = defineStore('wallet', {
  state: () => ({
    banks: [],
    deposits: [],
    walletBalance: 0,
    loading: false,
    error: null,
  }),

  getters: {
    banksCount: (state) => state.banks.length,
    depositsCount: (state) => state.deposits.length,
    totalDeposited: (state) => {
      return state.deposits.reduce((total, deposit) => {
        return total + (deposit.amount || 0)
      }, 0)
    },
    recentDeposits: (state) => {
      return state.deposits
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5)
    },
    pendingDeposits: (state) => {
      return state.deposits.filter((deposit) => deposit.status === 'pending')
    },
    completedDeposits: (state) => {
      return state.deposits.filter((deposit) => deposit.status === 'completed')
    },
  },

  actions: {
    async fetchBanks() {
      this.loading = true
      this.error = null

      try {
        const response = await api.get('/api/wallet/banks/')
        this.banks = response.data
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch banks'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchDeposits() {
      this.loading = true
      this.error = null

      try {
        const response = await api.get('/api/wallet/deposit/')
        this.deposits = response.data
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch deposits'
        throw error
      } finally {
        this.loading = false
      }
    },

    async createDeposit(depositData) {
      this.loading = true
      this.error = null

      try {
        const response = await api.post('/api/wallet/deposit/', depositData)
        this.deposits.unshift(response.data)
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to create deposit'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchMyBalance(pin) {
      this.loading = true
      this.error = null

      try {
        const response = await api.post('/api/wallet/my-balance/', { pin })
        // Optionally update walletBalance if the API returns it
        if (response.data && typeof response.data.balance !== 'undefined') {
          this.walletBalance = response.data.balance
        }
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch wallet balance'
        throw error
      } finally {
        this.loading = false
      }
    },

    getBankById(bankId) {
      return this.banks.find((bank) => bank.id === bankId)
    },

    getDepositById(depositId) {
      return this.deposits.find((deposit) => deposit.id === depositId)
    },

    updateDepositStatus(depositId, status) {
      const deposit = this.deposits.find((d) => d.id === depositId)
      if (deposit) {
        deposit.status = status
      }
    },

    updateWalletBalance(newBalance) {
      this.walletBalance = newBalance
    },

    addToWalletBalance(amount) {
      this.walletBalance += amount
    },

    subtractFromWalletBalance(amount) {
      this.walletBalance = Math.max(0, this.walletBalance - amount)
    },

    clearWalletData() {
      this.banks = []
      this.deposits = []
      this.walletBalance = 0
      this.error = null
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useWalletStore, import.meta.hot))
}
