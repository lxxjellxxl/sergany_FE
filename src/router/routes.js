const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      // --- DASHBOARD (Public-ish within App) ---
      {
        path: '',
        component: () => import('pages/Home/Home.vue'),
        meta: { requiresAuth: true, requiresKYC: true },
      },

      // --- MARKET (Requires KYC) ---
      // Added these so the "Market Validation" works
      {
        path: '/gold',
        component: () => import('pages/Gold/GoldBuy.vue'),
        meta: { requiresAuth: true, requiresKYC: true },
      },
      {
        path: '/silver',
        component: () => import('pages/Silver/SilverBuy.vue'),
        meta: { requiresAuth: true, requiresKYC: true },
      },

      // --- FINANCIALS (Requires KYC) ---
      {
        path: '/wallet',
        component: () => import('pages/Wallet/Wallet.vue'),
        meta: { requiresAuth: true, requiresKYC: true },
      },
      {
        path: '/portfolio',
        component: () => import('pages/Protfolio/Portfolio.vue'),
        meta: { requiresAuth: true, requiresKYC: true },
      },
      {
        path: '/transactions',
        component: () => import('pages/Transactions/MetalTransactions.vue'),
        meta: { requiresAuth: true, requiresKYC: true },
      },

      // --- CHECKOUT (Requires KYC + PIN + Balance) ---
      {
        path: '/cart',
        component: () => import('pages/Cart/Cart.vue'),
        meta: { requiresAuth: true, requiresKYC: true },
      },
      {
        path: '/confirm-payment',
        component: () => import('pages/Cart/ConfirmPayment.vue'),
        // Strict Security: Must be verified, have a PIN set, and money in wallet
        meta: { requiresAuth: true, requiresKYC: true, requiresPin: true, requiresBalance: true },
      },

      // --- ACCOUNT & SETTINGS ---
      {
        path: '/notifications',
        component: () => import('pages/Notifications/Notifications.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/settings',
        component: () => import('src/pages/Settings/SettingsPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/account-info',
        component: () => import('pages/AccountInfo/AccountInfo.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/theme',
        component: () => import('pages/Theme/Theme.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/faqs',
        component: () => import('pages/Faqs/Faqs.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/contact-us',
        component: () => import('src/pages/ContactUs/ContactUs.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/refer-earn',
        component: () => import('src/pages/ReferEarn/ReferEarn.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/language',
        component: () => import('src/pages/Language/LanguagePage.vue'),
        meta: { requiresAuth: true },
      },

      // --- SECURITY & PIN MANAGEMENT ---
      {
        path: '/security',
        component: () => import('src/pages/Security/Security.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/changePassword',
        component: () => import('pages/Security/ChangePassword.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/set-pin-code',
        component: () => import('src/pages/Security/SetPinCode.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/change-pin-code',
        component: () => import('src/pages/Security/ChangePinCode.vue'),
        meta: { requiresAuth: true, requiresPin: true }, // Can't change if not set
      },
      {
        path: '/enter-pin-code',
        component: () => import('src/pages/Security/EnterPinCode.vue'),
        meta: { requiresAuth: true },
      },

      // --- IDENTITY VERIFICATION FLOW ---
      {
        path: '/identity-verification',
        component: () => import('src/pages/IdentityVerification/IdentityVerification.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/uploaded-documents',
        component: () => import('pages/IdentityVerification/UploadedDocuments.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/submit-id',
        component: () => import('pages/IdentityVerification/SubmitID.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/submit-your-id',
        component: () => import('pages/IdentityVerification/SubmitYourID.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/upload-documents',
        component: () => import('src/pages/IdentityVerification/UploadDocuments.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/pending-verification',
        component: () => import('src/pages/IdentityVerification/PendingVerification.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/rejected-verification',
        component: () => import('src/pages/IdentityVerification/RejectedVerification.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/complete-verification',
        component: () => import('src/pages/IdentityVerification/CompleteVerification.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },

  // --- PUBLIC ROUTES ---
  {
    path: '/login',
    component: () => import('pages/Login/Login.vue'),
    meta: { isPublic: true },
  },
  {
    path: '/register',
    component: () => import('pages/Register/Register.vue'),
    meta: { isPublic: true },
  },
  {
    path: '/forgot-password',
    component: () => import('pages/ForgotPassword/ForgotPassword.vue'),
    meta: { isPublic: true },
  },

  // 404 Catch-all
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('pages/Error404.vue'),
    meta: { isPublic: true },
  },
]

export default routes
