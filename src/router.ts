import { createWebHistory, createRouter, type RouteRecordRaw } from "vue-router";
import Dashboard from "./views/Dashboard.vue";
import SignIn from "./views/SignIn.vue";

const routes: RouteRecordRaw[] = [
    { path: '/', redirect: 'signin' },
    { path: '/signin', name: 'SignIn', component: SignIn },
    { path: '/dashboard', name: 'Dashboard', component: Dashboard, meta: { requiresAuth: true } }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    const loggedIn = localStorage.getItem('loggedIn') === 'true';

    if (to.meta.requiresAuth && !loggedIn) {
        next('/signin');
    } else if (to.path === '/signin' && loggedIn) {
        next('/dashboard');
    } else {
        next();
    }
});

export default router;
