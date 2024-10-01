<template>
  <div class="forgot-password-page">
    <h2>Mot de passe oublié</h2>
    <form @submit.prevent="sendResetEmail">
      <FormInput label="Adresse email" type="email" v-model="email" />
      <FormButton type="submit">Envoyer le lien de réinitialisation</FormButton>
    </form>
    <p v-if="message" :class="{ 'error-message': !success, 'success-message': success }">{{ message }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { ApiService } from '@/utils/apiService.js';
import FormInput from "@/components/FormInput.vue";
import FormButton from "@/components/FormButton.vue";  // Import du composant Button

const email = ref('');
const message = ref('');
const success = ref(false);

const sendResetEmail = async () => {
  try {
    success.value = true;
    message.value = 'Un email de réinitialisation a été envoyé à votre adresse.';
  } catch (error) {
    success.value = false;
    message.value = 'Erreur lors de l\'envoi de l\'email. Veuillez réessayer.';
  }
};
</script>

<style scoped lang="scss">
@import "@/styles/utils/_variables.scss";
@import "@/styles/utils/_mixins.scss";

.forgot-password-page {
  max-width: 400px;
  margin: 0 auto;
  padding: $spacing-md;
  background-color: $primary-color;
  border-radius: $border-radius;
  box-shadow: $box-shadow;
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
</style>