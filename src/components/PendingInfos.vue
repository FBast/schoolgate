<template>
  <div class="pending-infos">
    <h2>Informations</h2>
    <form @submit.prevent="submitForm">
      <FormInput v-model="firstName" label="Prénom" type="text" />
      <FormInput v-model="lastName" label="Nom" type="text" />
      <FormInput v-model="birthDate" label="Date de naissance" type="date" />
      <FormSelect v-model="requestedFormation" :options="formations" label="Formation demandée" />
      <FormSelect v-model="requestedYear" :options="years" label="Année demandée" />
      <FormButton type="submit">Valider</FormButton>
    </form>
    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import FormInput from '@/components/FormInput.vue';
import FormSelect from '@/components/FormSelect.vue';
import {ApiService} from "@/utils/apiService.js";
import FormButton from "@/components/FormButton.vue";

const firstName = ref('');
const lastName = ref('');
const birthDate = ref('');
const requestedFormation = ref('');
const requestedYear = ref('');
const message = ref('');

// Listes pour le sélecteur
const formations = ref(['Animation 3D', 'Game Art', 'Design Graphique']);
const years = ref([1, 2, 3, 4]);

const submitForm = async () => {
  try {
    // Utiliser PUT pour mettre à jour l'utilisateur
    await ApiService.updateUserProfile({
      firstName: firstName.value,
      lastName: lastName.value,
      birthDate: birthDate.value,
      requestedFormation: requestedFormation.value,
      requestedYear: requestedYear.value,
      status: 'waiting_exam'
    })
    message.value = 'Informations enregistrées avec succès';
  } catch (error) {
    message.value = 'Erreur lors de l\'enregistrement des informations';
  }
};

</script>

<style scoped lang="scss">
@import "@/styles/utils/_variables.scss";
@import "@/styles/utils/_mixins.scss";

.pending-infos {
  margin: 0 auto;
  padding: 20px;
  background-color: $primary-color;
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
  margin-top: 15px;
}

button:hover {
  background-color: #0056b3;
}

p {
  color: $success-color;
}
</style>
