<template>
  <div class="layout-wide flex-horizontal gap-md">
    <!-- Description de l'étape -->
    <div class="panel flex-vertical gap-md">
      <div class="header">
        <h2 class="title">{{ $t('step_description') }}</h2>
      </div>
      <div>
        <div v-if="nextSession">
          <p v-html="$t('exam_scheduled', { startDate: formatDate(nextSession.startDate), endDate: formatDate(nextSession.endDate) })"></p>
        </div>
        <div v-else>
          {{ $t('no_upcoming_sessions') }}
        </div>
      </div>
    </div>
    <!-- Informations utilisateur -->
    <div class="panel flex-vertical gap-md">
      <div class="header">
        <h2 class="title">{{ $t('candidate_information') }}</h2>
      </div>
      <label>{{ $t('first_name') }} : {{ userStore.firstName }}</label>
      <label>{{ $t('last_name') }} : {{ userStore.lastName }}</label>
      <label>{{ $t('birth_date') }} : {{ formatDate(userStore.birthDate) }}</label>
      <label>{{ $t('requested_formation') }} : {{ formationStore.getFormationTitle(userStore.requestedFormation) }}</label>
      <label>{{ $t('requested_grade') }} : {{ formationStore.getGradeLabel(userStore.requestedGrade) }}</label>
      <p v-if="userStore.message" :class="{'success-message': userStore.success, 'error-message': !userStore.success}">
        {{ userStore.message }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { useFormationStore } from '@/stores/formationStore';
import { useSessionStore } from '@/stores/sessionStore';
import { formatDate } from "@/utils/helpers.js";

const userStore = useUserStore();
const formationStore = useFormationStore();
const sessionStore = useSessionStore();

// Récupérer la prochaine session
const nextSession = computed(() => sessionStore.getNextSession());

// Charger les données nécessaires au montage
onMounted(() => {
  userStore.fetchUserProfile();
  formationStore.fetchFormations();
  sessionStore.fetchSessions();
});
</script>
