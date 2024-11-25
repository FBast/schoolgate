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
import { useUserStore } from '@/stores/userStore';
import { useFormationStore } from '@/stores/formationStore';
import { useSessionStore } from '@/stores/sessionStore';
import { STATUS_OPTIONS } from "@/utils/constants.js";
import AwaitingDecision from "@/views/user/AwaitingDecision.vue";
import AwaitingInterview from "@/views/user/AwaitingInterview.vue";
import AwaitingAppointment from "@/views/user/AwaitingAppointment.vue";
import ExamInProgress from "@/views/user/ExamInProgress.vue";
import AwaitingInformation from "@/views/user/AwaitingInformation.vue";
import AwaitingSession from "@/views/user/AwaitingSession.vue";
import ApplicationProcessed from "@/views/user/ApplicationProcessed.vue";

const { t } = useI18n();
const userStore = useUserStore();
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
const status = ref(STATUS_OPTIONS.awaiting_information);
const errorMessage = ref('');
const loading = ref(true);

const currentStepIndex = computed(() =>
    Object.values(STATUS_OPTIONS).indexOf(status.value)
);

const currentComponent = computed(() => stepMap[status.value] || ErrorComponent);

const updateStatus = async () => {
  try {
    await userStore.fetchUserProfile();
    status.value = userStore.status; // Supposant que le statut est stocké dans userStore.status
  } catch (error) {
    errorMessage.value = t('error_fetching_status');
    status.value = 'error';
  }
};

const router = useRouter();
const logout = () => {
  localStorage.removeItem('authToken');
  router.push('/');
};

onMounted(async () => {
  try {
    await Promise.all([
      userStore.fetchUserProfile(),
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