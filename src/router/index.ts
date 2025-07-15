import { createRouter, createWebHistory } from 'vue-router'
import NotFound from '../views/NotFound.vue'
import DashboardRoutes from './dashboard'
import ClientRoutes from './client'
import LoginView from '@/views/auth/LoginView.vue'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: LoginView,
    meta: { requiresAuth: false },
  },
  ...DashboardRoutes,
  ...ClientRoutes,

  // Catch-all 404 route (must be last)
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const isLoggedIn = !!localStorage.getItem('authToken')
  if (to.meta.requiresAuth && !isLoggedIn) {
    next('/login')
  } else if (!to.meta.requiresAuth && isLoggedIn && (to.path === '/login' || to.path === '/')) {
    next('/home')
  } else {
    next()
  }
})

export default router
