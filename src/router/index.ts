import { createRouter, createWebHistory, type RouteLocation } from 'vue-router'

import Home from '@/views/HomeView.vue'
import { createAuthGuard, useAuth0 } from '@auth0/auth0-vue'
import { watchOnce } from '@vueuse/core'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      beforeEnter: authGuard,
    },
  ],
})

async function authGuard(to: RouteLocation) {
  return createAuthGuard({
    redirectLoginOptions: {
      appState: {
        target: to.path,
      },
    },
  })(to)
}

router.beforeEach((to, _from, next) => {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0()

  const authFlow = () => {
    if (!isAuthenticated.value) {
      loginWithRedirect({ appState: { targetUrl: to.path } })
    }

    else next()
  }

  if (isLoading.value) {
    watchOnce(isLoading, (loading) => {
      if (!loading) {
        authFlow()
      }
    })
  }
  else {
    authFlow()
  }
})

export default router
