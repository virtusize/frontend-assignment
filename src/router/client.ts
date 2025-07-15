import ClientListView from '@/views/client/ClientListView.vue'
import ClientEditView from '@/views/client/ClientEditView.vue'
import ClientAddView from '@/views/client/ClientAddView.vue'

const ClientRoutes = [
  {
    path: '/clients',
    name: 'Client List',
    component: ClientListView,
    meta: { requiresAuth: true },
  },
  {
    path: '/clients/add',
    name: 'Client Add',
    component: ClientAddView,
    meta: { requiresAuth: true },
  },
  {
    path: '/clients/:id/edit',
    name: 'Client Edit',
    component: ClientEditView,
    meta: { requiresAuth: true },
  },
]

export default ClientRoutes
