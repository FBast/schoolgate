import { defineStore } from 'pinia';
import { ApiService } from '@/utils/apiService.js';
import { toDatetimeLocal, toISOString } from "@/utils/helpers.js";

export const useSessionStore = defineStore('sessionStore', {
    state: () => ({
        sessions: [],
        selectedSession: null,
        sessionErrors: {},
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

        getModifiedSessions: (state) => state.sessions.filter(session => session.isModified || session.isNew),
    },

    actions: {
        async fetchSessions() {
            this.loading = true;

            try {
                const response = await ApiService.getSessions();
                this.sessions = response.map((session) => ({
                    ...session,
                    startDate: toDatetimeLocal(session.startDate),
                    endDate: toDatetimeLocal(session.endDate),
                    isNew: false, // Les sessions existantes ne sont pas nouvelles
                    isModified: false, // Aucune modification initialement
                }));
                console.log('Sessions fetched successfully');
            } catch (error) {
                throw new Error(`Error fetching sessions: ${error.message}`);
            } finally {
                this.loading = false;
            }
        },

        addSession() {
            const defaultStartDate = toISOString(new Date());
            const defaultEndDate = toISOString(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));

            const newSession = {
                _id: `temp-${Date.now()}`,
                name: `New Session ${this.sessions.length + 1}`,
                startDate: defaultStartDate,
                endDate: defaultEndDate,
                enabled: false,
                isNew: true,
                isModified: true,
            };

            this.sessions.push({
                ...newSession,
                startDate: toDatetimeLocal(newSession.startDate),
                endDate: toDatetimeLocal(newSession.endDate),
            });

            this.selectSession(newSession);

            console.log('New session added locally');
        },

        async updateSession(session) {
            const preparedSession = {
                ...session,
                startDate: toISOString(session.startDate),
                endDate: toISOString(session.endDate),
            };

            if (session.isNew) {
                // Création d'une nouvelle session
                delete preparedSession._id;
                const apiResponse = await ApiService.createSession(preparedSession);
                session._id = apiResponse.session._id;
                session.isNew = false;
            } else {
                // Mise à jour d'une session existante
                await ApiService.updateSession(session._id, preparedSession);
            }

            session.isModified = false;

            console.log(`Session ${session.isNew ? 'created' : 'updated'} successfully`);
        },

        async saveAllChanges() {
            this.loading = true;

            try {
                const modifiedSessions = this.getModifiedSessions;

                for (const session of modifiedSessions) {
                    await this.updateSession(session);
                }

                console.log('All modified sessions updated successfully');
            } catch (error) {
                throw new Error(`Error updating modified sessions: ${error.message}`);
            } finally {
                this.loading = false;
            }
        },

        async deleteSession(sessionId) {
            this.loading = true;

            try {
                const sessionIndex = this.sessions.findIndex((s) => s._id === sessionId);
                if (sessionIndex === -1) {
                    throw new Error(`Session with ID ${sessionId} not found`);
                }

                const session = this.sessions[sessionIndex];

                if (session.isNew) {
                    // Suppression uniquement locale
                    this.sessions.splice(sessionIndex, 1);
                    console.log('New session deleted locally');
                } else {
                    // Suppression via l'API
                    await ApiService.deleteSession(sessionId);
                    this.sessions.splice(sessionIndex, 1);
                    console.log('Session deleted successfully');
                }

                if (this.selectedSession && this.selectedSession._id === sessionId) {
                    this.selectSession(null)
                }
            } catch (error) {
                throw new Error(`Error deleting session: ${error.message}`);
            } finally {
                this.loading = false;
            }
        },

        markSessionAsModified(sessionId) {
            const session = this.sessions.find((s) => s._id === sessionId);
            if (session && !session.isNew) {
                session.isModified = true;
            }
        },

        selectSession(session) {
            if (!session) {
                this.selectedSession = null;
            } else {
                this.selectedSession = {
                    ...session,
                    startDate: toDatetimeLocal(session.startDate),
                    endDate: toDatetimeLocal(session.endDate),
                };
            }
        }
    },
});
