<template>
  <div class="flex-horizontal gap-md">
    <!-- Description de l'étape -->
    <div class="panel flex-vertical gap-md">
      <div class="header">
        <h2 class="title">{{ decisionTitle }}</h2>
      </div>
      <p>{{ decisionMessage }}</p>
      <p v-if="authStore.currentUser.evaluation">
        <strong>{{ $t('evaluation_feedback') }}:</strong> {{ authStore.currentUser.evaluation }}
      </p>
    </div>
    <!-- Informations utilisateur -->
    <div class="panel flex-vertical gap-md">
      <div class="header">
        <h2 class="title">{{ $t('information_title') }}</h2>
      </div>
      <label>{{ $t('first_name') }} : {{ authStore.currentUser.firstName }}</label>
      <label>{{ $t('last_name') }} : {{ authStore.currentUser.lastName }}</label>
      <label>{{ $t('birth_date') }} : {{ formatDate(authStore.currentUser.birthDate) }}</label>
      <label>{{ $t('requested_formation') }} : {{ formationStore.getFormationTitle(authStore.currentUser.requestedFormation) }}</label>
      <label>{{ $t('requested_grade') }} : {{ formationStore.getGradeTitle(authStore.currentUser.requestedFormation, authStore.currentUser.requestedGrade) }}</label>
      <p v-if="authStore.message" :class="{'success-message': authStore.success, 'error-message': !authStore.success}">
        {{ authStore.message }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useAuthStore } from "@/stores/authStore.js";
import { useFormationStore } from "@/stores/formationStore.js";
import { formatDate } from "@/utils/helpers.js";
import { useI18n } from "vue-i18n";

const authStore = useAuthStore();
const formationStore = useFormationStore();
const { t } = useI18n();

// Détermine le titre et le message en fonction de la décision
const decisionTitle = computed(() => {
  switch (authStore.currentUser.decision) {
    case "accepted":
      return t("application_accepted_title");
    case "rejected":
      return t("application_rejected_title");
    case "waitlisted":
      return t("application_waitlisted_title");
    default:
      return t("application_processed_title");
  }
});

const decisionMessage = computed(() => {
  switch (authStore.currentUser.decision) {
    case "accepted":
      return t("application_accepted_message", { name: authStore.currentUser.firstName });
    case "rejected":
      return t("application_rejected_message", { name: authStore.currentUser.firstName });
    case "waitlisted":
      return t("application_waitlisted_message", { name: authStore.currentUser.firstName });
    default:
      return t("application_processed_message");
  }
});
</script>
