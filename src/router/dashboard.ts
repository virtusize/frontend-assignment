import HomeView from '@/views/dashboard/HomeView.vue'

const DashboardRoutes = [
  {
    path: '/home',
    name: 'Home',
    component: HomeView,
    meta: { requiresAuth: true },
  },
]

export default DashboardRoutes
