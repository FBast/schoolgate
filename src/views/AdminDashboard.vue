<template>
  <div class="admin-dashboard">
    <header>
      <nav class="admin-nav">
        <FormButton v-for="(step, key, index) in stepMap" :key="index"
                    :class="{ 'active': key === currentView }" @click="currentView = key">
          {{ step.label }}
        </FormButton>
      </nav>
      <FormButton @click="logout">Déconnexion</FormButton>
    </header>

    <section class="content">
      <div v-if="loading">Chargement...</div>
      <component v-else :is="currentComponent" :message="message" :users="users"></component>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ApiService } from '@/utils/apiService.js';
import FormButton from '@/components/FormButton.vue';
import UserManagement from '@/views/admin/UserManagement.vue';
import ErrorComponent from '@/components/ErrorComponent.vue';
import ExamManagement from "@/views/admin/ExamManagement.vue";
import FormationManagement from "@/views/admin/FormationManagement.vue";
import SessionManagement from "@/views/admin/SessionManagement.vue";

const stepMap = {
  user_management: { label: 'Utilisateurs', component: UserManagement },
  date_management: { label: 'Sessions', component: SessionManagement },
  exam_management: { label: 'Epreuves', component: ExamManagement },
  formation_management: { label: 'Formations', component: FormationManagement }
};

const currentView = ref('user_management');
const message = ref('');
const loading = ref(true);
const users = ref([]);

const currentComponent = computed(() => {
  const step = stepMap[currentView.value];
  return step ? step.component : ErrorComponent;
});

const fetchUsers = async () => {
  try {
    const response = await ApiService.getUsers();
    users.value = response;
  } catch (error) {
    message.value = 'Erreur lors de la récupération des utilisateurs';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchUsers();
});

const router = useRouter();
const logout = () => {
  localStorage.removeItem('authToken');
  router.push('/');
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