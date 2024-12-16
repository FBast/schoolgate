<template>
  <header>
    <img src="@/assets/logo.png" alt="Logo ENSI" class="logo">
  </header>
  <main>
    <div class="layout-restricted gap-md">
      <!-- Formulaire de connexion -->
      <div v-if="currentView === 'login'">
        <div class="panel flex-vertical gap-md">
          <h2>{{ $t("login") }}</h2>
          <form class="flex-vertical gap-md" @submit.prevent="login">
            <FormInput v-model="authStore.email" :label="$t('email')" type="email" required />
            <FormInput v-model="password" :label="$t('password')" type="password" required />
            <FormButton :label="$t('login')" type="submit" />
          </form>
          <p class="link">
            <a href="#" @click.prevent="switchView('resetPassword')">{{ $t('forgot_password') }}</a>
          </p>
        </div>
        <Separator :text="$t('or')" />
        <div class="panel">
          <FormButton @click="switchView('register')" :label="$t('create_account')"></FormButton>
        </div>
      </div>

      <div v-else>
        <div class="panel flex-vertical gap-md">
          <!-- Formulaire d'inscription -->
          <div v-if="currentView === 'register'" class="flex-vertical gap-md">
            <h2>{{ $t("register") }}</h2>
            <form class="flex-vertical gap-md" @submit.prevent="register">
              <FormInput v-model="authStore.email" :label="$t('email')" type="email" required />
              <FormInput v-model="password" :label="$t('password')" type="password" required />
              <FormInput v-model="confirmPassword" :label="$t('confirm_password')" type="password" required />
              <FormButton :label="$t('register_button')" type="submit" />
            </form>
          </div>

          <!-- Formulaire de vérification -->
          <div v-else-if="currentView === 'verify'" class="flex-vertical gap-md">
            <h2>{{ $t("verify_account") }}</h2>
            <p>{{ $t("verify_mail_description") }}</p>
            <form class="flex-vertical gap-md" @submit.prevent="submitVerificationCode">
              <FormInput v-model="verificationCode" :label="$t('verification_code')" type="text" required />
              <FormButton :label="$t('validate')" type="submit" />
            </form>
            <FormButton @click="resendCode" :label="$t('resend_code')"> </FormButton>
          </div>

          <!-- Formulaire de réinitialisation du mot de passe -->
          <div v-else-if="currentView === 'resetPassword'" class="flex-vertical gap-md">
            <h2>{{ $t("reset_password") }}</h2>
            <form class="flex-vertical gap-md" @submit.prevent="resetPassword">
              <FormInput v-model="authStore.email" :label="$t('email')" type="email" required />
              <FormButton :label="$t('send_reset_code')" type="submit" />
            </form>
          </div>

          <!-- Formulaire de confirmation de réinitialisation -->
          <div v-else-if="currentView === 'confirmResetPassword'" class="flex-vertical gap-md">
            <h2>{{ $t("define_new_password") }}</h2>
            <form class="flex-vertical gap-md" @submit.prevent="submitNewPassword">
              <FormInput v-model="resetToken" :label="$t('verification_code')" type="text" required />
              <FormInput v-model="password" :label="$t('new_password')" type="password" required />
              <FormInput v-model="confirmPassword" :label="$t('confirm_password')" type="password" required />
              <FormButton :label="$t('reset_password_button')" type="submit" />
            </form>
          </div>
        </div>
        <Separator :text="$t('or')" />
        <div class="panel">
          <FormButton @click="switchView('login')" :label="$t('existing_account')"></FormButton>
        </div>
      </div>
    </div>

    <div v-if="message" class="panel flex-vertical gap-md">
      <p :class="{ 'error-message': !success, 'success-message': success }">
        {{ message }}
      </p>
    </div>
  </main>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useAuthStore } from "@/stores/authStore";
import FormInput from "@/components/FormInput.vue";
import FormButton from "@/components/FormButton.vue";
import Separator from "@/components/Separator.vue";

const authStore = useAuthStore();
const router = useRouter();
const { t } = useI18n();

const currentView = ref("login");
const password = ref("");
const confirmPassword = ref("");
const verificationCode = ref("");
const resetToken = ref("");
const message = ref("");
const success = ref(false);

// Switch entre les vues
const switchView = (view) => {
  currentView.value = view;
  message.value = "";
  success.value = false;
  password.value = "";
  confirmPassword.value = "";
  verificationCode.value = "";
  resetToken.value = "";
};

// Connexion
const login = async () => {
  try {
    const nextView = await authStore.loginUser(password.value);
    if (nextView === "dashboard") {
      await router.push("/");
    } else {
      currentView.value = nextView;
    }
    success.value = true;
    message.value = t("login_successful");
  } catch (error) {
    success.value = false;
    if (error.response?.status === 404) {
      // Utilisateur non trouvé
      message.value = t("account_not_found");
    } else if (error.response?.status === 401) {
      // Mot de passe incorrect
      message.value = t("incorrect_password");
    } else {
      // Autres erreurs
      message.value = t("error_occurred");
    }
  }
};

// Inscription
const register = async () => {
  if (password.value !== confirmPassword.value) {
    success.value = false;
    message.value = t("passwords_do_not_match");
    return;
  }

  try {
    await authStore.registerUser(password.value);
    currentView.value = "verify";
    success.value = true;
    message.value = t("registration_successful");
  } catch (error) {
    success.value = false;
    if (error.response?.status === 400) {
      // Email déjà utilisé
      message.value = t("email_already_used");
    } else {
      // Autres erreurs
      message.value = t("error_occurred");
    }
  }
};

// Soumission du code de vérification
const submitVerificationCode = async () => {
  try {
    await authStore.verifyUser(verificationCode.value);
    await router.push("/");
    success.value = true;
    message.value = t("verification_successful");
  } catch {
    success.value = false;
    message.value = t("error_occurred");
  }
};

// Réinitialisation du mot de passe
const resetPassword = async () => {
  try {
    await authStore.requestPasswordReset();
    currentView.value = "confirmResetPassword";
    success.value = true;
    message.value = t("reset_code_sent");
  } catch {
    success.value = false;
    message.value = t("error_occurred");
  }
};

// Soumission du nouveau mot de passe
const submitNewPassword = async () => {
  if (password.value !== confirmPassword.value) {
    success.value = false;
    message.value = t("passwords_do_not_match");
    return;
  }

  try {
    await authStore.resetPassword(resetToken.value, password.value);
    currentView.value = "login";
    success.value = true;
    message.value = t("password_reset_successful");
  } catch {
    success.value = false;
    message.value = t("error_occurred");
  }
};

// Renvoyer le code de vérification
const resendCode = async () => {
  try {
    await authStore.resendVerificationCode();
    success.value = true;
    message.value = t("code_resent");
  } catch {
    success.value = false;
    message.value = t("error_occurred");
  }
};
</script>