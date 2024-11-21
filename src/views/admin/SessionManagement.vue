<template>
  <div class="layout-wide flex-vertical gap-md">
    <div class="panel">
      <div class="header">
        <h2 class="title">{{ $t('sessions') }}</h2>
        <div class="actions">
          <a @click="addSession"><i class="fas fa-square-plus"></i></a>
        </div>
      </div>
      <!-- Header List -->
      <div class="items-list-header">
        <div class="header-details">
          <span>{{ $t('name') }}</span>
          <span>{{ $t('start_date') }}</span>
          <span>{{ $t('end_date') }}</span>
          <span class="actions">{{ $t('actions') }}</span>
        </div>
      </div>
      <!-- Items List -->
      <div class="items-list">
        <div
            v-for="session in sessions"
            :key="session._id"
            class="item"
        >
          <div class="item-content" @click="toggleDetails(session._id)">
            <label>{{ session.name }}</label>
            <label>{{ formatDate(session.startDate) }}</label>
            <label>{{ formatDate(session.endDate) }}</label>
            <div class="actions">
              <a @click.stop="deleteSession(session._id)">
                <i class="fa-solid fa-trash"></i>
              </a>
            </div>
          </div>
          <!-- Item Foldout -->
          <div class="item-foldout" :class="{ expanded: expandedSessionId === session._id }">
            <form @submit.prevent="updateSession(session._id)" class="flex-vertical padding-md gap-md">
              <FormInput
                  :label="$t('name')"
                  type="text"
                  v-model="session.name"
                  :error="sessionErrors[session._id]?.name"
              />
              <FormInput
                  :label="$t('start_date')"
                  type="date"
                  v-model="session.startDate"
                  :error="sessionErrors[session._id]?.startDate"
              />
              <FormInput
                  :label="$t('end_date')"
                  type="date"
                  v-model="session.endDate"
                  :error="sessionErrors[session._id]?.endDate"
              />
              <FormButton :label="$t('update')" type="submit" />
            </form>
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
import { useI18n } from 'vue-i18n';
import { ApiService } from '@/utils/apiService.js';
import FormInput from '@/components/FormInput.vue';
import FormButton from "@/components/FormButton.vue";
import {formatDate} from "@/utils/helpers.js";

const { t } = useI18n();

const sessions = ref([]);
const sessionErrors = ref({});
const expandedSessionId = ref(null);
const message = ref('');
const success = ref(false);

const fetchSessions = async () => {
  try {
    const response = await ApiService.getSessions();
    sessions.value = response;
  } catch (error) {
    message.value = t('fetching_sessions_error');
    success.value = false;
  }
};

// Basculer l'affichage des détails utilisateur
const toggleDetails = (sessionId) => {
  expandedSessionId.value = expandedSessionId.value === sessionId ? null : sessionId;
};

const validateSession = (session) => {
  const errors = {};

  // Validation du nom
  if (!session.name || session.name.trim().length === 0) {
    errors.name = t('name_required_error');
  }

  // Validation des dates
  if (!session.startDate) {
    errors.startDate = t('start_date_required_error');
  }

  if (!session.endDate) {
    errors.endDate = t('end_date_required_error');
  }

  if (session.startDate && session.endDate && session.startDate > session.endDate) {
    errors.startDate = t('start_date_after_end_error');
    errors.endDate = t('end_date_before_start_error');
  }

  return errors;
};

const updateSession = async (sessionId) => {
  const session = sessions.value.find((s) => s._id === sessionId);
  if (!session) return;

  const errors = validateSession(session);
  if (Object.keys(errors).length > 0) {
    sessionErrors.value[sessionId] = errors;
    return;
  }

  sessionErrors.value[sessionId] = {};

  try {
    await ApiService.updateSession(sessionId, session);
    message.value = t('session_updated_success');
    success.value = true;
  } catch (error) {
    message.value = t('session_updated_error');
    success.value = false;
  }
};

const deleteSession = async (sessionId) => {
  try {
    await ApiService.deleteSession(sessionId);
    message.value = t('session_deleted_success');
    success.value = true;
    await fetchSessions();
  } catch (error) {
    message.value = t('deleting_session_error');
    success.value = false;
  }
};

const addSession = async () => {
  const defaultStartDate = new Date().toISOString().slice(0, 10);
  const defaultEndDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  const newSession = {
    name: `${t('add_session')} ${sessions.value.length + 1}`,
    startDate: defaultStartDate,
    endDate: defaultEndDate,
  };

  try {
    await ApiService.createSession(newSession);
    message.value = t('session_created_success');
    success.value = true;
    await fetchSessions();
  } catch (error) {
    message.value = t('creating_session_error');
    success.value = false;
  }
};

onMounted(() => {
  fetchSessions();
});
</script>
