<template>
  <div class="register-page">
    <h2>Inscription</h2>
    <form @submit.prevent="registerUser">
      <FormInput label="Adresse email" type="email" v-model="email" />
      <FormInput label="Mot de passe" type="password" v-model="password" />
      <FormInput label="Confirmez votre mot de passe" type="password" v-model="confirmPassword" />
      <button type="submit">S'inscrire</button>
    </form>
    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script>
import axios from 'axios';
import FormInput from '@/components/FormInput.vue';
import {config} from '@/config.js';

export default {
  components: {FormInput},
  data() {
    return {
      email: '',
      password: '',
      confirmPassword: '',
      message: ''
    };
  },
  methods: {
    async registerUser() {
      if (this.password !== this.confirmPassword) {
        this.message = 'Les mots de passe ne correspondent pas';
        return;
      }

      try {
        const response = await axios.post(`${config.backendApi}/users`, {
          email: this.email,
          password: this.password
        });

        this.$router.push({path: '/verify', query: {email: this.email}});
      } catch (error) {
        this.message = 'Erreur lors de l\'inscription';
      }
    }
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
