<template>
  <div class="flex-horizontal gap-md">
    <div class="panel flex-vertical gap-md">
      <div class="header">
        <h2 class="title">{{ $t('awaiting_information_title') }}</h2>
      </div>
      <div>
        <p>
          <!-- Description de l'étape -->
          {{ $t('awaiting_information_description') }}
        </p>
      </div>
    </div>
    <div class="panel flex-vertical gap-md">
      <div class="header">
        <h2 class="title">{{ $t('information_title') }}</h2>
      </div>
      <form @submit.prevent="submitForm">
        <div class="flex-vertical gap-sm">
          <FormInput v-model="authStore.currentUser.firstName" :label="$t('first_name')" type="text" :error="firstNameError" />
          <FormInput v-model="authStore.currentUser.lastName" :label="$t('last_name')" type="text" :error="lastNameError" />
          <FormInput v-model="authStore.currentUser.birthDate" :label="$t('birth_date')" type="date" :error="birthDateError" />
          <FormSelect v-model="authStore.currentUser.requestedFormation" :options="formationStore.formationOptions" :label="$t('formation')" :error="formationError" />
          <FormSelect v-model="authStore.currentUser.requestedGrade" :options="gradeOptions" :label="$t('grade')" :error="gradeError" />
          <FormButton type="submit" :label="$t('update')" :disabled="!isFormValid"></FormButton>
        </div>
      </form>
      <p v-if="authStore.message" :class="{'success-message': authStore.success, 'error-message': !authStore.success}">
        {{ authStore.message }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue';
import { useAuthStore } from "@/stores/authStore.js";
import { useFormationStore } from '@/stores/formationStore';
import FormInput from '@/components/FormInput.vue';
import FormSelect from '@/components/FormSelect.vue';
import FormButton from '@/components/FormButton.vue';
import { useI18n } from 'vue-i18n';
import { STATUS_OPTIONS } from '@/utils/constants.js';


const authStore = useAuthStore();
const formationStore = useFormationStore();
const { t } = useI18n();

const emit = defineEmits(['statusChanged']);

const gradeOptions = computed(() =>
    formationStore.gradeOptions(authStore.currentUser.requestedFormation)
);

// Validation des champs
const firstNameError = computed(() =>
    authStore.currentUser.firstName && authStore.currentUser.firstName.length >= 2 ? '' : t('first_name_error')
);
const lastNameError = computed(() =>
    authStore.currentUser.lastName && authStore.currentUser.lastName.length >= 2 ? '' : t('last_name_error')
);
const birthDateError = computed(() => {
  const today = new Date().toISOString().split('T')[0];
  return authStore.currentUser.birthDate && authStore.currentUser.birthDate <= today ? '' : t('birth_date_error');
});
const formationError = computed(() =>
    authStore.currentUser.requestedFormation ? '' : t('formation_error')
);
const gradeError = computed(() =>
    authStore.currentUser.requestedGrade ? '' : t('grade_error')
);

const isFormValid = computed(() =>
    !firstNameError.value &&
    !lastNameError.value &&
    !birthDateError.value &&
    !formationError.value &&
    !gradeError.value
);

// Watch pour détecter les changements de formation
watch(
    () => authStore.currentUser.requestedFormation,
    (newFormationId) => {
      if (newFormationId) {
        // Réinitialiser le grade sélectionné
        authStore.currentUser.requestedGrade = '';
      }
    }
);

// Soumettre le formulaire
const submitForm = async () => {
  if (!isFormValid.value) {
    authStore.success = false;
    authStore.message = t('error_submit_form');
    return;
  }

  try {
    await authStore.updateCurrentUser({
      firstName: authStore.currentUser.firstName,
      lastName: authStore.currentUser.lastName,
      birthDate: authStore.currentUser.birthDate,
      requestedFormation: authStore.currentUser.requestedFormation,
      requestedGrade: authStore.currentUser.requestedGrade,
      status: STATUS_OPTIONS.awaiting_session,
    });
    emit('statusChanged');
    authStore.success = true;
    authStore.message = t('update_success');
  } catch (error) {
    authStore.success = false;
    authStore.message = t('update_error');
  }
};
</script>