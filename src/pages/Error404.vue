<template>
  <div class="fullscreen bg-gradient text-white text-center q-pa-md flex flex-center">
    <div class="error-container">
      <div class="error-code">404</div>

      <div class="error-message text-h3 q-mb-md">عذراً، الصفحة غير موجودة</div>

      <div class="error-subtitle text-h6 q-mb-xl" style="opacity: 0.7">
        الصفحة التي تبحث عنها غير موجودة أو قد تم نقلها
      </div>

      <q-btn
        class="q-mt-xl home-btn"
        color="white"
        text-color="dark"
        unelevated
        @click="navigateToHome"
        :label="buttonLabel"
        no-caps
        size="lg"
        icon="home"
      />

      <q-btn
        v-if="!userStore.isAuthenticated"
        class="q-mt-md q-ml-md"
        color="primary"
        outline
        @click="navigateToLogin"
        label="تسجيل الدخول"
        no-caps
        size="lg"
        icon="login"
      />
    </div>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUsersStore } from 'src/stores/users-store'

export default defineComponent({
  name: 'Error404',

  setup() {
    const router = useRouter()
    const userStore = useUsersStore()

    const buttonLabel = computed(() => {
      if (userStore.isAuthenticated) {
        return 'العودة للصفحة الرئيسية'
      }
      return 'العودة للصفحة الرئيسية'
    })

    const navigateToHome = () => {
      if (userStore.isAuthenticated) {
        if (userStore.isAdmin) {
          router.push('/app/insights')
        }
        if (userStore.isTeacher) {
          router.push('/app')
        }
        if (!userStore.isAdmin && !userStore.isTeacher) {
          router.push('/login')
        }
        router.push('/login')
      } else {
        router.push('/login')
      }
    }

    const navigateToLogin = () => {
      router.push('/login')
    }

    // Auto-navigate based on user status
    if (userStore.isAuthenticated) {
      router.replace('/')
    } else {
      router.replace('/login')
    }

    return {
      userStore,
      buttonLabel,
      navigateToHome,
      navigateToLogin,
    }
  },
})
</script>

<style scoped>
.bg-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.error-container {
  max-width: 600px;
}

.error-code {
  font-size: 20vh;
  font-weight: 700;
  line-height: 1;
  text-shadow: 4px 4px 8px rgba(0, 0, 0, 0.3);
  margin-bottom: 20px;
}

.error-message {
  font-weight: 500;
  margin-bottom: 10px;
}

.error-subtitle {
  font-weight: 300;
}

.home-btn {
  border-radius: 50px;
  padding: 12px 30px;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.home-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

/* Responsive design */
@media (max-width: 600px) {
  .error-code {
    font-size: 15vh;
  }

  .error-message {
    font-size: 1.5rem;
  }

  .error-subtitle {
    font-size: 1rem;
  }

  .home-btn {
    padding: 10px 25px;
    font-size: 1rem;
  }
}

/* RTL support */
:deep(.q-btn__content) {
  flex-direction: row-reverse;
}

:deep(.q-btn__content .q-icon) {
  margin-right: 0;
  margin-left: 8px;
}
</style>
