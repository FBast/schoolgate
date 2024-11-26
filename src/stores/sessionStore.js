import { defineStore } from 'pinia';
import { ApiService } from '@/utils/apiService.js';
import {toDatetimeLocal, toISOString} from "@/utils/helpers.js";

export const useSessionStore = defineStore('sessionStore', {
    state: () => ({
        sessions: [],
        selectedSession: null,
        sessionErrors: {},
        message: '',
        success: false,
        error: null,
        loading: false,
    }),

    getters: {
        getSessionById: (state) => (id) => state.sessions.find((session) => session._id === id),

        getNextSession: (state) => {
            const now = new Date();
            return state.sessions
                .filter(session => new Date(session.startDate) > now)
                .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))[0] || null;
        },
    },

    actions: {
        async fetchSessions() {
            this.loading = true;
            this.error = null;

            try {
                const response = await ApiService.getSessions();
                // Convertir les dates ISO en format datetime-local
                this.sessions = response.map((session) => ({
                    ...session,
                    startDate: toDatetimeLocal(session.startDate),
                    endDate: toDatetimeLocal(session.endDate),
                }));
                this.success = true;
            } catch (error) {
                this.error = 'Error fetching sessions';
                this.success = false;
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async addSession() {
            this.loading = true;
            this.error = null;

            try {
                const defaultStartDate = toISOString(new Date());
                const defaultEndDate = toISOString(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));

                const newSession = {
                    name: `New Session ${this.sessions.length + 1}`,
                    startDate: defaultStartDate,
                    endDate: defaultEndDate,
                };

                await ApiService.createSession(newSession);
                await this.fetchSessions();
                
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

            const preparedSession = {
                ...updatedSession,
                startDate: toISOString(updatedSession.startDate),
                endDate: toISOString(updatedSession.endDate),
            };

            try {
                await ApiService.updateSession(sessionId, preparedSession);

                await this.fetchSessions();
                this.selectedSession = this.getSessionById(sessionId);

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
            if (!session) return;
            this.selectedSession = {
                ...session,
                startDate: toDatetimeLocal(session.startDate),
                endDate: toDatetimeLocal(session.endDate),
            };
        },

        clearSelectedSession() {
            this.selectedSession = null;
        }
    }
});
