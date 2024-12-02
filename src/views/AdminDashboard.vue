<template>
  <header>
    <img src="@/assets/logo.png" alt="Logo ENSI" class="logo">
    <nav>
      <router-link
          v-for="(step, key) in stepMap"
          :key="key"
          :to="`/admin-dashboard/${step.path}`"
          :class="{ active: $route.params.currentView === step.path }"
      >
        {{ $t(step.label) }}
      </router-link>
    </nav>
    <FormButton @click="logout" :label="$t('logout')" />
  </header>

  <main>
    <section class="content layout-wide gap-md">
      <!-- Loading Panel -->
      <div v-if="loading" class="panel">
        <p class="loading-message">
          {{ $t('loading') }}
        </p>
      </div>

      <!-- Dynamic Child Component -->
      <router-view v-else @notify="handleNotification" />

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
import {ref, computed, onMounted, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import FormButton from "@/components/FormButton.vue";
import {useFormationStore} from "@/stores/formationStore.js";
import {useSessionStore} from "@/stores/sessionStore.js";
import {useTopicStore} from "@/stores/topicStore.js";
import {useAuthStore} from "@/stores/authStore.js";
import {useUserStore} from "@/stores/userStore.js";

// Define props
defineProps({
  currentView: {
    type: String,
    default: "candidate",
  },
});

const authStore = useAuthStore();
const userStore = useUserStore();
const formationStore = useFormationStore();
const sessionStore = useSessionStore();
const topicStore = useTopicStore();

const router = useRouter();
const route = useRoute();

const stepMap = {
  candidates: { label: "candidates", path: "candidates" },
  sessions: { label: "sessions", path: "sessions" },
  topics: { label: "topics", path: "topics" },
  formations: { label: "formations", path: "formations" },
};

// Computed property for the current view
const currentView = computed(() => route.name);

// State for notifications and loading
const loading = ref(false);
const notification = ref({ message: "", success: true });

const changeView = (key) => {
  currentView.value = key;
  router.push({ name: "AdminDashboard", params: { currentView: key } });
};

// Function to log out
const logout = () => {
  localStorage.removeItem("authToken");
  router.push("/auth");
};

// Notification handler
const handleNotification = ({ message, success }) => {
  notification.value = { message, success };
  setTimeout(() => {
    notification.value = { message: "", success: true };
  }, 5000);
};

// Initialization on mount
onMounted(async () => {
  loading.value = true;
  try {
    await authStore.fetchCurrentUser();
  } catch (error) {
    console.error("Error initializing dashboard:", error);
    notification.value = { message: "Error loading dashboard", success: false };
  } finally {
    loading.value = false;
  }
});
</script>