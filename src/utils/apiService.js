import axiosInstance from './axiosInstance';

export const ApiService = {
    // User API methods
    async createUser(email, password) {
        try {
            const response = await axiosInstance.post('/users', { email, password });
            return response.data;
        } 
        catch (error) {
            throw new Error('Erreur lors de la création de l\'utilisateur');
        }
    },
    
    async loginUser(email, password) {
        try {
            const response = await axiosInstance.post('/users/login', { email, password });
            return response.data;
        } 
        catch (error) {
            throw new Error('Erreur lors de la connexion');
        }
    },
    
    async resetEmail(email) {
        try {
            const response = await axiosInstance.post('/users/reset', { email });
            return response.data;
        } 
        catch (error) {
            throw new Error('Erreur lors du reset de l\'utilisateur');
        }
    },
    
    async verifyUser(token, email) {
        try {
            const response = await axiosInstance.post('/users/verify', { token, email });
            return response.data;
        } 
        catch (error) {
            throw new Error('Erreur lors de la vérification de l\'utilisateur');
        }
    },

    async getUserProfile() {
        try {
            const response = await axiosInstance.get('/users/me', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            return response.data;
        } 
        catch (error) {
            throw new Error('Erreur lors de la récupération des informations utilisateur');
        }
    },

    async updateUserProfile(userData) {
        try {
            const response = await axiosInstance.put('/users/me', userData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            return response.data;
        } 
        catch (error) {
            throw new Error('Erreur lors de la mise à jour des informations utilisateur.');
        }
    },

    async getUsers() {
        try {
            const response = await axiosInstance.get('/users', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            return response.data;
        } 
        catch (error) {
            throw new Error('Erreur lors de la récupération des utilisateurs');
        }
    },

    async getUser(userId) {
        try {
            const response = await axiosInstance.get(`/users/${userId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            return response.data;
        } 
        catch (error) {
            throw new Error('Erreur lors de la récupération de l\'utilisateur');
        }
    },

    async updateUser(userId, userData) {
        try {
            const response = await axiosInstance.put(`/users/${userId}`, userData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            return response.data;
        } 
        catch (error) {
            throw new Error('Erreur lors de la mise à jour des informations utilisateur');
        }
    },

    async deleteUser(userId) {
        try {
            const response = await axiosInstance.delete(`/users/${userId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            return response.data;
        } 
        catch (error) {
            throw new Error('Erreur lors de la suppression de l\'utilisateur');
        }
    },

    // Topic API methods
    async createTopic(topicData) {
        try {
            const response = await axiosInstance.post('/topics', topicData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            return response.data;
        } catch (error) {
            throw new Error('Error creating topic');
        }
    },

    async getTopics() {
        try {
            const response = await axiosInstance.get('/topics', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            return response.data;
        } catch (error) {
            throw new Error('Error retrieving topics');
        }
    },

    async getTopic(examId) {
        try {
            const response = await axiosInstance.get(`/topics/${examId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            return response.data;
        } catch (error) {
            throw new Error('Error retrieving topic');
        }
    },

    async updateTopic(examId, examData) {
        try {
            const response = await axiosInstance.put(`/topics/${examId}`, examData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            return response.data;
        } catch (error) {
            throw new Error('Error updating topic');
        }
    },

    async deleteTopic(examId) {
        try {
            const response = await axiosInstance.delete(`/topics/${examId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            return response.data;
        } catch (error) {
            throw new Error('Error deleting topic');
        }
    },

    // Exercise API methods
    async createExercise(topicId, exerciseData) {
        try {
            const response = await axiosInstance.post('/exercises', { ...exerciseData, topicId }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            return response.data;
        } catch (error) {
            throw new Error('Error creating exercise');
        }
    },

    async getExercises(topicId = null) {
        try {
            const url = topicId ? `/exercises?topicId=${topicId}` : '/exercises';
            const response = await axiosInstance.get(url, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            return response.data;
        } catch (error) {
            throw new Error(`Error retrieving exercises: ${error.response?.data?.message || error.message}`);
        }
    },

    async getExercise(exerciseId) {
        try {
            const response = await axiosInstance.get(`/exercises/${exerciseId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            return response.data;
        } catch (error) {
            throw new Error('Error retrieving exercise');
        }
    },

    async updateExercise(exerciseId, exerciseData) {
        try {
            const response = await axiosInstance.put(`/exercises/${exerciseId}`, exerciseData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            return response.data;
        } catch (error) {
            throw new Error('Error updating exercise');
        }
    },

    async deleteExercise(exerciseId) {
        try {
            const response = await axiosInstance.delete(`/exercises/${exerciseId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            return response.data;
        } catch (error) {
            throw new Error('Error deleting exercise');
        }
    }
}