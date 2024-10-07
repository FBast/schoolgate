import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Login.vue';
import Register from '@/views/Register.vue';
import VerifyEmail from '@/views/VerifyEmail.vue';
import Dashboard from "@/views/Dashboard.vue";
import ForgotPassword from "@/views/ForgotPassword.vue";
import AdminDashboard from "@/views/AdminDashboard.vue";
import {ApiService} from "@/utils/apiService.js";
import NotFound from "@/views/NotFound.vue";
import ResetPassword from "@/views/ResetPassword.vue";

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
        path: '/admin',
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
    const token = localStorage.getItem('authToken');

    // Vérifie si la route nécessite une authentification
    if (to.meta.requiresAuth && !token) {
        return next('/'); // Redirige vers la page de login si non connecté
    }

    // Vérifie si la route nécessite un rôle admin
    if (to.meta.requiresAdmin && token) {
        const userProfile = await ApiService.getUserProfile(); // Récupère le profil de l'utilisateur connecté
        if (userProfile.role !== 'admin') {
            return next('/');  // Redirige vers la page d'accueil si l'utilisateur n'est pas admin
        }
    }

    // Autorise la navigation
    next();
});

export default router;
