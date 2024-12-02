<template>
  <header>
    <img src="@/assets/logo.png" alt="Logo ENSI" class="logo">
    <nav>
      <ProgressIndicator
          :steps="stepKeys"
          :currentStep="currentStepIndex"
      />
    </nav>
    <FormButton @click="logout" :label="$t('logout')"></FormButton>
  </header>

  <main>
    <section class="content layout-wide gap-md">
      <div v-if="loading">{{ $t('loading') }}</div>
      <component
          v-else
          :is="currentComponent"
          @statusChanged="updateStatus"
          :message="errorMessage"
      ></component>

      <!-- Notification Panel -->
      <div v-if="notification.message" class="notification-panel">
        <p :class="{ 'error-message': !notification.success, 'success-message': notification.success }">
          {{ notification.message }}
        </p>
      </div>
    </section>
  </main>
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

const stepMap = {
  [STATUS_OPTIONS.awaiting_information]: AwaitingInformation,
  [STATUS_OPTIONS.awaiting_session]: AwaitingSession,
  [STATUS_OPTIONS.exam_in_progress]: ExamInProgress,
  [STATUS_OPTIONS.awaiting_appointment]: AwaitingAppointment,
  [STATUS_OPTIONS.awaiting_interview]: AwaitingInterview,
  [STATUS_OPTIONS.awaiting_decision]: AwaitingDecision,
  [STATUS_OPTIONS.application_processed]: ApplicationProcessed,
};

const stepKeys = Object.keys(stepMap);
const errorMessage = ref('');
const loading = ref(true);
const notification = ref({ message: '', success: true });

const currentStepIndex = computed(() =>
    stepKeys.indexOf(authStore.currentUser?.status || STATUS_OPTIONS.error)
);

const currentComponent = computed(() => stepMap[authStore.currentUser?.status] || ErrorComponent);

const updateStatus = async () => {
  try {
    await authStore.fetchCurrentUser();
  } catch (error) {
    errorMessage.value = t('error_fetching_status');
  }
};

const handleNotification = ({ message, success }) => {
  notification.value = { message, success };
  setTimeout(() => {
    notification.value = { message: '', success: true };
  }, 5000);
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
      sessionStore.fetchSessions()
    ]);

  } catch (error) {
    console.error(t('error_initializing_dashboard'), error);
  } finally {
    loading.value = false;
  }
});
</script>