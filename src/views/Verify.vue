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

<script>
import axios from 'axios';
import { config } from '@/config.js';
import FormInput from '@/components/FormInput.vue';

export default {
  components: { FormInput },
  data() {
    return {
      token: '',
      email: this.$route.query.email,
      message: '',
      success: false
    };
  },
  methods: {
    async verifyUser() {
      try {
        const response = await axios.post(`${config.backendApi}/users/verify`, {
          token: this.token,
          email: this.email
        });

        localStorage.setItem('authToken', response.data.token);
        
        this.success = true;
        this.message = 'Compte vérifié avec succès !';

        await this.loginUser(this.email); // Fonction pour logguer l'utilisateur
        this.$router.push('/home');
      } 
      catch (error) {
        this.success = false;
        this.message = 'Erreur lors de la vérification';
      }
    },

    async loginUser(email) {
      const response = await axios.post(`${config.backendApi}/users/login`, {
        email: email,
        password: 'dummy_password_for_login'
      });

      localStorage.setItem('authToken', response.data.token);
    }
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
