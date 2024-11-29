import { defineStore } from 'pinia';
import { ApiService } from '@/utils/apiService.js';

export const useUserStore = defineStore('userStore', {
    state: () => ({
        users: [],
        selectedUser: null,
        message: '',
        success: false,
        error: null,
        loading: false,
    }),

    getters: {
        getUserById: (state) => (id) => 
            state.users.find((user) => user._id === id),
    },

    actions: {
        async fetchUsers() {
            this.loading = true;
            this.error = null;

            try {
                const response = await ApiService.getUsers();
                this.users = response.filter(user => user.role === "user");
            } catch (error) {
                this.error = 'Error fetching users';
                console.error(error);
            } finally {
                this.loading = false;
            }
        },

        async fetchUserById(userId) {
            this.loading = true;
            this.error = null;

            try {
                const cachedUser = this.getUserById(userId);
                if (cachedUser) {
                    return cachedUser;
                }

                const response = await ApiService.getUser(userId);
                this.users.push(response);
                return response;
            } catch (error) {
                this.error = 'Error fetching user by ID';
                console.error(error);
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async deleteUser(userId) {
            this.loading = true;
            this.error = null;

            try {
                await ApiService.deleteUser(userId);
                this.users = this.users.filter((user) => user._id !== userId);

                // Réinitialiser l'utilisateur sélectionné si supprimé
                if (this.selectedUser && this.selectedUser._id === userId) {
                    this.selectedUser = null;
                }

                this.message = 'User deleted successfully';
                this.success = true;
            } catch (error) {
                this.error = 'Error deleting user';
                this.message = this.error;
                this.success = false;
                console.error(error);
            } finally {
                this.loading = false;
            }
        },

        async updateUser(userId, updatedUserData) {
            this.loading = true;
            this.error = null;

            try {
                const response = await ApiService.updateUser(userId, updatedUserData);
                const index = this.users.findIndex((user) => user._id === userId);
                if (index !== -1) {
                    this.users[index] = response;

                    if (this.selectedUser && this.selectedUser._id === userId) {
                        this.selectedUser = response;
                    }
                }

                this.message = 'User updated successfully';
                this.success = true;
            } catch (error) {
                this.error = 'Error updating user';
                this.message = this.error;
                this.success = false;
                console.error(error);
            } finally {
                this.loading = false;
            }
        },

        selectUser(user) {
            this.selectedUser = user;
        },

        clearSelectedUser() {
            this.selectedUser = null;
        },
    },
});
