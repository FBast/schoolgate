<template>
  <div class="panel flex-vertical gap-md">
    <div class="header">
      <h2>{{ $t('candidate_information') }}</h2>
    </div>
    <label>Prénom : {{ userData.firstName }}</label>
    <label>Nom : {{ userData.lastName }}</label>
    <label>Date de naissance : {{ userData.birthDate }}</label>
    <label>Formation demandée : {{ userData.requestedFormation }}</label>
    <label>Année demandée : {{ userData.requestedGrade }}</label>

    <div class="actions">
      <button @click="toggleEmailEdit">Modifier l'adresse email</button>
      <button @click="togglePasswordEdit">Modifier le mot de passe</button>
    </div>
    
    <!-- Section pour modifier l'email -->
    <div v-if="editEmail" class="edit-section">
      <FormInput v-model="newEmail" label="Nouvelle adresse email" type="email" />
      <FormButton @click="updateEmail">Confirmer l'adresse email</FormButton>
    </div>

    <!-- Section pour modifier le mot de passe -->
    <div v-if="editPassword" class="edit-section">
      <FormInput v-model="currentPassword" label="Mot de passe actuel" type="password" />
      <FormInput v-model="newPassword" label="Nouveau mot de passe" type="password" />
      <FormButton @click="updatePassword">Confirmer le mot de passe</FormButton>
    </div>

    <p v-if="message" :class="{'success-message': success, 'error-message': !success}">{{ message }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import FormInput from '@/components/FormInput.vue';
import FormButton from '@/components/FormButton.vue';
import { ApiService } from "@/utils/apiService.js";

const userData = ref({});
const message = ref('');
const success = ref(false);
const editEmail = ref(false);
const editPassword = ref(false);
const newEmail = ref('');
const currentPassword = ref('');
const newPassword = ref('');

// Charger les informations utilisateur au montage du composant
const loadUserData = async () => {
  try {
    const profile = await ApiService.getUserProfile();
    userData.value = profile;
  } catch (error) {
    message.value = 'Erreur lors de la récupération des informations utilisateur';
    success.value = false;
  }
};

onMounted(() => {
  loadUserData();
});

// Fonction pour basculer l'édition de l'email
const toggleEmailEdit = () => {
  editEmail.value = !editEmail.value;
  newEmail.value = '';
};

// Fonction pour basculer l'édition du mot de passe
const togglePasswordEdit = () => {
  editPassword.value = !editPassword.value;
  currentPassword.value = '';
  newPassword.value = '';
};

// Mise à jour de l'email
const updateEmail = async () => {
  try {
    await ApiService.updateUserProfile({email: newEmail.value});
    message.value = 'Adresse email mise à jour avec succès';
    success.value = true;
    userData.value.email = newEmail.value;
    toggleEmailEdit();
  } catch (error) {
    message.value = 'Erreur lors de la mise à jour de l\'adresse email';
    success.value = false;
  }
};

// Mise à jour du mot de passe
const updatePassword = async () => {
  try {
    await ApiService.updateUserProfile({password: newPassword.value, currentPassword: currentPassword.value});
    message.value = 'Mot de passe mis à jour avec succès';
    success.value = true;
    togglePasswordEdit();
  } catch (error) {
    message.value = 'Erreur lors de la mise à jour du mot de passe';
    success.value = false;
  }
};
</script>
