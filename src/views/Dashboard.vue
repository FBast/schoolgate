<template>
  <div class="dashboard">
    <header>
      <nav class="progress-indicator">
        <div v-for="(step, key, index) in stepMap" :key="index" :class="{ 'active-step': key === status, 'step': true }">
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

const stepMap = {
  verified: { label: 'Informations', component: PendingInfos },
  waiting_exam: { label: 'Épreuve en attente', component: ExamWaiting },
  pending_exam: { label: 'Épreuve en cours', component: ExamPending },
  exam_done: { label: 'Épreuve terminée', component: ExamDone },
  interview: { label: 'Entretien', component: Interview },
  results: { label: 'Résultats', component: Results }
};

const status = ref('verified');
const errorMessage = ref('');
const loading = ref(true);

// Composant à afficher selon le statut actuel
const currentComponent = computed(() => {
  const step = stepMap[status.value];
  return step ? step.component : ErrorComponent;
});

const updateStatus = async () => {
  try {
    const responseData = await ApiService.getUserProfile();
    status.value = responseData.status;
  } catch (error) {
    errorMessage.value = 'Erreur lors de la récupération du statut utilisateur.';
    status.value = 'error';
  } finally {
    loading.value = false;
  }
};

const router = useRouter();
const logout = () => {
  localStorage.removeItem('authToken');
  router.push('/');
};

onMounted(() => {
  updateStatus();
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
    gap: $spacing-md;
    align-items: center;

    .step {
      display: flex;
      align-items: center;
      text-align: center;

      .step-number {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: bold;
        color: white;
        background-color: $primary-color;
        margin-right: $spacing-sm;
      }

      .step-label {
        color: $text-color;
        font-weight: bold;
      }
    }

    .active-step .step-number {
      background-color: $accent-color;
    }

    .active-step .step-label {
      color: $accent-color;
    }
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
