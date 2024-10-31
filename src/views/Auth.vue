<template>
  <div class="auth">
    <!-- Formulaire de connexion -->
    <div v-if="currentView === 'login'">
      <h2>Connexion</h2>
      <form @submit.prevent="loginUser">
        <FormInput label="Adresse email" type="email" v-model="email" required />
        <FormInput label="Mot de passe" type="password" v-model="password" required />
        <FormButton type="submit">Se connecter</FormButton>
      </form>
      <p v-if="message" :class="{ 'error-message': !success, 'success-message': success }">{{ message }}</p>
      <p class="forgot-password">
        <a href="#" @click.prevent="switchView('resetPassword')">Mot de passe oublié ?</a>
      </p>

      <Separator text="ou" />

      <div class="signup-link">
        <FormButton @click="switchView('register')">Créer un compte</FormButton>
      </div>
    </div>

    <!-- Formulaire d'inscription -->
    <div v-else-if="currentView === 'register'">
      <h2>Inscription</h2>
      <form @submit.prevent="registerUser">
        <FormInput v-model="email" label="Adresse email" type="email" required />
        <FormInput v-model="password" label="Mot de passe" type="password" required />
        <FormInput v-model="confirmPassword" label="Confirmez votre mot de passe" type="password" required />
        <FormButton type="submit">S'inscrire</FormButton>
      </form>
      <p v-if="message" :class="{'success-message': success, 'error-message': !success}">{{ message }}</p>

      <Separator text="ou" />
      <div class="login-link">
        <FormButton @click="switchView('login')">Se connecter avec un compte existant</FormButton>
      </div>
    </div>

    <!-- Formulaire de vérification de l'email -->
    <div v-else-if="currentView === 'verify'">
      <h2>Vérification de votre compte</h2>
      <form @submit.prevent="submitCode">
        <p>Entrez le code à 6 chiffres envoyé à {{ email }}</p>
        <FormInput label="Code de validation" type="text" v-model="token" required />
        <FormButton type="submit">Valider</FormButton>
      </form>
      <FormButton @click="resendCode" class="resend-button">Renvoyer le code</FormButton>
      <p v-if="message" :class="{ 'error-message': !success, 'success-message': success }">{{ message }}</p>

      <Separator text="ou" />
      <div class="login-link">
        <FormButton @click="switchView('login')">Se connecter avec un compte existant</FormButton>
      </div>
    </div>

    <!-- Formulaire de demande de réinitialisation du mot de passe -->
    <div v-else-if="currentView === 'resetPassword'">
      <h2>Réinitialiser le mot de passe</h2>
      <form @submit.prevent="resetPassword">
        <FormInput label="Adresse email" type="email" v-model="email" required />
        <FormButton type="submit">Envoyer le code de réinitialisation</FormButton>
      </form>
      <p v-if="message" :class="{ 'error-message': !success, 'success-message': success }">{{ message }}</p>

      <Separator text="ou" />
      <div class="login-link">
        <FormButton @click="switchView('login')">Se connecter avec un compte existant</FormButton>
      </div>
    </div>

    <!-- Formulaire de confirmation du code et définition du nouveau mot de passe -->
    <div v-else-if="currentView === 'confirmResetPassword'">
      <h2>Définir un nouveau mot de passe</h2>
      <form @submit.prevent="submitNewPassword">
        <p>Entrez le code à 6 chiffres envoyé à {{ email }}</p>
        <FormInput label="Code de validation" type="text" v-model="validationToken" required />
        <FormInput label="Nouveau mot de passe" type="password" v-model="newPassword" required />
        <FormInput label="Confirmez le mot de passe" type="password" v-model="confirmPassword" required />
        <FormButton type="submit">Réinitialiser le mot de passe</FormButton>
      </form>
      <p v-if="message" :class="{ 'error-message': !success, 'success-message': success }">{{ message }}</p>

      <Separator text="ou" />
      <div class="login-link">
        <FormButton @click="switchView('login')">Se connecter avec un compte existant</FormButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import FormInput from '@/components/FormInput.vue';
import FormButton from '@/components/FormButton.vue';
import Separator from "@/components/Separator.vue";
import { ApiService } from '@/utils/apiService.js';
import {jwtDecode} from "jwt-decode";

const currentView = ref('login'); // 'login', 'register', 'verify', 'resetPassword', 'confirmResetPassword'
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const token = ref(''); // Pour stocker le code de vérification
const validationToken = ref(''); // Pour le code de validation du reset password
const newPassword = ref('');
const message = ref('');
const success = ref(false);
const router = useRouter();
const isLoading = ref(false); // Pour gérer l'état de chargement

