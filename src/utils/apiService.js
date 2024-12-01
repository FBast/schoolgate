import axiosInstance from './axiosInstance';

export const ApiService = {
    // User API methods
    async createUser(email, password) {
        try {
            const response = await axiosInstance.post('/users', { email, password });
            return response.data;
        } catch (error) {
            throw new Error('Error creating user');
        }
    },

    async loginUser(email, password) {
        try {
            const response = await axiosInstance.post('/users/login', { email, password });
            return response.data;
        } catch (error) {
            throw new Error('Error logging in');
        }
    },

    async resendVerificationCode(email) {
        try {
            const response = await axiosInstance.post('/users/resend-code', { email });
            return response.data;
        } catch (error) {
            throw new Error('Error resending verification code');
        }
    },

    async requestPasswordReset(email) {
        try {
            const response = await axiosInstance.post('/users/request-password-reset', { email });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error requesting password reset');
        }
    },

    async resetPassword(email, validationToken, newPassword) {
        try {
            const response = await axiosInstance.post('/users/reset-password', { email, validationToken, newPassword });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error resetting password');
        }
    },

    async verifyUser(token, email) {
        try {
            const response = await axiosInstance.post('/users/verify', { token, email });
            return response.data;
        } catch (error) {
            throw new Error('Error verifying user');
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
        } catch (error) {
            throw new Error('Error retrieving user profile');
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
            throw new Error('Error updating user profile');
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
            throw new Error('Error uploading PDF report');
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
        } catch (error) {
            throw new Error('Error retrieving users');
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
        } catch (error) {
            throw new Error('Error retrieving user');
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
        } catch (error) {
            throw new Error('Error updating user');
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
        } catch (error) {
            throw new Error('Error deleting user');
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

    async getTopic(topicId) {
        try {
            const response = await axiosInstance.get(`/topics/${topicId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            return response.data;
        } catch (error) {
            throw new Error('Error retrieving topic');
        }
    },

    async updateTopic(topicId, topicData) {
        try {
            const response = await axiosInstance.put(`/topics/${topicId}`, topicData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            return response.data;
        } catch (error) {
            throw new Error('Error updating topic');
        }
    },

    async deleteTopic(topicId) {
        try {
            const response = await axiosInstance.delete(`/topics/${topicId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            return response.data;
        } catch (error) {
            throw new Error('Error deleting topic');
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
            throw new Error('Error creating formation');
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
            throw new Error('Error retrieving grades');
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
            throw new Error('Error updating formation');
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
            throw new Error('Error deleting formation');
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
            throw new Error('Error creating grade');
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
            throw new Error('Error retrieving formations');
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
            throw new Error('Error retrieving grades');
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
            throw new Error('Error updating grade');
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
            throw new Error('Error deleting grade');
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
            throw new Error('Error retrieving sessions');
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
            throw new Error('Error creating session');
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
            throw new Error('Error updating session');
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
            throw new Error('Error deleting session');
        }
    }
};