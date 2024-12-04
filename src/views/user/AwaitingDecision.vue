<template>
  <div class="flex-horizontal gap-md">
    <!-- Description de l'étape -->
    <div class="panel flex-vertical gap-md">
      <div class="header">
        <h2 class="title">{{ $t('awaiting_decision_title') }}</h2>
      </div>
      <p>
        {{ $t('awaiting_decision_description') }}
      </p>
      <p>
        {{ $t('decision_email_notification') }}
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
      <p v-if="authStore.message" :class="{ 'success-message': authStore.success, 'error-message': !authStore.success }">
        {{ authStore.message }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from "@/stores/authStore.js";
import { useFormationStore } from "@/stores/formationStore.js";
import { formatDate } from "@/utils/helpers.js";
import { useI18n } from "vue-i18n";

const authStore = useAuthStore();
const formationStore = useFormationStore();
const { t } = useI18n();
</script>