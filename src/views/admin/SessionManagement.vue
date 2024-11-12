<template>
  <div class="container">
    <div class="panel sessions">
      <div class="header">
        <h2 class="title">Sessions</h2>
        <div class="actions">
          <a @click="addSession"><i class="fa-regular fa-square-plus"></i></a>
        </div>
      </div>
      <!-- Header List -->
      <div class="items-list-header">
        <div class="header-details">
          <span>Nom</span>
          <span>Date de début</span>
          <span>Date de fin</span>
          <span>Actions</span>
        </div>
      </div>
      <!-- Items List -->
      <div class="items-list">
        <div
            v-for="session in sessions"
            :key="session._id"
            class="item"
        >
          <div class="item-content">
            <label>{{ session.name }}</label>
            <FormInput
                label=""
                type="date"
                :modelValue="session.startDate.slice(0, 10)"
                @update:modelValue="(value) => updateSessionDate(session._id, 'startDate', value)"
            />
            <FormInput
                label=""
                type="date"
                :modelValue="session.endDate.slice(0, 10)"
                @update:modelValue="(value) => updateSessionDate(session._id, 'endDate', value)"
            />
            <div class="actions">
              <a @click.stop="deleteSession(session._id)">
                <i class="fa-solid fa-trash"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <p v-if="message" :class="{'success-message': success, 'error-message': !success}">
      {{ message }}
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ApiService } from '@/utils/apiService.js';
import FormInput from '@/components/FormInput.vue';

const sessions = ref([]);
const message = ref('');
const success = ref(false);

const fetchSessions = async () => {
  try {
    const response = await ApiService.getSessions();
    sessions.value = response;
  } catch (error) {
    message.value = 'Erreur lors de la récupération des sessions';
    success.value = false;
  }
};

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

const addSession = async () => {
  const defaultStartDate = new Date().toISOString().slice(0, 10);
  const defaultEndDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

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

const updateSessionDate = async (sessionId, field, value) => {
  const session = sessions.value.find((s) => s._id === sessionId);
  if (!session) return;

  try {
    session[field] = value;
    await ApiService.updateSession(sessionId, { ...session });
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
