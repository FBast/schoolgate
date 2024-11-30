import { defineStore } from 'pinia';
import { ApiService } from '@/utils/apiService.js';

export const useUserStore = defineStore('userStore', {
    state: () => ({
        users: [],
        selectedUser: null,
        error: null,
        loading: false,
    }),

    getters: {
        getUserById: (state) => (id) => state.users.find((user) => user._id === id),
        getModifiedUsers: (state) => state.users.filter(user => user.isModified),
    },

    actions: {
        async fetchUsers() {
            this.loading = true;
            this.error = null;

            try {
                const response = await ApiService.getUsers();
                this.users = response
                    .filter(user => user.role === "user")
                    .map(user => ({
                        ...user,
                        birthDate: user.birthDate ? new Date(user.birthDate).toISOString().split("T")[0] : null,
                        meetingDate: user.meetingDate ? new Date(user.meetingDate).toISOString().slice(0, 16) : null,
                        isModified: false,
                    }));
            } catch (error) {
                this.error = 'Error fetching users';
                console.error(error);
            } finally {
                this.loading = false;
            }
        },

        async updateUser(user) {
            try {
                await ApiService.updateUser(user._id, user);
                user.isModified = false;
                console.log('User updated successfully');
            } catch (error) {
                console.error(`Error saving user: ${error.message}`);
                throw new Error('Error saving user');
            }
        },

        async updateAllUsers() {
            this.loading = true;
            this.error = null;

            try {
                const modifiedUsers = this.getModifiedUsers;

                for (const user of modifiedUsers) {
                    await this.updateUser(user);
                }

                console.log('All modified users saved successfully');
            } catch (error) {
                this.error = 'Error saving users';
                console.error(error);
            } finally {
                this.loading = false;
            }
        },

        async deleteUser(userId) {
            this.loading = true;
            this.error = null;

            try {
                const userIndex = this.users.findIndex(user => user._id === userId);
                if (userIndex === -1) throw new Error(`User with ID ${userId} not found`);

                await ApiService.deleteUser(userId);
                this.users.splice(userIndex, 1);

                if (this.selectedUser && this.selectedUser._id === userId) {
                    this.selectedUser = null;
                }

                console.log('User deleted successfully');
            } catch (error) {
                this.error = 'Error deleting user';
                console.error(error);
            } finally {
                this.loading = false;
            }
        },

        markAsModified(userId) {
            const user = this.users.find(user => user._id === userId);
            if (user) {
                user.isModified = true;
            }
        },

        selectUser(user) {
            if (!user) {
                this.selectedUser = null;
            } else {
                this.selectedUser = { ...user };
            }
        },

        clearSelectedUser() {
            this.selectedUser = null;
        },
    },
});
