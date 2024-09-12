<template>
  <div class="dashboard">
    <header>
      <h2>{{ title }}</h2>
      <nav>
        <router-link to="/dashboard">Accueil</router-link>
        <router-link to="/exam-pending">Épreuve en cours</router-link>
        <router-link to="/exam-done">Épreuve terminée</router-link>
        <router-link to="/interview">Entretien</router-link>
        <router-link to="/results">Résultats</router-link>
        <button @click="logout">Déconnexion</button>
      </nav>
    </header>

    <!-- Composant interne modifié en fonction du statut -->
    <section class="content">
      <div v-if="loading">Chargement...</div>
      <component v-else :is="currentComponent" :message="errorMessage"></component>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

// Composants enfants pour différents statuts
import PendingInfos from "@/components/PendingInfos.vue";
import ExamWaiting from "@/components/ExamWaiting.vue"; // Examen en attente
import ExamPending from "@/components/ExamPending.vue"; // Épreuve en cours
import ExamDone from "@/components/ExamDone.vue"; // Épreuve terminée
import ErrorComponent from "@/components/ErrorComponent.vue";

// Variables de statut et d'erreur
const status = ref('');
const errorMessage = ref('');
const loading = ref(true); // Indicateur de chargement
const title = ref('Chargement...');

// Fonction pour déterminer quel composant afficher en fonction du statut utilisateur
const currentComponent = computed(() => {
  switch (status.value) {
    case 'pending_infos':
      return PendingInfos;
    case 'waiting_exam':
      return ExamWaiting;
    case 'pending_exam':
      return ExamPending;
    case 'exam_done':
      return ExamDone;
    default:
      errorMessage.value = `Le statut "${status.value}" est inconnu. Veuillez contacter l'assistance.`;
      return ErrorComponent; // Composant pour gérer un statut non reconnu
  }
});

// Charger le statut de l'utilisateur depuis le backend
const fetchUserStatus = async () => {
  try {
    const response = await axios.get(`${config.backendApi}/users/status`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    status.value = response.data.status;
    title.value = determineTitle(status.value);
  } catch (error) {
    errorMessage.value = 'Erreur lors de la récupération du statut utilisateur.';
    status.value = 'error';
  } finally {
    loading.value = false; // Terminer le chargement
  }
};

// Fonction pour définir le titre en fonction du statut utilisateur
const determineTitle = (status) => {
  switch (status) {
    case 'pending_infos':
      return 'Remplissez vos informations';
    case 'waiting_exam':
      return 'En attente de l\'épreuve';
    case 'pending_exam':
      return 'Épreuve en cours';
    case 'exam_done':
      return 'Épreuve terminée';
    default:
      return 'Erreur';
  }
};

// Déconnexion
const router = useRouter();
const logout = () => {
  localStorage.removeItem('authToken');
  router.push('/');
};

// Charger les données lors du montage du composant
onMounted(() => {
  fetchUserStatus();
});
</script>

<style scoped>
/* Styles du dashboard parent */
.dashboard {
  padding: 20px;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

nav a {
  margin: 0 10px;
  color: #e10947;
  text-decoration: none;
  font-weight: bold;
}

button {
  margin-left: auto;
  background-color: #e10947;
  color: white;
  border: none;
  cursor: pointer;
  padding: 10px;
  border-radius: 5px;
}

.content {
  margin-top: 20px;
}

/* Ajouter les styles nécessaires pour les composants */
</style>
