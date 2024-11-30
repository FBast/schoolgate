<template>
  <header>
    <img src="@/assets/logo.png" alt="Logo ENSI" class="logo">
    <nav>
      <FormButton
          v-for="(step, key, index) in stepMap"
          :key="index"
          :class="{ active: key === currentView }"
          :label="$t(step.label)"
          @click="changeView(key)"
      />
    </nav>
    <FormButton @click="logout" :label="$t('logout')" />
  </header>

  <main>
    <section class="content layout-wide gap-md">
      <div v-if="loading">{{ $t('loading') }}</div>

      <component
          v-else
          :is="currentComponent"
          @notify="handleNotification"
      />

      <!-- Notification Panel -->
      <div v-if="notification.message" class="panel">
        <p :class="{ 'error-message': !notification.success, 'success-message': notification.success }">
          {{ notification.message }}
        </p>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import FormButton from "@/components/FormButton.vue";
import UserManagement from "@/views/admin/UserManagement.vue";
import ErrorComponent from "@/components/ErrorComponent.vue";
import ExamManagement from "@/views/admin/ExamManagement.vue";
import FormationManagement from "@/views/admin/FormationManagement.vue";
import SessionManagement from "@/views/admin/SessionManagement.vue";
import {useFormationStore} from "@/stores/formationStore.js";
import {useSessionStore} from "@/stores/sessionStore.js";
import {useTopicStore} from "@/stores/topicStore.js";
import {useAuthStore} from "@/stores/authStore.js";
import {useUserStore} from "@/stores/userStore.js";

const authStore = useAuthStore();
const userStore = useUserStore();
const formationStore = useFormationStore();
const sessionStore = useSessionStore();
const topicStore = useTopicStore();

const stepMap = {
  user_management: { label: "users", component: UserManagement },
  date_management: { label: "sessions", component: SessionManagement },
  exam_management: { label: "exams", component: ExamManagement },
  formation_management: { label: "formations", component: FormationManagement },
};

const currentView = ref("user_management");
const notification = ref({ message: '', success: true });

const currentComponent = computed(() => {
  const step = stepMap[currentView.value];
  return step ? step.component : ErrorComponent;
});

const changeView = (key) => {
  currentView.value = key;
};

const handleNotification = ({ message, success }) => {
  notification.value = { message, success };
  setTimeout(() => {
    notification.value = { message: '', success: true };
  }, 5000);
};

const loading = ref(true);

onMounted(async () => {
  try {
    loading.value = true;
    await Promise.all([
      authStore.fetchCurrentUser(),
      userStore.fetchUsers(),
      formationStore.fetchFormations(),
      formationStore.fetchGrades(),
      sessionStore.fetchSessions(),
      topicStore.fetchTopics()
    ]);
  } catch (error) {
    console.error(t('error_initializing_dashboard'), error);
  } finally {
    loading.value = false;
  }
});

const router = useRouter();
const logout = () => {
  localStorage.removeItem("authToken");
  router.push("/");
};
</script>