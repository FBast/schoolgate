import axios from 'axios';
import {config} from "@/config.js";
import router from "@/router/index.js";
import {useModalStore} from "@/stores/modalStore.js";

// Créer une instance Axios
const axiosInstance = axios.create({
    baseURL: config.backendApi,
});

// Ajouter un intercepteur pour injecter l'API key
axiosInstance.interceptors.request.use(
    (request) => {
        // Ajouter l'API key à chaque requête
        request.headers['x-api-key'] = config.apiKey;

        return request;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Ajouter un intercepteur pour gérer les erreurs de réponse
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            const modalStore = useModalStore();
            modalStore.showModal({
                title: "Déconnexion",
                message: "Votre session a expiré. Vous allez être redirigé vers la page de connexion.",
                callback: () => {
                    localStorage.removeItem("authToken");
                    router.push({ path: "/auth" });
                },
            });
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
