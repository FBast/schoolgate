<template>
  <div class="dashboard">
    <header>
      <ProgressIndicator
          :steps="Object.values(STATUS_OPTIONS)"
          :currentStep="currentStepIndex"
      />
      <FormButton @click="logout" :label="$t('logout')"></FormButton>
    </header>

    <section class="content">
      <div v-if="loading">{{ $t('loading') }}</div>
      <component
          v-else
          :is="currentComponent"
          @statusChanged="updateStatus"
          :message="errorMessage"
      ></component>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import ProgressIndicator from "@/components/ProgressIndicator.vue";
import FormButton from '@/components/FormButton.vue';
import ErrorComponent from "@/components/ErrorComponent.vue";
import { useFormationStore } from '@/stores/formationStore';
import { useSessionStore } from '@/stores/sessionStore';
import { useAuthStore } from "@/stores/authStore.js";
import { STATUS_OPTIONS } from "@/utils/constants.js";
import AwaitingDecision from "@/views/user/AwaitingDecision.vue";
import AwaitingInterview from "@/views/user/AwaitingInterview.vue";
import AwaitingAppointment from "@/views/user/AwaitingAppointment.vue";
import ExamInProgress from "@/views/user/ExamInProgress.vue";
import AwaitingInformation from "@/views/user/AwaitingInformation.vue";
import AwaitingSession from "@/views/user/AwaitingSession.vue";
import ApplicationProcessed from "@/views/user/ApplicationProcessed.vue";

const { t } = useI18n();
const authStore = useAuthStore();
const formationStore = useFormationStore();
const sessionStore = useSessionStore();

// Map des statuts avec leurs composants
const stepMap = {
  [STATUS_OPTIONS.awaiting_information]: AwaitingInformation,
  [STATUS_OPTIONS.awaiting_session]: AwaitingSession,
  [STATUS_OPTIONS.exam_in_progress]: ExamInProgress,
  [STATUS_OPTIONS.awaiting_appointment]: AwaitingAppointment,
  [STATUS_OPTIONS.awaiting_interview]: AwaitingInterview,
  [STATUS_OPTIONS.awaiting_decision]: AwaitingDecision,
  [STATUS_OPTIONS.application_processed]: ApplicationProcessed,
};

// Statut et composant actuel
const errorMessage = ref('');
const loading = ref(true);

const currentStepIndex = computed(() =>
    Object.values(STATUS_OPTIONS).indexOf(authStore.currentUser?.status || STATUS_OPTIONS.error)
);

const currentComponent = computed(() => stepMap[authStore.currentUser?.status] || ErrorComponent);

const updateStatus = async () => {
  try {
    await authStore.fetchCurrentUser();
  } catch (error) {
    errorMessage.value = t('error_fetching_status');
  }
};

const router = useRouter();

const logout = () => {
  authStore.logout();
  router.push('/auth');
};

onMounted(async () => {
  try {
    const token = localStorage.getItem("authToken");
    
    if (!token) {
      await router.push('/auth');
      return;
    }

    loading.value = true;
    await Promise.all([
      authStore.fetchCurrentUser(),
      formationStore.fetchFormations(),
      formationStore.fetchGrades(),
      sessionStore.fetchSessions(),
    ]);

  } catch (error) {
    console.error(t('error_initializing_dashboard'), error);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped lang="scss">
@import "@/styles/utils/_variables.scss";

.dashboard {
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-md;
    gap: $spacing-md;
  }
}
</style>