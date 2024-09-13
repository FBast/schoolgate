// axiosInstance.js
import axios from 'axios';
import { config } from '@/config.js';

const axiosInstance = axios.create({
    baseURL: config.backendApi,
});

// Interceptor pour ajouter l'API key à chaque requête
axiosInstance.interceptors.request.use(
    (reqConfig) => {
        // Ajouter l'API key dans les headers
        reqConfig.headers['x-api-key'] = config.apiKey;
        return reqConfig;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
