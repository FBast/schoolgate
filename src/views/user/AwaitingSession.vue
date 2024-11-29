<template>
  <div class="layout-wide flex-horizontal gap-md">
    <!-- Description de l'étape -->
    <div class="panel flex-vertical gap-md">
      <div class="header">
        <h2 class="title">{{ $t('step_description') }}</h2>
      </div>
      <div v-if="nextSession">
        <p v-html="$t('exam_scheduled', { startDate: formatDateWithTime(nextSession.startDate), endDate: formatDateWithTime(nextSession.endDate) })"></p>
      </div>
      <div v-else>
        {{ $t('no_upcoming_sessions') }}
      </div>
    </div>
    <!-- Informations utilisateur -->
    <div class="panel flex-vertical gap-md">
      <div class="header">
        <h2 class="title">{{ $t('candidate_information') }}</h2>
      </div>
      <label>{{ $t('first_name') }} : {{ authStore.currentUser.firstName }}</label>
      <label>{{ $t('last_name') }} : {{ authStore.currentUser.lastName }}</label>
      <label>{{ $t('birth_date') }} : {{ formatDate(authStore.currentUser.birthDate) }}</label>
      <label>{{ $t('requested_formation') }} : {{ formationStore.getFormationTitle(authStore.currentUser.requestedFormation) }}</label>
      <label>{{ $t('requested_grade') }} : {{ formationStore.getGradeLabel(authStore.currentUser.requestedGrade) }}</label>
      <p v-if="authStore.message" :class="{'success-message': authStore.success, 'error-message': !authStore.success}">
        {{ authStore.message }}
      </p>
    </div>
  </div>
</template>

<script setup>
import {computed} from 'vue';
import {useFormationStore} from '@/stores/formationStore';
import {useSessionStore} from '@/stores/sessionStore';
import {formatDate, formatDateWithTime} from "@/utils/helpers.js";
import {useAuthStore} from "@/stores/authStore.js";

const authStore = useAuthStore();
const formationStore = useFormationStore();
const sessionStore = useSessionStore();

// Récupérer la prochaine session
const nextSession = computed(() => sessionStore.getNextSession);
</script>
