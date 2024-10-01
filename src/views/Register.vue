<template>
  <div class="register-page">
    <h2>Inscription</h2>
    <form @submit.prevent="registerUser">
      <FormInput v-model="email" label="Adresse email" type="email" />
      <FormInput v-model="password" label="Mot de passe" type="password" />
      <FormInput v-model="confirmPassword" label="Confirmez votre mot de passe" type="password" />
      <FormButton type="submit">S'inscrire</FormButton>
    </form>
    <p v-if="message">{{ message }}</p>

    <Separator text="ou" />

    <div class="login-link">
      <FormButton @click="loginLink">Se connecter avec un compte existant</FormButton>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue';
import {useRouter} from 'vue-router';
import FormInput from '@/components/FormInput.vue';
import FormButton from '@/components/FormButton.vue';  // Import du composant Button
import {ApiService} from '@/utils/apiService.js';
import Separator from "@/components/Separator.vue";

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
  } catch (error) {
    message.value = 'Erreur lors de l\'inscription';
  }
};

const loginLink = () => {
  router.push('/');
};
</script>

<style scoped lang="scss">
@import "@/styles/utils/_variables.scss";

.register-page {
  max-width: 400px;
  margin: 0 auto;
  padding: $spacing-md;
  background-color: $primary-color;
  border-radius: $border-radius;
  box-shadow: $box-shadow;
}

p {
  color: $error-color;
}
</style>
