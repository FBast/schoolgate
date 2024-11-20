<template>
  <form @submit.prevent="updateUser">
    <div class="flex-horizontal padding-md gap-md">
      <!-- Colonne gauche : Informations utilisateur -->
      <div class="flex-vertical gap-sm">
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
      <div class="flex-vertical gap-sm">
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
</template>

<script setup>
import { reactive, computed, watch, onMounted } from 'vue';
import FormInput from '@/components/FormInput.vue';
import FormSelect from '@/components/FormSelect.vue';
import FormButton from '@/components/FormButton.vue';
import FormTextarea from '@/components/FormTextarea.vue';
import { ApiService } from '@/utils/apiService.js';
import {useI18n} from "vue-i18n";
import {ROLES_OPTIONS, STATUS_OPTIONS} from "@/utils/constants.js";

const props = defineProps({
  user: Object
});

const emit = defineEmits(['update']);

const { t } = useI18n();

// Données utilisateur modifiables
const editableUser = reactive({
  lastName: props.user?.lastName || '',
  firstName: props.user?.firstName || '',
  role: props.user?.role || ROLES_OPTIONS.user,
  status: props.user?.status || 'pending',
  evaluation: props.user?.evaluation || '',
  meetingDate: props.user?.meetingDate || '',
  requestedFormation: props.user?.requestedFormation || '',
  requestedGrade: props.user?.requestedGrade || '',
  birthDate: props.user?.birthDate || '',
});

// Extraire uniquement la date
editableUser.birthDate = editableUser.birthDate
    ? editableUser.birthDate.split('T')[0] // Extraire uniquement la date
    : '';


// Options pour le champ statut
const statusOptions = Object.keys(STATUS_OPTIONS).map((key) => ({
  label: t(key), // Utiliser la clé pour traduire
  value: STATUS_OPTIONS[key],
}));

// Listes des formations et années
const formations = reactive([]);
const grades = reactive([]);

// Validation des champs
const firstNameError = computed(() =>
    editableUser.firstName.length < 2 ? t('first_name_error') : ''
);
const lastNameError = computed(() =>
    editableUser.lastName.length < 2 ? t('last_name_error') : ''
);
const birthDateError = computed(() => {
  const today = new Date().toISOString().split('T')[0];
  return !editableUser.birthDate || editableUser.birthDate > today
      ? t('birth_date_error')
      : '';
});
const formationError = computed(() =>
    !editableUser.requestedFormation ? t('formation_error') : ''
);
const gradeError = computed(() =>
    !editableUser.requestedGrade ? t('grade_error') : ''
);
const statusError = computed(() =>
    !editableUser.status ? t('status_error') : ''
);

const isFormValid = computed(() =>
    !firstNameError.value &&
    !lastNameError.value &&
    !birthDateError.value &&
    !formationError.value &&
    !gradeError.value &&
    !statusError.value
);

// Récupérer les formations au montage
const fetchFormations = async () => {
  try {
    const response = await ApiService.getFormations();
    formations.splice(0, formations.length, ...response.map(formation => ({
      label: formation.title,
      value: formation._id,
    })));
  } catch (error) {
    console.error(t('fetching_formations_error'), error);
  }
};

// Récupérer les années en fonction de la formation sélectionnée
const fetchGrades = async (formationId) => {
  try {
    const response = await ApiService.getFormationGrades(formationId);
    grades.splice(0, grades.length, ...response.map(grade => ({
      label: `Année ${grade.grade}`,
      value: grade._id,
    })));
  } catch (error) {
    console.error(t('fetching_grades_error'), error);
  }
};

// Mettre à jour les années disponibles lorsque la formation change
watch(() => editableUser.requestedFormation, (newFormation) => {
  if (newFormation) {
    fetchGrades(newFormation);
    editableUser.requestedGrade = ''; // Réinitialiser l'année sélectionnée
  }
});

// Mettre à jour les informations utilisateur
const updateUser = async () => {
  if (!isFormValid.value) {
    return;
  }

  try {
    const updatedUser = { ...editableUser };
    await ApiService.updateUser(props.user._id, updatedUser);
    emit('update', updatedUser);
    alert(t('update_success'));
  } catch (error) {
    console.error(t('update_error'), error);
    alert(t('update_error'));
  }
};

// Récupérer les données de base au montage
onMounted(() => {
  fetchFormations();
  if (editableUser.requestedFormation) {
    fetchGrades(editableUser.requestedFormation);
  }
});
</script>