// Fonction pour basculer entre les vues
const switchView = (view) => {
  // Réinitialiser les messages et les champs
  message.value = '';
  success.value = false;
  password.value = '';
  confirmPassword.value = '';
  token.value = '';
  validationToken.value = '';
  newPassword.value = '';
  if (view !== 'confirmResetPassword') {
    email.value = '';
  }
  currentView.value = view;
};

// Fonction de connexion
const loginUser = async () => {
  try {
    isLoading.value = true;
    const { token: authToken } = await ApiService.loginUser(email.value, password.value);
    const decodedToken = jwtDecode(authToken);

    // Vérifier si l'utilisateur est vérifié ou si c'est un administrateur
    if (decodedToken.status === 'unverified' && decodedToken.role !== 'admin') {
      message.value = 'Veuillez vérifier votre adresse email avant de vous connecter.';
      success.value = false;
      // Passer à la vue de vérification
      currentView.value = 'verify';
    } else {
      localStorage.setItem('authToken', authToken);
      success.value = true;
      message.value = 'Connexion réussie';

      // Redirection en fonction du rôle
      const userRole = decodedToken.role || 'user';
      await router.push('/');
    }
  } catch (error) {
    success.value = false;
    message.value = 'Email ou mot de passe incorrect';
  } finally {
    isLoading.value = false;
  }
};

// Fonction d'inscription
const registerUser = async () => {
  if (password.value !== confirmPassword.value) {
    success.value = false;
    message.value = 'Les mots de passe ne correspondent pas';
    return;
  }

  try {
    isLoading.value = true;
    await ApiService.createUser(email.value, password.value);
    success.value = true;
    message.value = 'Inscription réussie ! Un code de vérification a été envoyé à votre email.';
    // Passer à la vue de vérification
    currentView.value = 'verify';
  } catch (error) {
    success.value = false;
    message.value = 'Erreur lors de l\'inscription : ' + (error.message || error);
  } finally {
    isLoading.value = false;
  }
};

// Fonction de soumission du code de vérification
const submitCode = async () => {
  try {
    isLoading.value = true;
    const responseData = await ApiService.verifyUser(token.value, email.value);
    localStorage.setItem('authToken', responseData.token);
    success.value = true;
    message.value = 'Compte vérifié avec succès !';
    await router.push('/');
  } catch (error) {
    success.value = false;
    message.value = 'Erreur lors de la vérification : ' + (error.message || error);
  } finally {
    isLoading.value = false;
  }
};

// Fonction pour renvoyer le code de vérification
const resendCode = async () => {
  try {
    isLoading.value = true;
    await ApiService.resendVerificationCode(email.value);
    success.value = true;
    message.value = 'Le code de vérification a été renvoyé à votre email.';
  } catch (error) {
    success.value = false;
    message.value = 'Erreur lors de l\'envoi du code : ' + (error.message || error);
  } finally {
    isLoading.value = false;
  }
};

// Fonction de réinitialisation du mot de passe
const resetPassword = async () => {
  try {
    isLoading.value = true;
    await ApiService.requestPasswordReset(email.value);
    success.value = true;
    message.value = 'Un code de réinitialisation a été envoyé à votre adresse email.';
    // Passer à la vue pour confirmer le code et saisir le nouveau mot de passe
    currentView.value = 'confirmResetPassword';
  } catch (error) {
    success.value = false;
    message.value = error.message;
  } finally {
    isLoading.value = false;
  }
};

// Fonction pour soumettre le nouveau mot de passe
const submitNewPassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    success.value = false;
    message.value = 'Les mots de passe ne correspondent pas';
    return;
  }

  try {
    isLoading.value = true;
    await ApiService.resetPassword(email.value, validationToken.value, newPassword.value);
    success.value = true;
    message.value = 'Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter.';
    // Rediriger vers la vue de connexion
    switchView('login');
  } catch (error) {
    success.value = false;
    message.value = error.message;
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped lang="scss">
@import "@/styles/utils/_variables.scss";

.auth {
  max-width: 400px;
  margin: 0 auto;
  padding: $spacing-md;
  background-color: $primary-color;
  border-radius: $border-radius;
  box-shadow: $box-shadow;

  h2 {
    color: white;
    margin-bottom: $spacing-sm;
  }

  p {
    margin-top: $spacing-sm;
  }

  .error-message {
    color: $error-color;
  }

  .success-message {
    color: $success-color;
  }

  .forgot-password {
    margin-top: $spacing-sm;

    a {
      color: white;
      text-decoration: underline;
      cursor: pointer;
    }
  }

  .signup-link, .login-link {
    margin-top: $spacing-sm;
  }

  .resend-button {
    margin-top: $spacing-sm;
  }
}
</style>
