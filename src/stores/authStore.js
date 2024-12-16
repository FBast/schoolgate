import { defineStore } from "pinia";
import { ApiService } from "@/utils/apiService.js";

export const useAuthStore = defineStore("authStore", {
    state: () => ({
        email: "",
        loading: false,
        currentUser: null,
    }),

    getters: {
        isAuthenticated: (state) => !!state.currentUser,
        isAdmin: (state) => state.currentUser?.role === "admin",
    },

    actions: {
        decodeToken(token) {
            try {
                return JSON.parse(atob(token.split(".")[1]));
            } catch (error) {
                console.error("Failed to decode token:", error);
                return null;
            }
        },

        async fetchCurrentUser() {
            this.loading = true;
            try {
                this.currentUser = await ApiService.getUserProfile();
                console.log("Current user fetched successfully.");
            } catch (error) {
                console.error("Error fetching current user:", error.message);
                this.logout();
                throw new Error(`Error fetching current user: ${error.message}`);
            } finally {
                this.loading = false;
            }
        },

        async loginUser(password) {
            this.loading = true;
            try {
                const { token: authToken } = await ApiService.loginUser(this.email, password);
                const decodedToken = this.decodeToken(authToken);

                if (decodedToken.status === "unverified" && decodedToken.role !== "admin") {
                    console.log("User needs to verify their email.");
                    return "verify";
                }

                localStorage.setItem("authToken", authToken);
                await this.fetchCurrentUser();
                console.log("User logged in successfully.");
                return "dashboard";
            } catch (error) {
                console.error("Login failed:", error.message);
                throw new Error(`Login failed: ${error.message}`);
            } finally {
                this.loading = false;
            }
        },

        async registerUser(password) {
            this.loading = true;
            try {
                await ApiService.createUser(this.email, password);
                console.log("User registered successfully.");
                return "verify";
            } catch (error) {
                if (error.response && error.response.status === 400) {
                    console.error("This email is already in use.");
                    throw new Error("This email is already in use. Please login.");
                }
                console.error("Registration failed:", error.message);
                throw new Error(`Registration failed: ${error.message}`);
            } finally {
                this.loading = false;
            }
        },

        async verifyUser(verificationCode) {
            this.loading = true;
            try {
                const { token: authToken } = await ApiService.verifyUser(verificationCode, this.email);
                localStorage.setItem("authToken", authToken);
                await this.fetchCurrentUser();
                console.log("User verified successfully.");
            } catch (error) {
                console.error("Verification failed:", error.message);
                throw new Error(`Verification failed: ${error.message}`);
            } finally {
                this.loading = false;
            }
        },

        async updateCurrentUser(data) {
            this.loading = true;
            try {
                this.currentUser = await ApiService.updateUserProfile(data);
                console.log("User profile updated successfully.");
            } catch (error) {
                console.error("Failed to update user profile:", error.message);
                throw new Error(`Failed to update user profile: ${error.message}`);
            } finally {
                this.loading = false;
            }
        },

        logout() {
            localStorage.removeItem("authToken");
            this.email = "";
            console.log("User logged out.");
        },

        async resendVerificationCode() {
            this.loading = true;
            try {
                await ApiService.resendVerificationCode(this.email);
                console.log("Verification code resent successfully.");
            } catch (error) {
                console.error("Failed to resend verification code:", error.message);
                throw new Error(`Failed to resend verification code: ${error.message}`);
            } finally {
                this.loading = false;
            }
        },

        async requestPasswordReset() {
            this.loading = true;
            try {
                await ApiService.requestPasswordReset(this.email);
                console.log("Password reset code sent successfully.");
            } catch (error) {
                console.error("Failed to send password reset code:", error.message);
                throw new Error(`Failed to send password reset code: ${error.message}`);
            } finally {
                this.loading = false;
            }
        },

        async resetPassword(resetToken, newPassword) {
            this.loading = true;
            try {
                await ApiService.resetPassword(this.email, resetToken, newPassword);
                console.log("Password reset successfully.");
            } catch (error) {
                console.error("Failed to reset password:", error.message);
                throw new Error(`Failed to reset password: ${error.message}`);
            } finally {
                this.loading = false;
            }
        },
    },
});
