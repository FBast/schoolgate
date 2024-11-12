<template>
  <div class="user-informations">
    <form @submit.prevent="updateUser">
      <div class="form-container">
        <!-- Colonne gauche : Informations utilisateur -->
        <div class="form-column">
          <FormInput
              v-model="editableUser.firstName"
              label="Prénom"
              type="text"
              :error="firstNameError"
          />
          <FormInput
              v-model="editableUser.lastName"
              label="Nom"
              type="text"
              :error="lastNameError"
          />
          <FormInput
              v-model="editableUser.birthDate"
              label="Date de naissance"
              type="date"
              :error="birthDateError"
          />
          <FormSelect
              v-model="editableUser.requestedFormation"
              :options="formations"
              label="Formation demandée"
              :error="formationError"
          />
          <FormSelect
              v-model="editableUser.requestedGrade"
              :options="grades"
              label="Année demandée"
              :error="gradeError"
          />
        </div>

        <!-- Colonne droite : Texte d'évaluation et rendez-vous -->
        <div class="form-column">
          <FormSelect
              v-model="editableUser.status"
              :options="statusOptions"
              label="Statut"
              :error="statusError"
          />
          <FormTextarea
              v-model="editableUser.evaluation"
              label="Texte d'évaluation"
              placeholder="Entrez un texte d'évaluation ici..."
          />
          <FormInput
              v-model="editableUser.meetingDate"
              label="Date de rendez-vous"
              type="date"
          />
          <FormButton :disabled="!isFormValid" type="submit">
            Mettre à jour
          </FormButton>
        </div>
      </div>
    </form>
    <p v-if="message" :class="{'success-message': success, 'error-message': !success}">
      {{ message }}
    </p>
  </div>
</template>


<script setup>
import { reactive, computed } from 'vue';
import FormInput from '@/components/FormInput.vue';
import FormSelect from '@/components/FormSelect.vue';
import FormButton from '@/components/FormButton.vue';
import { ApiService } from '@/utils/apiService.js';
import FormTextarea from "@/components/FormTextarea.vue";

const props = defineProps({
  user: Object,
});

const emit = defineEmits(['update']);

const editableUser = reactive({
  lastName: props.user?.lastName || '',
  firstName: props.user?.firstName || '',
  role: props.user?.role || 'user',
  status: props.user?.status || 'pending',
  evaluation: props.user?.evaluation || '',
  meetingDate: props.user?.meetingDate || '',
  requestedFormation: props.user?.requestedFormation || '',
  requestedGrade: props.user?.requestedGrade || '',
  birthDate: props.user?.birthDate || '',
});

// Options pour le champ statut
const statusOptions = [
  { label: 'En attente', value: 'pending' },
  { label: 'Actif', value: 'active' },
  { label: 'Suspendu', value: 'suspended' },
];

// Validation des champs
const firstNameError = computed(() =>
    editableUser.firstName.length < 2 ? 'Le prénom est requis (minimum 2 caractères).' : ''
);
const lastNameError = computed(() =>
    editableUser.lastName.length < 2 ? 'Le nom est requis (minimum 2 caractères).' : ''
);
const birthDateError = computed(() => {
  const today = new Date().toISOString().split('T')[0];
  return !editableUser.birthDate || editableUser.birthDate > today
      ? 'La date de naissance doit être valide.'
      : '';
});
const formationError = computed(() =>
    !editableUser.requestedFormation ? 'La formation est requise.' : ''
);
const gradeError = computed(() =>
    !editableUser.requestedGrade ? 'L\'année est requise.' : ''
);
const statusError = computed(() =>
    !editableUser.status ? 'Le statut est requis.' : ''
);

const isFormValid = computed(() =>
    !firstNameError.value &&
    !lastNameError.value &&
    !birthDateError.value &&
    !formationError.value &&
    !gradeError.value &&
    !statusError.value
);

// Mettre à jour les informations utilisateur
const updateUser = async () => {
  if (!isFormValid.value) {
    return;
  }

  try {
    const updatedUser = { ...editableUser };
    await ApiService.updateUser(props.user._id, updatedUser);
    emit('update', updatedUser);
    alert('Utilisateur mis à jour avec succès.');
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur :', error);
    alert('Erreur lors de la mise à jour.');
  }
};
</script>

<style scoped lang="scss">
@import "@/styles/utils/variables.scss";

.user-informations {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
  padding: $spacing-md;
  background-color: lighten($secondary-color, 10%);
  border-radius: $border-radius;

  .form-container {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-lg;

    .form-column {
      flex: 1;
      min-width: 300px;
      display: flex;
      flex-direction: column;
    }
  }
}
</style>