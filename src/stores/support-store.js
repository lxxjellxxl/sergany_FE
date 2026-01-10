import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'boot/axios'

export const useSupportStore = defineStore('support', {
  state: () => ({
    supportTickets: [],
    mySupportTickets: [],
    closedSupportTickets: [],
    loading: false,
    error: null,
  }),

  getters: {
    ticketsCount: (state) => state.supportTickets.length,
    openTickets: (state) => state.supportTickets.filter((ticket) => ticket.status === 'open'),
    closedTickets: (state) => state.supportTickets.filter((ticket) => ticket.status === 'closed'),
    ticketsByPriority: (state) => {
      return state.supportTickets.reduce((acc, ticket) => {
        const priority = ticket.priority || 'normal'
        if (!acc[priority]) acc[priority] = []
        acc[priority].push(ticket)
        return acc
      }, {})
    },
  },

  actions: {
    async fetchSupportTickets({ page = 1 } = {}) {
      this.loading = true
      this.error = null

      try {
        // Add page param to API call
        const response = await api.get(`/api/support/?page=${page}`)
        // Ensure supportTickets is always an array
        this.supportTickets = Array.isArray(response.data.results)
          ? response.data.results
          : Array.isArray(response.data)
            ? response.data
            : []
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch support tickets'
        throw error
      } finally {
        this.loading = false
      }
    },


    async fetchUserSupportTickets(userId) {
      this.loading = true
      this.error = null

      try {
        const response = await api.get(`/api/support/user/${userId}/`)
        this.mySupportTickets = Array.isArray(response.data.results)
          ? response.data.results
          : Array.isArray(response.data)
            ? response.data
            : []
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch user support tickets'
        throw error
      } finally {
        this.loading = false
      }
    },



    async createSupportTicket(ticketData) {
      this.loading = true
      this.error = null

      try {
        const response = await api.post('/api/support/', ticketData)
        // Ensure supportTickets is always an array before unshift
        if (!Array.isArray(this.supportTickets)) {
          this.supportTickets = []
        }
        this.supportTickets.unshift(response.data)
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to create support ticket'
        throw error
      } finally {
        this.loading = false
      }
    },

    getTicketById(ticketId) {
      return this.supportTickets.find((ticket) => ticket.id === ticketId)
    },

    updateTicketStatus(ticketId, status) {
      const ticket = this.supportTickets.find((t) => t.id === ticketId)
      if (ticket) {
        ticket.status = status
      }
    },

    clearSupportTickets() {
      this.supportTickets = []
      this.error = null
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSupportStore, import.meta.hot))
}
