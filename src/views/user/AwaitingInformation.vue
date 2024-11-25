<template>
  <div class="layout-wide flex-horizontal gap-md">
    <div class="panel flex-vertical gap-md">
      <div class="header">
        <h2 class="title">{{ $t('step_description') }}</h2>
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
        <h2 class="title">{{ $t('user_information') }}</h2>
      </div>
      <form @submit.prevent="submitForm">
        <div class="flex-vertical gap-sm">
          <FormInput v-model="userStore.firstName" :label="$t('first_name')" type="text" :error="firstNameError" />
          <FormInput v-model="userStore.lastName" :label="$t('last_name')" type="text" :error="lastNameError" />
          <FormInput v-model="userStore.birthDate" :label="$t('birth_date')" type="date" :error="birthDateError" />
          <FormSelect v-model="userStore.requestedFormation" :options="formationStore.formationOptions" :label="$t('formation')" :error="formationError" />
          <FormSelect v-model="userStore.requestedGrade" :options="gradeOptions" :label="$t('grade')" :error="gradeError" />
          <FormButton type="submit" :label="$t('update')" :disabled="!isFormValid"></FormButton>
        </div>
      </form>
      <p v-if="userStore.message" :class="{'success-message': userStore.success, 'error-message': !userStore.success}">
        {{ userStore.message }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { useFormationStore } from '@/stores/formationStore';
import FormInput from '@/components/FormInput.vue';
import FormSelect from '@/components/FormSelect.vue';
import FormButton from '@/components/FormButton.vue';
import { useI18n } from 'vue-i18n';
import { STATUS_OPTIONS } from '@/utils/constants.js';

const userStore = useUserStore();
const formationStore = useFormationStore();
const { t } = useI18n();

const emit = defineEmits(['statusChanged']);

// Validation des champs
const firstNameError = computed(() =>
    userStore.firstName.length >= 2 ? '' : t('first_name_error')
);
const lastNameError = computed(() =>
    userStore.lastName.length >= 2 ? '' : t('last_name_error')
);
const birthDateError = computed(() => {
  const today = new Date().toISOString().split('T')[0];
  return userStore.birthDate && userStore.birthDate <= today ? '' : t('birth_date_error');
});
const formationError = computed(() =>
    userStore.requestedFormation ? '' : t('formation_error')
);
const gradeError = computed(() =>
    userStore.requestedGrade ? '' : t('grade_error')
);

const isFormValid = computed(() =>
    !firstNameError.value &&
    !lastNameError.value &&
    !birthDateError.value &&
    !formationError.value &&
    !gradeError.value
);

// Options des grades en fonction de la formation sélectionnée
const gradeOptions = computed(() => {
  return formationStore.gradeOptionsByFormationId(userStore.requestedFormation);
});

// Watch pour détecter les changements de formation
watch(
    () => userStore.requestedFormation,
    (newFormationId) => {
      if (newFormationId) {
        // Réinitialiser le grade sélectionné
        userStore.requestedGrade = '';
      }
    }
);

// Soumettre le formulaire
const submitForm = async () => {
  if (!isFormValid.value) {
    userStore.success = false;
    userStore.message = t('error_submit_form');
    return;
  }

  try {
    await userStore.updateUserProfile({
      status: STATUS_OPTIONS.awaiting_session,
    });
    emit('statusChanged');
    userStore.success = true;
    userStore.message = t('update_success');
  } catch (error) {
    userStore.success = false;
    userStore.message = t('update_error');
  }
};
</script>