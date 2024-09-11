<template>
  <div class="login-page">
    <h2>Connexion</h2>
    <form @submit.prevent="loginUser">
      <FormInput label="Adresse email" type="email" v-model="email" />
      <FormInput label="Mot de passe" type="password" v-model="password" />
      <button type="submit">Se connecter</button>
    </form>
    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script>
import FormInput from '@/components/FormInput.vue';

export default {
  components: {FormInput},
  data() {
    return {
      email: '',
      password: '',
      message: ''
    };
  },
  methods: {
    loginUser() {
      // Simule la connexion, à adapter avec l'authentification réelle
      if (this.email === 'test@example.com' && this.password === 'password') {
        this.message = 'Connexion réussie';
        this.$router.push('/dashboard');  // Redirection après connexion réussie
      } 
      else {
        this.message = 'Email ou mot de passe incorrect';
      }
    }
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
  color: red;
}
</style>
