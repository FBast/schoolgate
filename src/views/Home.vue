<template>
  <div class="login">
    <h2>Connexion</h2>
    <form @submit.prevent="loginUser">
      <FormInput label="Adresse email" type="email" v-model="email" />
      <FormInput label="Mot de passe" type="password" v-model="password" />
      <FormButton type="submit">Se connecter</FormButton>
    </form>
    <p v-if="message" :class="{ 'error-message': !success, 'success-message': success }">{{ message }}</p>
    <p class="forgot-password">
      <router-link to="/forgot-password">Mot de passe oublié ?</router-link>
    </p>

    <Separator text="ou" />
    
    <div class="signup-link">
      <FormButton @click="signupLink">Créer un compte</FormButton>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import FormInput from '@/components/FormInput.vue';
import FormButton from '@/components/FormButton.vue';  // Import du composant Button
import { ApiService } from '@/utils/apiService.js';
import Separator from "@/components/Separator.vue";

const email = ref('');
const password = ref('');
const message = ref('');
const success = ref(false);
const router = useRouter();

const loginUser = async () => {
  try {
    const { token, status } = await ApiService.loginUser(email.value, password.value);

    if (status === 'unverified') {
      message.value = 'Veuillez vérifier votre adresse email avant de vous connecter.';
      await router.push({ path: '/verify', query: { email: email.value } });
    } else {
      localStorage.setItem('authToken', token);
      success.value = true;
      message.value = 'Connexion réussie';
      await router.push('/dashboard');
    }
  } catch (error) {
    success.value = false;
    message.value = 'Email ou mot de passe incorrect';
  }
};

const signupLink = () => {
  router.push('/register');
};
</script>

<style scoped lang="scss">
@import "@/styles/utils/_variables.scss";

.login {
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
