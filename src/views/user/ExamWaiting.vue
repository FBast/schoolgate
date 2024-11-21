<template>
  <div class="layout-wide flex-horizontal gap-md">
    <!-- Description de l'étape -->
    <div class="panel flex-vertical gap-md">
      <div class="header">
        <h2 class="title">{{ $t('step_description') }}</h2>
      </div>
      <div>
        <div v-if="sessionStartDate">
          <p v-html="$t('exam_scheduled', { startDate: sessionStartDate, endDate: sessionEndDate })"></p>
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
      <label>{{ $t('first_name') }} : {{ userInfo.firstName }}</label>
      <label>{{ $t('last_name') }} : {{ userInfo.lastName }}</label>
      <label>{{ $t('birth_date') }} : {{ formatDate(userInfo.birthDate) }}</label>
      <label>{{ $t('requested_formation') }} : {{ formations[userInfo.requestedFormation] }}</label>
      <label>{{ $t('requested_grade') }} : {{ grades[userInfo.requestedGrade] }}</label>
      <p v-if="message" :class="{'success-message': success, 'error-message': !success}">
        {{ message }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ApiService } from '@/utils/apiService.js';
import { formatDate } from "@/utils/helpers.js";

const userInfo = ref({});
const formations = ref([]);
const grades = ref([]);
const message = ref('');
const success = ref(false);
const sessionStartDate = ref('');
const sessionEndDate = ref('');

const fetchUserInfo = async () => {
  try {
    const response = await ApiService.getUserProfile();
    userInfo.value = response;

    const sessions = await ApiService.getSessions();

    // Récupérer la date actuelle
    const now = new Date();

    // Trouver la prochaine session (commence après la date actuelle)
    const nextSession = sessions
        .filter((session) => new Date(session.startDate) > now) // Sessions futures uniquement
        .sort((a, b) => new Date(a.startDate) - new Date(b.startDate)) // Trier par date de début
        .at(0); // Prendre la première session future

    if (nextSession) {
      sessionStartDate.value = formatDate(nextSession.startDate);
      sessionEndDate.value = formatDate(nextSession.endDate);
    } else {
      sessionStartDate.value = null;
      sessionEndDate.value = null;
    }
  } catch (error) {
    message.value = 'Erreur lors de la récupération des données utilisateur';
    success.value = false;
  }
};

// Transformer les formations et grades en dictionnaires
const fetchFormationsAndGrades = async () => {
  try {
    const formationsResponse = await ApiService.getFormations();
    const gradesResponse = await ApiService.getGrades();

    // Transformer en objets (dictionnaires)
    formations.value = formationsResponse.reduce(
        (dict, formation) => ({ ...dict, [formation._id]: formation.title }),
        {}
    );
    grades.value = gradesResponse.reduce(
        (dict, grade) => ({ ...dict, [grade._id]: grade.grade }),
        {}
    );
  } catch (error) {
    console.error(t('fetching_formations_error'), error);
  }
};

onMounted(() => {
  fetchUserInfo();
  fetchFormationsAndGrades();
});
</script>
