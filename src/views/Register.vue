<template>
  <div class="register-page">
    <h2>Inscription</h2>
    <form @submit.prevent="registerUser">
      <FormInput v-model="email" label="Adresse email" type="email" />
      <FormInput v-model="password" label="Mot de passe" type="password" />
      <FormInput v-model="confirmPassword" label="Confirmez votre mot de passe" type="password" />
      <button type="submit">S'inscrire</button>
    </form>
    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import FormInput from '@/components/FormInput.vue';
import {ApiService} from "@/utils/apiService.js";

const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const message = ref('');
const router = useRouter();

const registerUser = async () => {
  if (password.value !== confirmPassword.value) {
    message.value = 'Les mots de passe ne correspondent pas';
    return;
  }

  try {
    await ApiService.createUser(email.value, password.value);

    await router.push({path: '/verify', query: {email: email.value}});
  }
  catch (error) {
    message.value = 'Erreur lors de l\'inscription';
  }
};
</script>

<style scoped>
.register-page {
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

p {
  color: red;
}
</style>
