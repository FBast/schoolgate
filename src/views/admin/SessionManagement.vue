<template>
  <div class="flex-vertical gap-md">
    <div class="panel">
      <div class="header">
        <h2 class="title">{{ $t('sessions') }}</h2>
        <div class="actions">
          <a @click="updateAllSessions">
            <i class="fas fa-save"></i>
          </a>
          <a @click="addSession">
            <i class="fas fa-square-plus"></i>
          </a>
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
        <div
            v-for="session in sessionStore.sessions"
            :key="session._id"
            class="item"
        >
          <div
              class="item-content"
              :class="{ selected: sessionStore.selectedSession?._id === session._id, modified: session.isModified }"
          >
            <label>{{ session.name }}</label>
            <label>{{ formatDateWithTime(session.startDate) }}</label>
            <label>{{ formatDateWithTime(session.endDate) }}</label>
            <div class="actions">
              <a @click.stop="switchSessionEnabled(session._id)">
                <i :class="session.enabled ? 'fa-solid fa-calendar-check' : 'fa-solid fa-calendar-times'"></i>
              </a>
              <a @click.stop="toggleDetails(session)">
                <i class="fa-solid fa-pen-to-square"></i>
              </a>
              <a @click.stop="deleteSession(session._id)">
                <i class="fa-solid fa-trash"></i>
              </a>
            </div>
          </div>
          <div
              class="item-foldout"
              :class="{ expanded: sessionStore.selectedSession?._id === session._id }"
          >
            <div
                v-if="sessionStore.selectedSession && sessionStore.selectedSession._id === session._id"
                class="flex-vertical padding-md gap-md"
            >
              <FormInput
                  :label="$t('name')"
                  type="text"
                  v-model="session.name"
                  @input="sessionStore.markAsModified(session._id)"
              />
              <FormInput
                  :label="$t('start_date')"
                  type="datetime-local"
                  v-model="session.startDate"
                  @input="sessionStore.markAsModified(session._id)"
              />
              <FormInput
                  :label="$t('end_date')"
                  type="datetime-local"
                  v-model="session.endDate"
                  @input="sessionStore.markAsModified(session._id)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { useSessionStore } from "@/stores/sessionStore.js";
import FormInput from "@/components/FormInput.vue";
import { formatDateWithTime } from "@/utils/helpers.js";

const { t } = useI18n();
const sessionStore = useSessionStore();
const emit = defineEmits(["notify"]);

// Toggle des détails
const toggleDetails = (session) => {
  if (sessionStore.selectedSession?._id === session._id) {
    sessionStore.clearSelectedSession();
  } else {
    sessionStore.selectSession(session);
  }
};

// Ajout d'une session
const addSession = () => {
  sessionStore.addSession();
  emit("notify", { success: true, message: t("success_adding_session") });
};

// Mise à jour de toutes les sessions modifiées
const updateAllSessions = async () => {
  try {
    await sessionStore.updateAllSessions();
    emit("notify", { success: true, message: t("all_changes_saved_successfully") });
  } catch (error) {
    emit("notify", { success: false, message: t("error_saving_changes") });
  }
};

// Suppression d'une session
const deleteSession = async (sessionId) => {
  try {
    await sessionStore.deleteSession(sessionId);
    emit("notify", { success: true, message: t("success_deleting_session") });
  } catch (error) {
    emit("notify", { success: false, message: t("error_deleting_session") });
  }
};

// Activation/désactivation d'une session
const switchSessionEnabled = (sessionId) => {
  const session = sessionStore.getSessionById(sessionId);
  if (session) {
    session.enabled = !session.enabled; // Inverse l'état d'activation
    session.isModified = true; // Marque la session comme modifiée
    emit("notify", { success: true, message: t("session_status_toggled") });
  } else {
    emit("notify", { success: false, message: t("error_session_not_found") });
  }
};
</script>