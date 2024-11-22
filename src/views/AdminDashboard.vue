<template>
  <div class="admin-dashboard">
    <header>
      <nav class="admin-nav">
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

    <section class="content">
      <div v-if="loading">{{ $t('loading') }}</div>
      <component v-else :is="currentComponent" />
    </section>
  </div>
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
import { useUserStore } from "@/stores/userStore.js";

const userStore = useUserStore();

const stepMap = {
  user_management: { label: "users", component: UserManagement },
  date_management: { label: "sessions", component: SessionManagement },
  exam_management: { label: "exams", component: ExamManagement },
  formation_management: { label: "formations", component: FormationManagement },
};

const currentView = ref("user_management");
const currentComponent = computed(() => {
  const step = stepMap[currentView.value];
  return step ? step.component : ErrorComponent;
});

const changeView = (key) => {
  currentView.value = key;
};

const loading = ref(true);

onMounted(async () => {
  try {
    loading.value = true;
    await userStore.fetchUsers();
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

<style scoped lang="scss">
@import "@/styles/utils/_variables.scss";

.admin-dashboard {
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-md;
    gap: $spacing-md;

    .admin-nav {
      display: flex;
      gap: $spacing-md;
    }
  }
}
</style>
