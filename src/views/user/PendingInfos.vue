<template>
  <div class="container">
    <div class="panel pending-infos">
      <div class="header">
        <h2 class="title">Informations</h2>
      </div>
    </div>
    <form @submit.prevent="submitForm">
      <FormInput v-model="firstName" :label="$t('first_name')" type="text" :error="firstNameError" />
      <FormInput v-model="lastName" :label="$t('last_name')" type="text" :error="lastNameError" />
      <FormInput v-model="birthDate" :label="$t('birth_date')" type="date" :error="birthDateError" />
      <FormSelect v-model="requestedFormation" :options="formations" :label="$t('formation')" :error="formationError" />
      <FormSelect v-model="requestedGrade" :options="grades" :label="$t('grade')" :error="gradeError" />
      <FormButton type="submit" :disabled="!isFormValid">{{ $t('update') }}</FormButton>
    </form>
    <p v-if="message" :class="{'success-message': success, 'error-message': !success}">{{ message }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import FormInput from '@/components/FormInput.vue';
import FormSelect from '@/components/FormSelect.vue';
import { ApiService } from "@/utils/apiService.js";
import FormButton from "@/components/FormButton.vue";

const firstName = ref('');
const lastName = ref('');
const birthDate = ref('');
const requestedFormation = ref('');
const requestedGrade = ref('');
const success = ref(false);
const message = ref('');

// Listes pour les sélecteurs
const formations = ref([]);
const grades = ref([]);

// Controle des erreurs
const firstNameError = computed(() =>
    !isValidName(firstName.value) ? $t('first_name_error') : ''
);
const lastNameError = computed(() =>
    !isValidName(lastName.value) ? $t('last_name_error') : ''
);
const birthDateError = computed(() =>
    !isValidBirthDate(birthDate.value) ? $t('birth_date_error') : ''
);
const formationError = computed(() =>
    !requestedFormation.value ? $t('formation_error') : ''
);
const gradeError = computed(() =>
    !requestedGrade.value ? $t('grade_error') : ''
);

// Vérifier si le formulaire est valide
const isFormValid = computed(() => {
  return (
      isValidName(firstName.value) &&
      isValidName(lastName.value) &&
      isValidBirthDate(birthDate.value) &&
      requestedFormation.value &&
      requestedGrade.value
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

// Fetch formations au montage du composant
const fetchFormations = async () => {
  try {
    const response = await ApiService.getFormations();
    formations.value = response.map(formation => ({
      label: formation.title,
      value: formation._id
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération des formations:', error);
  }
};

// Fetch grades en fonction de la formation sélectionnée
const fetchYears = async (formationId) => {
  try {
    const response = await ApiService.getGrades(formationId);
    grades.value = response.map(grade => ({
      label: `Année ${grade.grade}`,
      value: grade._id
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération des grades:', error);
  }
};

// Watch pour détecter le changement de formation et mettre à jour les années disponibles
watch(requestedFormation, (newFormationId) => {
  if (newFormationId) {
    fetchYears(newFormationId);
    requestedGrade.value = ''; // Réinitialiser l'année sélectionnée
  }
});

// Soumettre le formulaire
const submitForm = async () => {
  if (!isFormValid.value) {
    success.value = false;
    message.value = $t('error_submit_form');
    return;
  }

  try {
    await ApiService.updateUserProfile({
      firstName: firstName.value,
      lastName: lastName.value,
      birthDate: birthDate.value,
      requestedFormation: requestedFormation.value,
      requestedGrade: requestedGrade.value,
      status: 'waiting_exam'
    });
    emit('statusChanged');

    success.value = true;
    message.value = $t('update_success');
  } catch (error) {
    success.value = false;
    message.value = $t('update_error');
  }
};

// Appeler fetchFormations au montage du composant
onMounted(() => {
  fetchFormations();
});
</script>

<style scoped lang="scss">
@import "@/styles/utils/variables";
@import "@/styles/utils/mixins";

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
