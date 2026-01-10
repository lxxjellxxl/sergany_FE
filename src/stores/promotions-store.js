import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'boot/axios'

export const usePromotionsStore = defineStore('promotions', {
  state: () => ({
    referralInfo: null,
    couponValidation: null,
    loading: false,
    error: null,
  }),

  getters: {
    referralCode: (state) => state.referralInfo?.referral_code || '',
    referralLink: (state) => state.referralInfo?.referral_link || '',
    totalReferrals: (state) => state.referralInfo?.total_referrals || 0,
    referralEarnings: (state) => state.referralInfo?.total_earnings || 0,
    isValidCoupon: (state) => state.couponValidation?.valid || false,
  },

  actions: {
    async fetchReferralInfo() {
      this.loading = true
      this.error = null

      try {
        const response = await api.get('/promotions/referral-info/')
        this.referralInfo = response.data
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch referral info'
        throw error
      } finally {
        this.loading = false
      }
    },

    async validateCoupon(couponCode) {
      this.loading = true
      this.error = null

      try {
        const response = await api.post('/promotions/validate-coupon/', {
          coupon_code: couponCode,
        })
        this.couponValidation = response.data
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Coupon validation failed'
        this.couponValidation = { valid: false, error: this.error }
        throw error
      } finally {
        this.loading = false
      }
    },

    clearCouponValidation() {
      this.couponValidation = null
      this.error = null
    },

    clearReferralInfo() {
      this.referralInfo = null
      this.error = null
    },

    clearAll() {
      this.referralInfo = null
      this.couponValidation = null
      this.error = null
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePromotionsStore, import.meta.hot))
}
