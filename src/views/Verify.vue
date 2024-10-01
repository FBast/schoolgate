<template>
  <div class="verify-page">
    <h2>Vérification de votre compte</h2>
    <form @submit.prevent="verifyUser">
      <p>Entrez le code à 6 chiffres envoyé à {{ email }}</p>
      <FormInput label="Code de validation" type="text" v-model="token" required />
      <FormButton type="submit">Valider</FormButton>
    </form>
    <p v-if="message" :class="{'success-message': success, 'error-message': !success}">{{ message }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import FormInput from '@/components/FormInput.vue';
import FormButton from '@/components/FormButton.vue';
import { ApiService } from "@/utils/apiService.js";

const token = ref('');
const route = useRoute();
const email = ref(route.query.email);
const message = ref('');
const success = ref(false);
const router = useRouter();

const verifyUser = async () => {
  try {
    const responseData = await ApiService.verifyUser(token.value, email.value);

    localStorage.setItem('authToken', responseData.token);

    success.value = true;
    message.value = 'Compte vérifié avec succès !';

    await router.push('/dashboard');
  } catch (error) {
    success.value = false;
    message.value = 'Erreur lors de la vérification';
  }
};
</script>

<style scoped lang="scss">
@import "@/styles/utils/_variables.scss";

.verify-page {
  max-width: 400px;
  margin: 0 auto;
  padding: $spacing-md;
  background-color: $primary-color;
  border-radius: $border-radius;
  box-shadow: $box-shadow;
}

.success-message {
  color: $success-color;
}

.error-message {
  color: $error-color;
}
</style>
