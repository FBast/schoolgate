<template>
  <div class="exam-waiting-container">
    <!-- User Info Column -->
    <div class="section user-info">
      <h2>Informations du Candidat</h2>
      <UserInfoPanel
          :initialData="userInfo"
          :formations="formations"
          :grades="grades"
          :message="message"
          :success="success"
          @submit="submitForm"
      />
    </div>

    <!-- Exam Waiting Info Column -->
    <div class="section exam-info">
      <h2>Statut de l'Epreuve</h2>
      <div class="content-box">
        <p>
          Votre session d'examen est prévue pour commencer le <strong>{{ sessionStartDate }}</strong>
          et se terminera le <strong>{{ sessionEndDate }}</strong>.
          Un email vous sera envoyé au début de la session, contenant l'épreuve en pièce jointe.
        </p>
        <p>
          Pendant cette période, vous pourrez également télécharger l'examen directement depuis cette plateforme.
          Lorsque le dépôt sera activé, vous pourrez soumettre votre travail en ligne. Veuillez respecter
          les délais pour garantir la validation de votre épreuve.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import UserInfoPanel from '@/components/UserInfoPanel.vue';
import {ApiService} from '@/utils/apiService.js';

const userInfo = ref({});
const formations = ref([]);
const grades = ref([]);
const message = ref('');
const success = ref(false);
const sessionStartDate = ref('');
const sessionEndDate = ref('');

const fetchUserInfo = async () => {
  const response = await ApiService.getUserProfile();
  userInfo.value = response;

  // Charger les dates de session en fonction du grade de l'utilisateur
  if (response.requestedGrade) {
    const sessionData = await ApiService.getNextSessionForGrade(response.requestedGrade);
    sessionStartDate.value = sessionData.startDate;
    sessionEndDate.value = sessionData.endDate;
  }
};

const fetchFormations = async () => {
  const response = await ApiService.getFormations();
  formations.value = response.map(f => ({label: f.title, value: f._id}));
};

const fetchGrades = async (formationId) => {
  const response = await ApiService.getGrades(formationId);
  grades.value = response.map(g => ({label: `Année ${g.grade}`, value: g._id}));
};

const submitForm = async (updatedData) => {
  try {
    await ApiService.updateUserProfile(updatedData);
    success.value = true;
    message.value = 'Informations mises à jour avec succès';
  } catch (error) {
    success.value = false;
    message.value = 'Erreur lors de la mise à jour des informations';
  }
};

onMounted(() => {
  fetchUserInfo();
  fetchFormations();
});
</script>

<style scoped lang="scss">
@import "@/styles/utils/variables";

.exam-waiting-container {
  display: flex;
  gap: 20px;

  .section {
    flex: 1;
    display: flex;
    flex-direction: column;
    border: 1px solid $primary-color;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

    h2 {
      color: $primary-color;
      font-weight: bold;
      margin-bottom: 10px;
    }
  }

  .user-info {
    background-color: $primary-color;
  }

  .exam-info {
    background-color: $primary-color;
    color: #fff;

    .content-box {
      background-color: #fff;
      color: #333;
      padding: 15px;
      border-radius: 8px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }
  }
}
</style>
