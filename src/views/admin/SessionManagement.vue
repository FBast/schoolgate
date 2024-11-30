<template>
  <div class="flex-vertical gap-md">
    <div class="panel">
      <div class="header">
        <h2 class="title">{{ $t('sessions') }}</h2>
        <div class="actions">
          <a @click="addSession"><i class="fas fa-square-plus"></i></a>
        </div>
      </div>
      <div class="items-list-header">
        <div class="header-details">
          <span>{{ $t('name') }}</span>
          <span>{{ $t('start_date') }}</span>
          <span>{{ $t('end_date') }}</span>
          <span class="actions">{{ $t('actions') }}</span>
        </div>
      </div>
      <div class="items-list">
        <div v-for="session in sessionStore.sessions"
            :key="session._id"
            class="item">
          <div class="item-content" @click="toggleDetails(session)">
            <label>{{ session.name }}</label>
            <label>{{ formatDateWithTime(session.startDate) }}</label>
            <label>{{ formatDateWithTime(session.endDate) }}</label>
            <div class="actions">
              <a @click.stop="deleteSession(session._id)">
                <i class="fa-solid fa-trash"></i>
              </a>
            </div>
          </div>
          <div class="item-foldout" :class="{ expanded: sessionStore.selectedSession?._id === session._id }">
            <!-- Vérification que selectedSession n'est pas null avant d'afficher le formulaire -->
            <form v-if="sessionStore.selectedSession && sessionStore.selectedSession._id === session._id" @submit.prevent="updateSession" class="flex-vertical padding-md gap-md">
              <FormInput
                  :label="$t('name')"
                  type="text"
                  v-model="sessionStore.selectedSession.name"
                  :error="sessionStore.sessionErrors[session._id]?.name"
              />
              <FormInput
                  :label="$t('start_date')"
                  type="datetime-local"
                  v-model="sessionStore.selectedSession.startDate"
                  :error="sessionStore.sessionErrors[session._id]?.startDate"
              />
              <FormInput
                  :label="$t('end_date')"
                  type="datetime-local"
                  v-model="sessionStore.selectedSession.endDate"
                  :error="sessionStore.sessionErrors[session._id]?.endDate"
              />
              <FormButton :label="$t('update')" type="submit" />
            </form>
          </div>
        </div>
      </div>
    </div>
    <p v-if="sessionStore.message" :class="{'success-message': sessionStore.success, 'error-message': !sessionStore.success}">
      {{ sessionStore.message }}
    </p>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { useSessionStore } from "@/stores/sessionStore.js";
import FormInput from "@/components/FormInput.vue";
import FormButton from "@/components/FormButton.vue";
import { formatDateWithTime } from "@/utils/helpers.js";

const { t } = useI18n();
const sessionStore = useSessionStore();

const toggleDetails = (session) => {
  if (sessionStore.selectedSession?._id === session._id) {
    sessionStore.clearSelectedSession();
  } else {
    sessionStore.selectSession(session);
  }
};

const addSession = async () => {
  await sessionStore.addSession();
};

const updateSession = async () => {
  if (sessionStore.selectedSession) {
    await sessionStore.updateSession(sessionStore.selectedSession._id, sessionStore.selectedSession);
  }
};

const deleteSession = async (sessionId) => {
  await sessionStore.deleteSession(sessionId);
};

</script>