<template>
  <div id="app">
    <router-view />
    <GlobalModal
        v-if="modalStore.visible"
        :title="modalStore.title"
        :message="modalStore.message"
        :visible="modalStore.visible"
        @close="modalStore.closeModal"
    />
    <footer>
      <p>&copy; 2024 École des Nouvelles Images</p>
    </footer>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import GlobalModal from "@/views/GlobalModal.vue";
import {useModalStore} from "@/stores/modalStore.js";

export default {
  name: 'App',
  components: {GlobalModal},
  setup() {
    const isAuthenticated = ref(!!localStorage.getItem('authToken'));
    const router = useRouter();
    const modalStore = useModalStore();

    const logout = () => {
      localStorage.removeItem('authToken');
      isAuthenticated.value = false;
      router.push('/auth');
    };

    return {
      isAuthenticated,
      logout, modalStore
    };
  }
};
</script>