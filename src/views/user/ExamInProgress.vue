<template>
  <div class="flex-horizontal gap-md">
    <!-- Description de l'étape -->
    <div class="panel flex-vertical gap-md">
      <div class="header">
        <h2 class="title">{{ $t('exam_in_progress') }}</h2>
      </div>
      <p>{{ $t('exam_in_progress_description') }}</p>
      <div class="actions flex-vertical gap-md">
        <FormButton
            v-if="authStore.currentUser.examSubject"
            :label="$t('download_exam_pdf')"
            @click="handleDownloadExamSubject"
        />
        <FormMultiUpload
            :label="$t('upload_submission')"
            accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.odt,.txt"
            v-model="uploadedFiles"
        />
        <FormButton
            v-if="uploadedFiles.length > 0"
            :label="$t('finish_exam')"
            @click="handleFinishExam"
        />
      </div>
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
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useFormationStore } from '@/stores/formationStore';
import { downloadFileFromBuffer, formatDate } from '@/utils/helpers.js';
import FormButton from "@/components/FormButton.vue";
import { useI18n } from 'vue-i18n';
import { useAuthStore } from "@/stores/authStore.js";
import { ApiService } from "@/utils/apiService.js";
import { STATUS_OPTIONS } from "@/utils/constants.js";
import FormMultiUpload from "@/components/FormMultiUpload.vue";

// Stores et services
const authStore = useAuthStore();
const formationStore = useFormationStore();
const { t } = useI18n();

// Événements
const emit = defineEmits(["notify", "statusChanged"]);

// Stocke le fichier localement jusqu'à la soumission
const uploadedFiles = ref([]);

// Télécharger le sujet de l'examen
const handleDownloadExamSubject = () => {
  if (authStore.currentUser.examSubject) {
    downloadFileFromBuffer(authStore.currentUser.examSubject, `${authStore.currentUser.firstName}_${authStore.currentUser.lastName}_Examen`, 'pdf');
    emit("notify", { success: true, message: t("file_download_success") });
  } else {
    emit("notify", { success: false, message: t("file_download_error") });
    console.error('No exam PDF available to download.');
  }
};

// Terminer l'examen
const handleFinishExam = async () => {
  try {
    if (!uploadedFiles.value) {
      emit("notify", { success: false, message: t("file_missing_error") });
      console.error('No file to upload.');
      return;
    }

    // Uploader le fichier via l'API
    await ApiService.uploadReport(uploadedFiles.value);

    // Mettre à jour le statut de l'utilisateur
    await authStore.updateCurrentUser({
      status: STATUS_OPTIONS.awaiting_appointment
    });
    emit('statusChanged');

    uploadedFiles.value = null; // Réinitialiser le fichier stocké

    emit("notify", { success: true, message: t("exam_finished_successfully") });
  } catch (error) {
    emit("notify", { success: false, message: t("exam_finish_error") });
    console.error(t('error_finishing_exam'), error);
  }
};
</script>