import axios from 'axios';
import {config} from "@/config.js";

// Créer une instance Axios
const axiosInstance = axios.create({
    baseURL: config.backendApi,
});

// Ajouter un intercepteur pour injecter l'API key
axiosInstance.interceptors.request.use((request) => {
    // Ajouter l'API key à chaque requête
    request.headers['x-api-key'] = config.apiKey;

    return request;
}, (error) => {
    return Promise.reject(error);
});

export default axiosInstance;
