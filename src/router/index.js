import { createRouter, createWebHistory } from 'vue-router';
import Clients from '@/views/Clients.vue';
import ViewClient from '@/views/ViewClient.vue';
import Login from '@/views/Login.vue';

export const api = "http://localhost:4090/clients";

export const routes = {
  login: {
    path: "/",
    name: "login",
    component: Login
  },
  client: {
    home: {
      path: "/clients",
      name: "client", 
      component: Clients
    },
    viewClient: {
      path: "/clients/:id",
      name: "view-client",
      component: ViewClient
    }
  }
}


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    routes.login,
    routes.client.home,
    routes.client.viewClient
  ]
})

export default router;