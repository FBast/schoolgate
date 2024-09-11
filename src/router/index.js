import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import Register from '@/views/Register.vue';
import Verify from '@/views/Verify.vue';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,  // Page de connexion
    },
    {
        path: '/register',
        name: 'Register',
        component: Register,  // Page d'inscription
    },
    {
        path: '/verify',
        name: 'Verify',
        component: Verify,  // Page de validation
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
