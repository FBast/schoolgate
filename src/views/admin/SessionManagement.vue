<template>
  <div class="session-management-container">
    <div class="section session">
      <h2>Sessions</h2>
      <table class="session-table">
        <thead>
        <tr>
          <th>Nom</th>
          <th>Date de début</th>
          <th>Date de fin</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="session in sessions" :key="session._id">
          <td>{{ session.name }}</td>
          <td>
            <input
                type="date"
                :value="session.startDate.slice(0, 10)"
                @change="updateSessionDate(session._id, 'startDate', $event.target.value)"
            />
          </td>
          <td>
            <input
                type="date"
                :value="session.endDate.slice(0, 10)"
                @change="updateSessionDate(session._id, 'endDate', $event.target.value)"
            />
          </td>
          <td>
            <button @click="deleteSession(session._id)">Supprimer</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <button @click="addSession">Ajouter une nouvelle session</button>
    <p v-if="message" :class="{'success-message': success, 'error-message': !success}">
      {{ message }}
    </p>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import {ApiService} from '@/utils/apiService.js';

const sessions = ref([]);
const message = ref('');
const success = ref(false);

// Récupérer les sessions au montage du composant
const fetchSessions = async () => {
  try {
    const response = await ApiService.getSessions();
    sessions.value = response;
  } catch (error) {
    message.value = 'Erreur lors de la récupération des sessions';
    success.value = false;
  }
};

// Supprimer une session
const deleteSession = async (sessionId) => {
  try {
    await ApiService.deleteSession(sessionId);
    message.value = 'Session supprimée avec succès';
    success.value = true;
    await fetchSessions();
  } catch (error) {
    message.value = 'Erreur lors de la suppression de la session';
    success.value = false;
  }
};

// Ajouter une nouvelle session
const addSession = async () => {
  const defaultStartDate = new Date().toISOString().slice(0, 10); // Date actuelle
  const defaultEndDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10); // Une semaine plus tard

  const newSession = {
    name: `Session ${sessions.value.length + 1}`,
    startDate: defaultStartDate,
    endDate: defaultEndDate,
  };

  try {
    await ApiService.createSession(newSession);
    message.value = 'Session créée avec succès';
    success.value = true;
    await fetchSessions();
  } catch (error) {
    message.value = 'Erreur lors de la création de la session';
    success.value = false;
  }
};

// Mettre à jour une date de session
const updateSessionDate = async (sessionId, field, value) => {
  const session = sessions.value.find((s) => s._id === sessionId);
  if (!session) return;

  try {
    session[field] = value;
    await ApiService.updateSession(sessionId, {...session});
    message.value = 'Session mise à jour avec succès';
    success.value = true;
  } catch (error) {
    message.value = 'Erreur lors de la mise à jour de la session';
    success.value = false;
  }
};

onMounted(() => {
  fetchSessions();
});
</script>

<style scoped lang="scss">
@import "@/styles/utils/variables";

.session-management-container {
  display: flex;
  flex-direction: column;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

  h2 {
    color: $primary-color;
    font-weight: bold;
    margin-bottom: 10px;
  }

  .session-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: $spacing-md;

    th, td {
      padding: $spacing-sm;
      border: 1px solid $text-color;
    }

    th {
      background-color: $primary-color;
      color: white;
    }

    td {
      text-align: center;

      input[type="date"] {
        padding: $spacing-xs;
        border: 1px solid $primary-color;
        border-radius: $border-radius;
      }
    }

    button {
      background-color: $primary-color;
      color: white;
      padding: $spacing-xs $spacing-sm;
      border: none;
      border-radius: $border-radius;
      cursor: pointer;
    }

    button:hover {
      background-color: lighten($primary-color, 10%);
    }
  }

  .success-message {
    color: $success-color;
  }

  .error-message {
    color: $error-color;
  }
}
</style>