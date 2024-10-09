import { createRouter, createWebHistory } from 'vue-router';
import {ApiService} from "@/utils/apiService.js";
import Home from '@/views/Home.vue';
import Register from '@/views/Register.vue';
import VerifyEmail from '@/views/VerifyEmail.vue';
import Dashboard from "@/views/Dashboard.vue";
import ForgotPassword from "@/views/ForgotPassword.vue";
import AdminDashboard from "@/views/AdminDashboard.vue";
import NotFound from "@/views/NotFound.vue";
import ResetPassword from "@/views/ResetPassword.vue";
import Login from "@/views/Login.vue";
import {jwtDecode} from "jwt-decode";

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
    },
    {
        path: '/register',
        name: 'Register',
        component: Register,
    },
    {
        path: '/verifyEmail',
        name: 'VerifyEmail',
        component: VerifyEmail,
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
        path: '/forgot-password',
        name: 'ForgotPassword',
        component: ForgotPassword
    },
    {
        path: '/reset-password',
        name: 'ResetPassword',
        component: ResetPassword,
        meta: {
            requiresAuth: true
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
    
    if (to.meta.requiresAdmin && token && decodedToken.role !== 'admin') {
        return next('/');
    }
    
    next();
});

export default router;
