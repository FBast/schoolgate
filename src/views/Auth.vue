<template>
  <div class="layout-restricted">
    <!-- Formulaire de connexion -->
    <div class="panel auth" v-if="currentView === 'login'">
      <h2>{{ $t('login') }}</h2>
      <form class="flex-vertical gap-sm" @submit.prevent="loginUser">
          <FormInput :label="$t('email')" type="email" v-model="email" required />
          <FormInput :label="$t('password')" type="password" v-model="password" required />
          <FormButton :label="$t('login')"
                      type="submit">
          </FormButton>
      </form>
      <p v-if="message" :class="{ 'error-message': !success, 'success-message': success }">{{ message }}</p>
      <p class="link">
        <a href="#" @click.prevent="switchView('resetPassword')">{{ $t('forgot_password') }}</a>
      </p>

      <Separator :text="$t('or')" />

      <div class="link">
        <FormButton @click="switchView('register')" :label="$t('create_account')"></FormButton>
      </div>
    </div>

    <!-- Formulaire d'inscription -->
    <div class="panel register" v-else-if="currentView === 'register'">
      <h2>{{ $t('register') }}</h2>
      <form class="flex-vertical gap-sm" @submit.prevent="registerUser">
        <FormInput v-model="email" :label="$t('email')" type="email" required />
        <FormInput v-model="password" :label="$t('password')" type="password" required />
        <FormInput v-model="confirmPassword" :label="$t('confirm_password')" type="password" required />
        <FormButton type="submit" :label="$t('register_button')"></FormButton>
      </form>
      <p v-if="message" :class="{ 'success-message': success, 'error-message': !success }">{{ message }}</p>

      <Separator :text="$t('or')" />
      <div class="login-link">
        <FormButton @click="switchView('login')" :label="$t('existing_account')"></FormButton>
      </div>
    </div>

    <!-- Formulaire de vérification de l'email -->
    <div class="panel verify" v-else-if="currentView === 'verify'">
      <h2>{{ $t('verify_account') }}</h2>
      <form class="flex-vertical gap-sm" @submit.prevent="submitCode">
        <p>{{ $t('enter_verification_code', { email: email }) }}</p>
        <FormInput :label="$t('verification_code')" type="text" v-model="token" required />
        <FormButton type="submit" :label="$t('validate')"></FormButton>
      </form>
      <FormButton @click="resendCode" :label="$t('resend_code')"> </FormButton>
      <p v-if="message" :class="{ 'error-message': !success, 'success-message': success }">{{ message }}</p>

      <Separator :text="$t('or')" />
      <div class="login-link">
        <FormButton @click="switchView('login')" :label="$t('existing_account')"></FormButton>
      </div>
    </div>

    <!-- Formulaire de demande de réinitialisation du mot de passe -->
    <div class="panel reset" v-else-if="currentView === 'resetPassword'">
      <h2>{{ $t('reset_password') }}</h2>
      <form class="flex-vertical gap-sm" @submit.prevent="resetPassword">
        <FormInput :label="$t('email')" type="email" v-model="email" required />
        <FormButton type="submit" :label="$t('send_reset_code')"></FormButton>
      </form>
      <p v-if="message" :class="{ 'error-message': !success, 'success-message': success }">{{ message }}</p>

      <Separator :text="$t('or')" />
      <div class="login-link">
        <FormButton @click="switchView('login')" :label="$t('existing_account')"></FormButton>
      </div>
    </div>

    <!-- Formulaire de confirmation du code et définition du nouveau mot de passe -->
    <div class="panel confirmReset" v-else-if="currentView === 'confirmResetPassword'">
      <h2>{{ $t('define_new_password') }}</h2>
      <form class="flex-vertical gap-sm" @submit.prevent="submitNewPassword">
        <p>{{ $t('enter_reset_code', { email: email }) }}</p>
        <FormInput :label="$t('verification_code')" type="text" v-model="validationToken" required />
        <FormInput :label="$t('new_password')" type="password" v-model="newPassword" required />
        <FormInput :label="$t('confirm_password')" type="password" v-model="confirmPassword" required />
        <FormButton type="submit" :label="$t('reset_password_button') "></FormButton>
      </form>
      <p v-if="message" :class="{ 'error-message': !success, 'success-message': success }">{{ message }}</p>

      <Separator :text="$t('or')" />
      <div class="login-link">
        <FormButton @click="switchView('login')" :label="$t('existing_account')"></FormButton>
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
import { useI18n } from 'vue-i18n';
import {ROLES_OPTIONS} from "@/utils/constants.js";

const { t } = useI18n(); // Initialiser la fonction t pour l'internationalisation

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

    if (decodedToken.status === 'unverified' && decodedToken.role !== ROLES_OPTIONS.admin) {
      message.value = t('verify_email_prompt');
      success.value = false;
      currentView.value = 'verify';
    } else {
      localStorage.setItem('authToken', authToken);
      success.value = true;
      message.value = t('login_success');

      const userRole = decodedToken.role || ROLES_OPTIONS.user;
      await router.push('/');
    }
  } catch (error) {
    success.value = false;
    message.value = t('login_error');
  } finally {
    isLoading.value = false;
  }
};

// Fonction d'inscription
const registerUser = async () => {
  if (password.value !== confirmPassword.value) {
    success.value = false;
    message.value = t('passwords_do_not_match');
    return;
  }

  try {
    isLoading.value = true;
    await ApiService.createUser(email.value, password.value);
    success.value = true;
    message.value = t('register_success');
    currentView.value = 'verify';
  } catch (error) {
    success.value = false;
    message.value = t('register_error', { error: error.message || error });
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
    message.value = t('verification_success');
    await router.push('/');
  } catch (error) {
    success.value = false;
    message.value = t('verification_error', { error: error.message || error });
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
    message.value = t('resend_code_success');
  } catch (error) {
    success.value = false;
    message.value = t('resend_code_error', { error: error.message || error });
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
    message.value = t('reset_password_success');
    currentView.value = 'confirmResetPassword';
  } catch (error) {
    success.value = false;
    message.value = t('reset_password_error', { error: error.message || error });
  } finally {
    isLoading.value = false;
  }
};

// Fonction pour soumettre le nouveau mot de passe
const submitNewPassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    success.value = false;
    message.value = t('passwords_do_not_match');
    return;
  }

  try {
    isLoading.value = true;
    await ApiService.resetPassword(email.value, validationToken.value, newPassword.value);
    success.value = true;
    message.value = t('new_password_success');
    switchView('login');
  } catch (error) {
    success.value = false;
    message.value = t('new_password_error', { error: error.message || error });
  } finally {
    isLoading.value = false;
  }
};
</script>
