<template>
  <div class="home-redirect">
    <!-- Redirection en cours... -->
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { jwtDecode } from 'jwt-decode';
import { onMounted } from 'vue';
import {ROLES_OPTIONS} from "@/utils/constants.js";

const router = useRouter();

const checkAuthentication = () => {
  const token = localStorage.getItem('authToken');

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      const now = Math.floor(Date.now() / 1000);

      if (decodedToken.exp < now) {
        localStorage.removeItem('authToken');
        router.push('/auth');
      } 
      else if (decodedToken.role === ROLES_OPTIONS.admin) {
        router.push('/adminDashboard');
      } 
      else {
        router.push('/dashboard');
      }
    } 
    catch (error) {
      localStorage.removeItem('authToken');
      router.push('/auth');
    }
  } 
  else {
    router.push('/auth');
  }
};

// Vérification dès que la page est montée
onMounted(() => {
  checkAuthentication();
});
</script>

<style scoped>
.home-redirect {
  display: none;
}
</style>