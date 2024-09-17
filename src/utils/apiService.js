import axiosInstance from './axiosInstance';

export const ApiService = {
    // Authentification de l'utilisateur (connexion)
    async loginUser(email, password) {
        try {
            const response = await axiosInstance.post('/users/login', { email, password });
            return response.data;
        } catch (error) {
            throw new Error('Erreur lors de la connexion');
        }
    },

    // Création d'un utilisateur
    async createUser(email, password) {
        try {
            const response = await axiosInstance.post('/users', { email, password });
            return response.data;
        } catch (error) {
            throw new Error('Erreur lors de la création de l\'utilisateur');
        }
    },

    // Vérification du code de validation
    async verifyUser(token, email) {
        try {
            const response = await axiosInstance.post('/users/verify', { token, email });
            return response.data;
        } catch (error) {
            throw new Error('Erreur lors de la vérification de l\'utilisateur');
        }
    },

    // Récupérer les informations de l'utilisateur connecté
    async getUserProfile() {
        try {
            const response = await axiosInstance.get('/users/me', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            return response.data;
        } catch (error) {
            throw new Error('Erreur lors de la récupération des informations utilisateur');
        }
    },

    // Mettre à jour les informations de l'utilisateur connecté
    async updateUserProfile(userData) {
        try {
            const response = await axiosInstance.put('/users/me', userData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            return response.data;
        } catch (error) {
            throw new Error('Erreur lors de la mise à jour des informations utilisateur.');
        }
    },

    // Récupérer la liste des utilisateurs (admin uniquement)
    async getUsers() {
        try {
            const response = await axiosInstance.get('/users', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            return response.data;
        } catch (error) {
            throw new Error('Erreur lors de la récupération des utilisateurs');
        }
    },

    // Récupérer un utilisateur spécifique (admin uniquement)
    async getUserById(userId) {
        try {
            const response = await axiosInstance.get(`/users/${userId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            return response.data;
        } catch (error) {
            throw new Error('Erreur lors de la récupération de l\'utilisateur');
        }
    },

    // Mettre à jour les informations de l'utilisateur
    async updateUser(userId, userData) {
        try {
            const response = await axiosInstance.put(`/users/${userId}`, userData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            return response.data;
        } catch (error) {
            throw new Error('Erreur lors de la mise à jour des informations utilisateur');
        }
    },

    // Supprimer un utilisateur (admin uniquement)
    async deleteUser(userId) {
        try {
            const response = await axiosInstance.delete(`/users/${userId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            return response.data;
        } catch (error) {
            throw new Error('Erreur lors de la suppression de l\'utilisateur');
        }
    }
}