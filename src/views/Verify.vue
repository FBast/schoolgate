<template>
  <div class="verify-page">
    <h2>Vérification de votre compte</h2>
    <form @submit.prevent="verifyUser">
      <p>Entrez le code à 6 chiffres envoyé à {{ email }}</p>
      <FormInput label="Code de validation" type="text" v-model="token" required />
      <button type="submit">Valider</button>
    </form>
    <p v-if="message" :class="{'success-message': success, 'error-message': !success}">{{ message }}</p>
  </div>
</template>

<script setup>
import {ref} from 'vue';
import {useRouter, useRoute} from 'vue-router';
import FormInput from '@/components/FormInput.vue';
import {ApiService} from "@/utils/apiService.js";

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
  }
  catch (error) {
    success.value = false;
    message.value = 'Erreur lors de la vérification';
  }
};
</script>

<style scoped>
.verify-page {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background-color: #e10946;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.success-message {
  color: green;
}

.error-message {
  color: red;
}
</style>