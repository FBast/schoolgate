<template>
  <div class="layout-wide flex-horizontal gap-md">
    <!-- Description de l'étape -->
    <div class="panel flex-vertical gap-md">
      <div class="header">
        <h2 class="title">{{ $t('exam_in_progress') }}</h2>
      </div>
      <div>
        <p>{{ $t('exam_in_progress_description') }}</p>
        <div class="actions flex-horizontal gap-md">
          <FormButton
              v-if="examPdfAvailable"
              :label="$t('download_exam_pdf')"
              @click="downloadExamPdf"
          />
          <FormInput
              type="file"
              :label="$t('upload_submission')"
              @update:modelValue="uploadFile"
          />
        </div>
      </div>
    </div>
    <!-- Informations utilisateur -->
    <div class="panel flex-vertical gap-md">
      <div class="header">
        <h2 class="title">{{ $t('candidate_information') }}</h2>
      </div>
      <label>{{ $t('first_name') }} : {{ userStore.firstName }}</label>
      <label>{{ $t('last_name') }} : {{ userStore.lastName }}</label>
      <label>{{ $t('birth_date') }} : {{ formatDate(userStore.birthDate) }}</label>
      <label>{{ $t('requested_formation') }} : {{ formationStore.getFormationTitle(userStore.requestedFormation) }}</label>
      <label>{{ $t('requested_grade') }} : {{ formationStore.getGradeLabel(userStore.requestedGrade) }}</label>
      <p v-if="userStore.message" :class="{ 'success-message': userStore.success, 'error-message': !userStore.success }">
        {{ userStore.message }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { useFormationStore } from '@/stores/formationStore';
import { formatDate } from '@/utils/helpers.js';
import FormButton from "@/components/FormButton.vue";
import FormInput from "@/components/FormInput.vue";
import { useI18n } from 'vue-i18n';
import { ApiService } from '@/utils/apiService';

const userStore = useUserStore();
const formationStore = useFormationStore();
const { t } = useI18n();

// Vérifier si le PDF de l'examen est disponible
const examPdfAvailable = computed(() => !!userStore.examPdf);

// Télécharger le PDF
const downloadExamPdf = async () => {
  try {
    const response = await ApiService.downloadExamPdf();
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    // Créer un lien pour télécharger
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'exam.pdf');
    document.body.appendChild(link);
    link.click();

    // Nettoyer le lien temporaire
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    userStore.message = t('pdf_download_success');
    userStore.success = true;
  } catch (error) {
    userStore.message = t('pdf_download_error');
    userStore.success = false;
    console.error(t('pdf_download_error'), error);
  }
};

// Uploader le fichier de rendu
const uploadFile = async (event) => {
  const file = event.target.files[0];
  if (!file) {
    return;
  }

  try {
    const formData = new FormData();
    formData.append('examDeposit', file);

    // await userStore.uploadExamDeposit(formData);

    userStore.message = t('file_submission_success');
    userStore.success = true;
  } catch (error) {
    userStore.message = t('file_submission_error');
    userStore.success = false;
    console.error(t('file_upload_error'), error);
  }
};
</script>
