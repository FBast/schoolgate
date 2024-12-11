import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import Auth from "@/views/Auth.vue";
import Dashboard from "@/views/Dashboard.vue";
import AdminDashboard from "@/views/AdminDashboard.vue";
import NotFound from "@/views/NotFound.vue";
import CandidateManagement from "@/views/admin/CandidateManagement.vue";
import SessionManagement from "@/views/admin/SessionManagement.vue";
import TopicManagement from "@/views/admin/TopicManagement.vue";
import FormationManagement from "@/views/admin/FormationManagement.vue";
import { jwtDecode } from "jwt-decode";
import { ROLES_OPTIONS } from "@/utils/constants";
import {useModalStore} from "@/stores/modalStore.js";

const routes = [
    {
        path: "/",
        name: "Home",
        component: Home,
        meta: { public: true },
    },
    {
        path: "/auth",
        name: "Auth",
        component: Auth,
        meta: { public: true },
    },
    {
        path: "/dashboard",
        name: "Dashboard",
        component: Dashboard,
        meta: { requiresAuth: true },
    },
    {
        path: "/admin-dashboard",
        name: "AdminDashboard",
        component: AdminDashboard,
        meta: { requiresAuth: true, requiresAdmin: true },
        redirect: "/admin-dashboard/candidates",
        children: [
            {
                path: "candidates",
                name: "Candidates",
                component: CandidateManagement,
            },
            {
                path: "sessions",
                name: "Sessions",
                component: SessionManagement,
            },
            {
                path: "topics",
                name: "Topics",
                component: TopicManagement,
            },
            {
                path: "formations",
                name: "Formations",
                component: FormationManagement,
            },
        ],
    },
    {
        path: "/:pathMatch(.*)*",
        name: "NotFound",
        component: NotFound,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Garde globale pour la navigation
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem("authToken");
    let decodedToken = null;

    if (token) {
        try {
            decodedToken = jwtDecode(token);
            const now = Math.floor(Date.now() / 1000);

            if (decodedToken.exp < now) {
                localStorage.removeItem("authToken"); // Expiration du token

                // Afficher une modale via le store
                const modalStore = useModalStore();
                modalStore.showModal({
                    title: "Déconnexion",
                    message: "Votre session a expiré. Vous allez être redirigé vers la page de connexion.",
                    callback: () => {
                        next("/auth"); // Rediriger après la fermeture de la modale
                    },
                });

                return; // Arrêter ici pour attendre la fermeture de la modale
            }
        } catch {
            localStorage.removeItem("authToken"); // Token invalide

            // Afficher une modale pour token invalide
            const modalStore = useModalStore();
            modalStore.showModal({
                title: "Erreur d'authentification",
                message: "Votre session est invalide. Vous allez être redirigé vers la page de connexion.",
                callback: () => {
                    next("/auth"); // Rediriger après la fermeture de la modale
                },
            });

            return; // Arrêter ici pour attendre la fermeture de la modale
        }
    }

    // Gestion des routes publiques
    if (to.meta.public) {
        return next();
    }

    // Gestion des routes nécessitant une authentification
    if (to.meta.requiresAuth && !token) {
        return next("/auth");
    }

    // Gestion des routes nécessitant un rôle admin
    if (to.meta.requiresAdmin && decodedToken?.role !== ROLES_OPTIONS.admin) {
        return next("/dashboard");
    }

    next(); // Autoriser la navigation
});

export default router;