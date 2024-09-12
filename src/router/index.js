import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import Register from '@/views/Register.vue';
import Verify from '@/views/Verify.vue';
import Dashboard from "@/views/Dashboard.vue";

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
    },
    {
        path: '/register',
        name: 'Register',
        component: Register,
    },
    {
        path: '/verify',
        name: 'Verify',
        component: Verify,
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard,
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
