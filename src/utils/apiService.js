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

    async resendVerificationCode(email) {
        try {
            const response = await axiosInstance.post('/users/resend', { email });
            return response.data;
        } catch (error) {
            throw new Error('Erreur lors de l\'envoi du code de vérification');
        }
    },

    async requestPasswordReset(email) {
        try {
            const response = await axiosInstance.post('/users/request-password-reset', { email });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Erreur lors de la demande de réinitialisation du mot de passe');
        }
    },

    async resetPassword(email, validationToken, newPassword) {
        try {
            const response = await axiosInstance.post('/users/reset-password', { email, validationToken, newPassword });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Erreur lors de la réinitialisation du mot de passe');
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
        } catch (error) {
            throw new Error('Erreur lors de la mise à jour des informations utilisateur.');
        }
    },

    async uploadReport(pdfFile) {
        try {
            const formData = new FormData();
            formData.append('examReport', pdfFile);

            const response = await axiosInstance.post('/users/me/upload-report', formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            return response.data;
        } catch (error) {
            throw new Error('Erreur lors de l\'upload du fichier PDF.');
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
    },

    // Formation API methods
    async createFormation(formationData) {
        try {
            const response = await axiosInstance.post('/formations', formationData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            return response.data;
        } catch (error) {
            throw new Error(`Error creating formation: ${error.response?.data?.message || error.message}`);
        }
    },

    async getGrades() {
        try {
            const response = await axiosInstance.get('/grades', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            return response.data;
        } catch (error) {
            throw new Error(`Error retrieving grades: ${error.response?.data?.message || error.message}`);
        }
    },

    async updateFormation(formationId, formationData) {
        try {
            const response = await axiosInstance.put(`/formations/${formationId}`, formationData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            return response.data;
        } catch (error) {
            throw new Error(`Error updating formation: ${error.response?.data?.message || error.message}`);
        }
    },

    async deleteFormation(formationId) {
        try {
            const response = await axiosInstance.delete(`/formations/${formationId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            return response.data;
        } catch (error) {
            throw new Error(`Error deleting formation: ${error.response?.data?.message || error.message}`);
        }
    },

    // Grade API methods
    async createGrade(gradeData) {
        try {
            const response = await axiosInstance.post('/grades', gradeData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            return response.data;
        } catch (error) {
            throw new Error(`Error creating grade: ${error.response?.data?.message || error.message}`);
        }
    },

    async getFormations() {
        try {
            const response = await axiosInstance.get('/formations', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            return response.data;
        } catch (error) {
            throw new Error(`Error retrieving formations: ${error.response?.data?.message || error.message}`);
        }
    },
    
    async getFormationGrades(formationId) {
        try {
            const response = await axiosInstance.get(`/grades?formationId=${formationId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            return response.data;
        } catch (error) {
            throw new Error(`Error retrieving grades: ${error.response?.data?.message || error.message}`);
        }
    },

    async updateGrade(gradeId, gradeData) {
        try {
            const response = await axiosInstance.put(`/grades/${gradeId}`, gradeData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            return response.data;
        } catch (error) {
            throw new Error(`Error updating grade: ${error.response?.data?.message || error.message}`);
        }
    },

    async deleteGrade(gradeId) {
        try {
            const response = await axiosInstance.delete(`/grades/${gradeId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            return response.data;
        } catch (error) {
            throw new Error(`Error deleting grade: ${error.response?.data?.message || error.message}`);
        }
    },

    async generateExam(gradeId) {
        try {
            const response = await axiosInstance.get(`/grades/${gradeId}/generate`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            return response.data;
        } catch (error) {
            throw new Error('Error generating exam');
        }
    },
    
    // Session API Methods

    async getSessions() {
        try {
            const response = await axiosInstance.get('/sessions', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            return response.data;
        } catch (error) {
            throw new Error('Erreur lors de la récupération des sessions');
        }
    },

    async createSession(sessionData) {
        try {
            const response = await axiosInstance.post('/sessions', sessionData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            return response.data;
        } catch (error) {
            throw new Error('Erreur lors de la création de la session');
        }
    },

    async updateSession(sessionId, sessionData) {
        try {
            const response = await axiosInstance.put(`/sessions/${sessionId}`, sessionData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            return response.data;
        } catch (error) {
            throw new Error('Erreur lors de la mise à jour de la session');
        }
    },

    async deleteSession(sessionId) {
        try {
            const response = await axiosInstance.delete(`/sessions/${sessionId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            return response.data;
        } catch (error) {
            throw new Error('Erreur lors de la suppression de la session');
        }
    }
}