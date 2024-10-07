<template>
  <div class="reset-password">
    <h2>Réinitialiser le mot de passe</h2>
    <form @submit.prevent="resetPassword">
      <FormInput label="Nouveau mot de passe" type="password" v-model="newPassword" />
      <FormInput label="Confirmez le mot de passe" type="password" v-model="confirmPassword" />
      <FormButton type="submit">Réinitialiser le mot de passe</FormButton>
    </form>
    <p v-if="message" :class="{ 'error-message': !success, 'success-message': success }">{{ message }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { ApiService } from '@/utils/apiService.js';
import FormInput from "@/components/FormInput.vue";
import FormButton from "@/components/FormButton.vue";
import router from "@/router/index.js";

const newPassword = ref('');
const confirmPassword = ref('');
const message = ref('');
const success = ref(false);

// Fonction pour réinitialiser le mot de passe
const resetPassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    message.value = 'Les mots de passe ne correspondent pas';
    success.value = false;
    return;
  }

  try {
    await ApiService.resetPassword(newPassword.value); // API pour soumettre le nouveau mot de passe
    success.value = true;
    message.value = 'Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter.';
    router.push('/login'); // Redirection vers la page de connexion
  } catch (error) {
    success.value = false;
    message.value = 'Erreur lors de la réinitialisation du mot de passe. Veuillez réessayer.';
  }
};
</script>

<style scoped lang="scss">
@import "@/styles/utils/_variables.scss";

.reset-password {
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
}
</style>
