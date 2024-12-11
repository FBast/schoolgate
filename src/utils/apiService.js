import axiosInstance from './axiosInstance';

export const ApiService = {
    // User API methods
    async createUser(email, password) {
        const response = await axiosInstance.post('/users', { email, password });
        return response.data;
    },

    async loginUser(email, password) {
        const response = await axiosInstance.post('/users/login', { email, password });
        return response.data;
    },

    async resendVerificationCode(email) {
        const response = await axiosInstance.post('/users/resend-code', { email });
        return response.data;
    },

    async requestPasswordReset(email) {
        const response = await axiosInstance.post('/users/request-password-reset', { email });
        return response.data;
    },

    async resetPassword(email, validationToken, newPassword) {
        const response = await axiosInstance.post('/users/reset-password', { email, validationToken, newPassword });
        return response.data;
    },

    async verifyUser(token, email) {
        const response = await axiosInstance.post('/users/verify', { token, email });
        return response.data;
    },

    async getUserProfile() {
        const response = await axiosInstance.get('/users/me', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        return response.data;
    },

    async updateUserProfile(userData) {
        const response = await axiosInstance.put('/users/me', userData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        return response.data;
    },

    async uploadReport(files) {
        const formData = new FormData();

        files.forEach((file) => {
            formData.append(`examReport`, file);
        });

        const response = await axiosInstance.post('/users/me/upload-report', formData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        return response.data;
    },

    async getUsers() {
        const response = await axiosInstance.get('/users', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        return response.data;
    },

    async getUser(userId) {
        const response = await axiosInstance.get(`/users/${userId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        return response.data;
    },

    async updateUser(userId, userData) {
        const response = await axiosInstance.put(`/users/${userId}`, userData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        return response.data;
    },

    async deleteUser(userId) {
        const response = await axiosInstance.delete(`/users/${userId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        return response.data;
    },

    // Topic API methods
    topicFormData(topicData) {
        const formData = new FormData();

        // Ajouter les données JSON pour le titre et les exercices
        formData.append('data', JSON.stringify({
            title: topicData.title,
            exercises: topicData.exercises.map((exercise) => ({
                _id: exercise._id,
                title: exercise.title,
                text: exercise.text,
            })),
        }));

        // Ajouter les fichiers associés aux exercices
        topicData.exercises.forEach((exercise, exerciseIndex) => {
            if (exercise.images && exercise.images.length > 0) {
                exercise.images.forEach((imageFile, imageIndex) => {
                    if (imageFile instanceof File || imageFile instanceof Blob) {
                        formData.append(`images[${exerciseIndex}][${imageIndex}]`, imageFile);
                    } else if (imageFile.data) {
                        const blob = new Blob([new Uint8Array(imageFile.data)], {type: imageFile.mimeType});
                        const file = new File([blob], imageFile.name, {type: imageFile.mimeType});
                        formData.append(`images[${exerciseIndex}][${imageIndex}]`, file);
                    } else {
                        console.warn(`Invalid image format for exercise ${exerciseIndex}, image ${imageIndex}`);
                    }
                });
            }
        });
        return formData;
    },
    
    async createTopic(topicData) {
        const formData = this.topicFormData(topicData);
        const response = await axiosInstance.post('/topics', formData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    async getTopic(topicId) {
        const response = await axiosInstance.get(`/topics/${topicId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        return response.data;
    },
    
    async getTopics() {
        const response = await axiosInstance.get('/topics', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        return response.data;
    },
    
    async updateTopic(topicId, topicData) {
        const formData = this.topicFormData(topicData);
        const response = await axiosInstance.put(`/topics/${topicId}`, formData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    async deleteTopic(topicId) {
        const response = await axiosInstance.delete(`/topics/${topicId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        return response.data;
    },

    // Formation API methods
    async createFormation(formationData) {
        const response = await axiosInstance.post('/formations', formationData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        return response.data;
    },

    // async getGrades() {
    //     try {
    //         const response = await axiosInstance.get('/grades', {
    //             headers: {
    //                 Authorization: `Bearer ${localStorage.getItem('authToken')}`
    //             }
    //         });
    //         return response.data;
    //     } catch (error) {
    //         throw new Error('Error retrieving grades');
    //     }
    // },

    async updateFormation(formationId, formationData) {
        const response = await axiosInstance.put(`/formations/${formationId}`, formationData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        return response.data;
    },

    async deleteFormation(formationId) {
        const response = await axiosInstance.delete(`/formations/${formationId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        return response.data;
    },

    // Grade API methods
    // async createGrade(gradeData) {
    //     try {
    //         const response = await axiosInstance.post('/grades', gradeData, {
    //             headers: {
    //                 Authorization: `Bearer ${localStorage.getItem('authToken')}`
    //             }
    //         });
    //         return response.data;
    //     } catch (error) {
    //         throw new Error('Error creating grade');
    //     }
    // },

    async getFormations() {
        const response = await axiosInstance.get('/formations', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        return response.data;
    },

    // async getFormationGrades(formationId) {
    //     try {
    //         const response = await axiosInstance.get(`/grades?formationId=${formationId}`, {
    //             headers: {
    //                 Authorization: `Bearer ${localStorage.getItem('authToken')}`
    //             }
    //         });
    //         return response.data;
    //     } catch (error) {
    //         throw new Error('Error retrieving grades');
    //     }
    // },
    //
    // async updateGrade(gradeId, gradeData) {
    //     try {
    //         const response = await axiosInstance.put(`/grades/${gradeId}`, gradeData, {
    //             headers: {
    //                 Authorization: `Bearer ${localStorage.getItem('authToken')}`
    //             }
    //         });
    //         return response.data;
    //     } catch (error) {
    //         throw new Error('Error updating grade');
    //     }
    // },
    //
    // async deleteGrade(gradeId) {
    //     try {
    //         const response = await axiosInstance.delete(`/grades/${gradeId}`, {
    //             headers: {
    //                 Authorization: `Bearer ${localStorage.getItem('authToken')}`
    //             }
    //         });
    //         return response.data;
    //     } catch (error) {
    //         throw new Error('Error deleting grade');
    //     }
    // },

    async generateExam(formationId, gradeId) {
        const response = await axiosInstance.get(`/formations/${formationId}/grades/${gradeId}/generateExam`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        return response.data;
    },

    // Session API Methods
    async getSessions() {
        const response = await axiosInstance.get('/sessions', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        return response.data;
    },

    async createSession(sessionData) {
        const response = await axiosInstance.post('/sessions', sessionData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        return response.data;
    },

    async updateSession(sessionId, sessionData) {
        const response = await axiosInstance.put(`/sessions/${sessionId}`, sessionData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        return response.data;
    },

    async deleteSession(sessionId) {
        const response = await axiosInstance.delete(`/sessions/${sessionId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        return response.data;
    }
};