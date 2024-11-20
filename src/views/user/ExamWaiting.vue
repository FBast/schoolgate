<template>
  <div class="layout-wide flex-horizontal gap-md">
    <div class="panel flex-vertical gap-md">
      <div class="header">
        <h2 class="title">{{ $t('step_description') }}</h2>
      </div>
      <div>
        <p>
          {{ $t('exam_scheduled', { startDate: sessionStartDate, endDate: sessionEndDate }) }}
        </p>
        <p>
          {{ $t('exam_submission_instructions') }}
        </p>
      </div>
    </div>
    <UserInfoPanel
        :initialData="userInfo"
        :formations="formations"
        :grades="grades"
        :message="message"
        :success="success"
        @submit="submitForm"
    />
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import UserInfoPanel from '@/views/user/UserInformation.vue';
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
  // if (response.requestedGrade) {
  //   const sessionData = await ApiService.getSessions(response.requestedGrade);
  //   sessionStartDate.value = sessionData.startDate;
  //   sessionEndDate.value = sessionData.endDate;
  // }
};

const fetchFormations = async () => {
  const response = await ApiService.getFormations();
  formations.value = response.map(f => ({label: f.title, value: f._id}));
};

const fetchGrades = async (formationId) => {
  const response = await ApiService.getFormationGrades(formationId);
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
