<template>
  <div class="layout-wide flex-horizontal gap-md">
    <!-- Description de l'étape -->
    <div class="panel flex-vertical gap-md">
      <div class="header">
        <h2 class="title">{{ $t('exam_in_progress') }}</h2>
      </div>
      <p>{{ $t('exam_in_progress_description') }}</p>
      <div class="actions flex-vertical gap-md">
        <FormInput
            type="file"
            :label="$t('upload_submission')"
            @change="handleUploadExamReport"
        />
        <FormButton
            v-if="authStore.currentUser.examSubject"
            :label="$t('download_exam_pdf')"
            @click="handleDownloadExamSubject"
        />
      </div>
    </div>
    <!-- Informations utilisateur -->
    <div class="panel flex-vertical gap-md">
      <div class="header">
        <h2 class="title">{{ $t('candidate_information') }}</h2>
      </div>
      <label>{{ $t('first_name') }} : {{ authStore.currentUser.firstName }}</label>
      <label>{{ $t('last_name') }} : {{ authStore.currentUser.lastName }}</label>
      <label>{{ $t('birth_date') }} : {{ formatDate(authStore.currentUser.birthDate) }}</label>
      <label>{{ $t('requested_formation') }} : {{ formationStore.getFormationTitle(authStore.currentUser.requestedFormation) }}</label>
      <label>{{ $t('requested_grade') }} : {{ formationStore.getGradeLabel(authStore.currentUser.requestedGrade) }}</label>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/userStore';
import { useFormationStore } from '@/stores/formationStore';
import {downloadFile, formatDate} from '@/utils/helpers.js';
import FormButton from "@/components/FormButton.vue";
import FormInput from "@/components/FormInput.vue";
import { useI18n } from 'vue-i18n';
import {useAuthStore} from "@/stores/authStore.js";
import {ApiService} from "@/utils/apiService.js";

const userStore = useUserStore();
const authStore = useAuthStore();
const formationStore = useFormationStore();
const { t } = useI18n();

const handleDownloadExamSubject = () => {
  if (authStore.currentUser.examSubject) {
    downloadFile(authStore.currentUser.examSubject, 'ENSI_Examen');
  } else {
    console.error('No exam PDF available to download.');
  }
};

// Uploader le fichier de rendu
const handleUploadExamReport = async (event) => {
  const file = event.target.files[0];
  if (!file) {
    console.error('No file selected.');
    return;
  }

  try {
    // Appel de l'API pour uploader le fichier
    await ApiService.uploadReport(file);

    // Met à jour le profil utilisateur pour afficher le fichier uploadé
    await authStore.fetchCurrentUser();

    userStore.message = t('file_submission_success');
    userStore.success = true;
  } catch (error) {
    userStore.message = t('file_submission_error');
    userStore.success = false;
    console.error(t('file_upload_error'), error);
  }
};
</script>
