import { defineStore } from "pinia";
import { ApiService } from "@/utils/apiService.js";

export const useAuthStore = defineStore("authStore", {
    state: () => ({
        email: "",
        message: "",
        success: false,
        loading: false,
        userRole: null,
    }),

    getters: {
        isAuthenticated: (state) => !!state.userRole,
        isAdmin: (state) => state.userRole === "admin",
    },

    actions: {
        resetState() {
            this.email = "";
            this.message = "";
            this.success = false;
            this.loading = false;
        },

        async loginUser(password) {
            try {
                this.loading = true;
                const { token: authToken } = await ApiService.loginUser(this.email, password);

                // Décoder le JWT pour obtenir des informations utilisateur
                const decodedToken = this.decodeToken(authToken);

                if (decodedToken.status === "unverified" && decodedToken.role !== "admin") {
                    this.message = "Please verify your email to continue.";
                    this.success = false;
                    return "verify";
                }

                // Stockage du token et mise à jour du rôle utilisateur
                localStorage.setItem("authToken", authToken);
                this.userRole = decodedToken.role;
                this.success = true;
                this.message = "Login successful.";

                // Retourner la vue cible
                return "dashboard";
            } catch (error) {
                this.success = false;
                this.message = "Login failed. Please check your credentials.";
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async registerUser(password) {
            try {
                this.loading = true;
                await ApiService.createUser(this.email, password);
                this.success = true;
                this.message = "Registration successful. Please verify your email.";
                return "verify";
            } catch (error) {
                this.success = false;
                this.message = "Registration failed. Please try again.";
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async verifyUser(verificationCode) {
            try {
                this.loading = true;
                const { token: authToken } = await ApiService.verifyUser(verificationCode, this.email);

                // Stocker le token après vérification
                localStorage.setItem("authToken", authToken);
                const decodedToken = this.decodeToken(authToken);

                this.userRole = decodedToken.role;
                this.success = true;
                this.message = "Verification successful.";
            } catch (error) {
                this.success = false;
                this.message = "Verification failed. Please check the code and try again.";
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async resendVerificationCode() {
            try {
                this.loading = true;
                await ApiService.resendVerificationCode(this.email);
                this.success = true;
                this.message = "Verification code resent successfully.";
            } catch (error) {
                this.success = false;
                this.message = "Failed to resend verification code.";
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async requestPasswordReset() {
            try {
                this.loading = true;
                await ApiService.requestPasswordReset(this.email);
                this.success = true;
                this.message = "Password reset code sent successfully.";
            } catch (error) {
                this.success = false;
                this.message = "Failed to send password reset code.";
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async resetPassword(resetToken, newPassword) {
            try {
                this.loading = true;
                await ApiService.resetPassword(this.email, resetToken, newPassword);
                this.success = true;
                this.message = "Password reset successfully.";
            } catch (error) {
                this.success = false;
                this.message = "Failed to reset password.";
                throw error;
            } finally {
                this.loading = false;
            }
        },

        decodeToken(token) {
            try {
                return JSON.parse(atob(token.split(".")[1]));
            } catch (error) {
                console.error("Failed to decode token:", error);
                return null;
            }
        },

        logout() {
            localStorage.removeItem("authToken");
            this.userRole = null;
            this.resetState();
        },
    },
});