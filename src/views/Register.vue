<template>
  <div class="register">
    <h2>Inscription</h2>
    <form @submit.prevent="registerUser">
      <FormInput v-model="email" label="Adresse email" type="email" />
      <FormInput v-model="password" label="Mot de passe" type="password" />
      <FormInput v-model="confirmPassword" label="Confirmez votre mot de passe" type="password" />
      <FormButton type="submit">S'inscrire</FormButton>
    </form>
    <p v-if="message" :class="{'success-message': success, 'error-message': !success}">{{ message }}</p>

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
import FormButton from '@/components/FormButton.vue';
import {ApiService} from '@/utils/apiService.js';
import Separator from "@/components/Separator.vue";

const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const message = ref('');
const success = ref(false);
const router = useRouter();

const registerUser = async () => {
  if (password.value !== confirmPassword.value) {
    success.value = false;
    message.value = 'Les mots de passe ne correspondent pas';
    return;
  }

  try {
    await ApiService.createUser(email.value, password.value);
    await router.push({path: '/verify', query: {email: email.value}});
  } catch (error) {
    success.value = false;
    message.value = 'Erreur lors de l\'inscription';
  }
};

const loginLink = () => {
  router.push('/');
};
</script>

<style scoped lang="scss">
@import "@/styles/utils/_variables.scss";

.register {
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
