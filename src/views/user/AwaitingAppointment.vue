<template>
  <div class="flex-horizontal gap-md">
    <!-- Description de l'étape -->
    <div class="panel flex-vertical gap-md">
      <div class="header">
        <h2 class="title">{{ $t('exam_completed_title') }}</h2>
      </div>
      <div>
        <p>{{ $t('exam_completed_message') }}</p>
        <p>{{ $t('appointment_schedule_info') }}</p>
      </div>
    </div>

    <!-- Informations utilisateur -->
    <div class="panel flex-vertical gap-md">
      <div class="header">
        <h2 class="title">{{ $t('information_title') }}</h2>
      </div>
      <label>{{ $t('first_name') }} : {{ authStore.currentUser.firstName }}</label>
      <label>{{ $t('last_name') }} : {{ authStore.currentUser.lastName }}</label>
      <label>{{ $t('birth_date') }} : {{ formatDate(authStore.currentUser.birthDate) }}</label>
      <label>{{ $t('requested_formation') }} : {{ formationStore.getFormationTitle(authStore.currentUser.requestedFormation) }}</label>
      <label>{{ $t('requested_grade') }} : {{ formationStore.getGradeTitle(authStore.currentUser.requestedGrade) }}</label>
      <p v-if="authStore.message" :class="{'success-message': authStore.success, 'error-message': !authStore.success}">
        {{ authStore.message }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { useFormationStore } from '@/stores/formationStore';
import { useAuthStore } from "@/stores/authStore.js";
import { formatDate } from "@/utils/helpers.js";

const authStore = useAuthStore();
const formationStore = useFormationStore();
</script>
