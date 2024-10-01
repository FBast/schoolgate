<template>
  <div class="dashboard">
    <header>
      <nav class="progress-indicator">
        <div v-for="(step, index) in Object.values(stepMap)" :key="index" :class="{ 'active-step': step.active, 'step': true }">
          <span class="step-number">{{ index + 1 }}</span>
          <span class="step-label">{{ step.label }}</span>
        </div>
      </nav>
      <FormButton @click="logout">Déconnexion</FormButton>
    </header>

    <section class="content">
      <div v-if="loading">Chargement...</div>
      <component v-else :is="currentComponent" :message="errorMessage"></component>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import PendingInfos from "@/components/PendingInfos.vue";
import ExamWaiting from "@/components/ExamWaiting.vue";
import ExamPending from "@/components/ExamPending.vue";
import ExamDone from "@/components/ExamDone.vue";
import Interview from "@/components/Interview.vue";
import Results from "@/components/Results.vue";
import ErrorComponent from "@/components/ErrorComponent.vue";
import FormButton from '@/components/FormButton.vue';
import { ApiService } from "@/utils/apiService.js";

// Map avec le statut comme clé, et les informations correspondantes
const stepMap = ref({
  verified: { label: 'Informations', component: PendingInfos, active: false },
  waiting_exam: { label: 'Épreuve en attente', component: ExamWaiting, active: false },
  pending_exam: { label: 'Épreuve en cours', component: ExamPending, active: false },
  exam_done: { label: 'Épreuve terminée', component: ExamDone, active: false },
  interview: { label: 'Entretien', component: Interview, active: false },
  results: { label: 'Résultats', component: Results, active: false }
});

const status = ref('');
const errorMessage = ref('');
const loading = ref(true);

// Composant à afficher selon le statut actuel
const currentComponent = computed(() => {
  const step = stepMap.value[status.value];
  return step ? step.component : ErrorComponent;
});

const fetchUserStatus = async () => {
  try {
    const responseData = await ApiService.getUserProfile();
    status.value = responseData.status;

    // Mise à jour de l'étape active selon le statut
    updateSteps(status.value);
  } catch (error) {
    errorMessage.value = 'Erreur lors de la récupération du statut utilisateur.';
    status.value = 'error';
  } finally {
    loading.value = false;
  }
};

// Mise à jour des étapes pour activer la bonne
const updateSteps = (currentStatus) => {
  Object.keys(stepMap.value).forEach(key => {
    stepMap.value[key].active = (key === currentStatus);
  });
};

const router = useRouter();
const logout = () => {
  localStorage.removeItem('authToken');
  router.push('/');
};

onMounted(() => {
  fetchUserStatus();
});
</script>

<style scoped lang="scss">
@import "@/styles/utils/_variables.scss";

.dashboard {
  padding: $spacing-md;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-md;

  .progress-indicator {
    display: flex;
    flex-grow: 1;
    justify-content: flex-start;
    align-items: center;
    gap: $spacing-md;
  }

  .step {
    display: flex;
    align-items: center;
    position: relative;
    text-align: center;
  }

  .step-number {
    background-color: $primary-color;
    color: white;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    margin-right: $spacing-sm;
    transition: background-color 0.3s ease;
  }

  .active-step .step-number {
    background-color: $primary-color;
  }

  .step-label {
    color: $text-color;
    font-weight: bold;
    margin-left: $spacing-xs;
    transition: color 0.3s ease;
  }

  .active-step .step-label {
    color: $primary-color;
  }

  .step-connector {
    width: 50px;
    height: 4px;
    background-color: $secondary-color;
    margin-left: $spacing-sm;
    margin-right: $spacing-sm;
    transition: background-color 0.3s ease;
  }

  .active-step ~ .step .step-number {
    background-color: lighten($accent-color, 10%);
  }

  button {
    width: auto;
    max-width: 200px;
    margin-left: $spacing-lg;
  }
}

.content {
  margin-top: $spacing-md;
}
</style>
