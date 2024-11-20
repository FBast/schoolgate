import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import Dashboard from "@/views/Dashboard.vue";
import AdminDashboard from "@/views/AdminDashboard.vue";
import NotFound from "@/views/NotFound.vue";
import {jwtDecode} from "jwt-decode";
import Auth from "@/views/Auth.vue";
import {ROLES_OPTIONS} from "@/utils/constants.js";

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
    },
    {
        path: '/auth',
        name: 'Auth',
        component: Auth,
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/adminDashboard',
        name: 'AdminDashboard',
        component: AdminDashboard,
        meta: {
            requiresAuth: true,
            requiresAdmin: true
        }
    },
    {
        path: '/:pathMatch(.*)*', // Catch-all route pour capturer toutes les URL non trouvées
        name: 'NotFound',
        component: NotFound
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Vérifier les routes protégées avant chaque navigation
router.beforeEach(async (to, from, next) => {
    let token = localStorage.getItem('authToken');
    let decodedToken;
    
    // Check if the token has expired
    if (token) {
        decodedToken = jwtDecode(token);
        const now = Math.floor(Date.now() / 1000);
        if (decodedToken.exp < now) token = undefined;
    }
    
    if (to.meta.requiresAuth && !token) {
        return next('/');
    }
    
    if (to.meta.requiresAdmin && token && decodedToken.role !== ROLES_OPTIONS.admin) {
        return next('/');
    }
    
    next();
});

export default router;
