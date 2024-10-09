<template>
  <div class="pending-infos">
    <h2>Informations</h2>
    <form @submit.prevent="submitForm">
      <FormInput v-model="firstName" label="Prénom" type="text" :error="firstNameError" />
      <FormInput v-model="lastName" label="Nom" type="text" :error="lastNameError" />
      <FormInput v-model="birthDate" label="Date de naissance" type="date" :error="birthDateError" />
      <FormSelect v-model="requestedFormation" :options="formations" label="Formation demandée" :error="formationError" />
      <FormSelect v-model="requestedYear" :options="years" label="Année demandée" :error="yearError" />
      <FormButton type="submit" :disabled="!isFormValid">Valider</FormButton>
    </form>
    <p v-if="message" :class="{'success-message': success, 'error-message': !success}">{{ message }}</p>
  </div>
</template>

<script setup>
import {computed, ref} from 'vue';
import FormInput from '@/components/FormInput.vue';
import FormSelect from '@/components/FormSelect.vue';
import {ApiService} from "@/utils/apiService.js";
import FormButton from "@/components/FormButton.vue";

const firstName = ref('');
const lastName = ref('');
const birthDate = ref('');
const requestedFormation = ref('');
const requestedYear = ref('');
const success = ref(false);
const message = ref('');

// Listes pour le sélecteur
const formations = ref(['Animation 3D', 'Game Art', 'Design Graphique']);
const years = ref([1, 2, 3, 4]);

// Controle des erreurs
const firstNameError = computed(() => !isValidName(firstName.value) ? "Le prénom est requis (minimum 2 caractères)" : '');
const lastNameError = computed(() => !isValidName(lastName.value) ? "Le nom est requis (minimum 2 caractères)" : '');
const birthDateError = computed(() => !isValidBirthDate(birthDate.value) ? "La date de naissance est invalide" : '');
const formationError = computed(() => !requestedFormation.value ? "La formation est requise" : '');
const yearError = computed(() => !requestedYear.value ? "L'année est requise" : '');

// Vérifier si le formulaire est valide
const isFormValid = computed(() => {
  return (
      isValidName(firstName.value) &&
      isValidName(lastName.value) &&
      isValidBirthDate(birthDate.value) &&
      requestedFormation.value &&
      requestedYear.value
  );
});

const emit = defineEmits(['statusChanged']);

// Fonctions de validation
function isValidName(name) {
  return name.length >= 2;
}

function isValidBirthDate(date) {
  const today = new Date().toISOString().split('T')[0];
  return date && date <= today;
}

const submitForm = async () => {
  if (!isFormValid.value) {
    success.value = false;
    message.value = "Veuillez remplir tous les champs correctement.";
    return;
  }
  
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
    emit('statusChanged');
    
    success.value = true;
    message.value = 'Informations enregistrées avec succès';
  } catch (error) {
    success.value = false;
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

.success-message {
  color: $success-color;
}

.error-message {
  color: $error-color;
}
</style>
