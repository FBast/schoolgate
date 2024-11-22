import { defineStore } from 'pinia';
import { ApiService } from '@/utils/apiService.js';

export const useSessionStore = defineStore('sessionStore', {
    state: () => ({
        sessions: [],
        selectedSession: null, // Stocke la session sélectionnée
        sessionErrors: {},
        message: '',
        success: false,
        error: null,
        loading: false,
    }),

    getters: {
        getSessionById: (state) => (id) => state.sessions.find((session) => session._id === id),
    },

    actions: {
        async fetchSessions() {
            this.loading = true;
            this.error = null;

            try {
                const response = await ApiService.getSessions();
                this.sessions = response;
                this.success = true;
            } catch (error) {
                this.error = 'Error fetching sessions';
                this.success = false;
                throw error;
            } finally {
                this.loading = false;
            }
        },

        getNextSession: (state) => {
            const now = new Date();
            return state.sessions
                .filter(session => new Date(session.startDate) > now)
                .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))[0] || null;
        },

        async addSession() {
            this.loading = true;
            this.error = null;

            try {
                const defaultStartDate = new Date().toISOString().slice(0, 10);
                const defaultEndDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
                const newSession = {
                    name: `New Session ${this.sessions.length + 1}`,
                    startDate: defaultStartDate,
                    endDate: defaultEndDate,
                };

                const response = await ApiService.createSession(newSession);
                this.sessions.push(response);
                this.message = 'Session added successfully';
                this.success = true;
            } catch (error) {
                this.error = 'Error adding session';
                this.message = this.error;
                this.success = false;
                console.error(error);
            } finally {
                this.loading = false;
            }
        },

        async updateSession(sessionId, updatedSession) {
            this.loading = true;
            this.error = null;

            try {
                const response = await ApiService.updateSession(sessionId, updatedSession);
                const index = this.sessions.findIndex((session) => session._id === sessionId);
                if (index !== -1) {
                    this.sessions[index] = response;

                    if (this.selectedSession && this.selectedSession._id === sessionId) {
                        this.selectedSession = response;
                    }
                }

                this.message = 'Session updated successfully';
                this.success = true;
            } catch (error) {
                this.error = 'Error updating session';
                this.message = this.error;
                this.success = false;
                console.error(error);
            } finally {
                this.loading = false;
            }
        },

        async deleteSession(sessionId) {
            this.loading = true;
            this.error = null;

            try {
                await ApiService.deleteSession(sessionId);
                this.sessions = this.sessions.filter((session) => session._id !== sessionId);

                if (this.selectedSession && this.selectedSession._id === sessionId) {
                    this.selectedSession = null;
                }

                this.message = 'Session deleted successfully';
                this.success = true;
            } catch (error) {
                this.error = 'Error deleting session';
                this.message = this.error;
                this.success = false;
                console.error(error);
            } finally {
                this.loading = false;
            }
        },

        selectSession(session) {
            this.selectedSession = session;
        },

        clearSelectedSession() {
            this.selectedSession = null;
        },
    },
});
