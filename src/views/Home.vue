<template>
  <div class="login-page">
    <h2>Connexion</h2>
    <form @submit.prevent="loginUser">
      <FormInput label="Adresse email" type="email" v-model="email" />
      <FormInput label="Mot de passe" type="password" v-model="password" />
      <button type="submit">Se connecter</button>
    </form>
    <p v-if="message" :class="{ 'error-message': !success, 'success-message': success }">{{ message }}</p>
  </div>
</template>

<script setup>
import axiosInstance from '../utils/axiosInstance.js';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import FormInput from '@/components/FormInput.vue';
import { config } from '@/config.js';

const email = ref('');
const password = ref('');
const message = ref('');
const success = ref(false);
const router = useRouter();

const loginUser = async () => {
  try {
    const response = await axiosInstance.post(`${config.backendApi}/users/login`, {
      email: email.value,
      password: password.value
    });

    // Si l'utilisateur est trouvé et l'authentification réussie
    const { token, status } = response.data;

    if (status === 'unverified') {
      // Si l'email n'est pas encore vérifié
      message.value = 'Veuillez vérifier votre adresse email avant de vous connecter.';
      await router.push({path: '/verify', query: {email: email.value}});
    }
    else {
      // Si l'email est vérifié, sauvegarder le JWT dans localStorage
      localStorage.setItem('authToken', token);
      success.value = true;
      message.value = 'Connexion réussie';

      // Rediriger vers le tableau de bord si l'email est vérifié
      await router.push('/dashboard');
    }
  }
  catch (error) {
    success.value = false;
    message.value = 'Email ou mot de passe incorrect';
  }
};
</script>

<style scoped>
.login-page {
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
  margin-top: 10px;
}

.success-message {
  color: green;
}

.error-message {
  color: red;
}
</style>
