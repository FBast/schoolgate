<template>
  <div id="app">
    <router-view />

    <footer>
      <p>&copy; 2024 École des Nouvelles Images</p>
    </footer>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'App',
  setup() {
    const isAuthenticated = ref(!!localStorage.getItem('authToken'));
    const router = useRouter();

    const logout = () => {
      localStorage.removeItem('authToken');
      isAuthenticated.value = false;
      router.push('/auth');
    };

    return {
      isAuthenticated,
      logout,
    };
  }
};
</script>