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
              v-if="userStore.examPdf"
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
import {onMounted} from 'vue';
import {useUserStore} from '@/stores/userStore';
import {useFormationStore} from '@/stores/formationStore';
import {formatDate} from '@/utils/helpers.js';
import FormButton from "@/components/FormButton.vue";
import FormInput from "@/components/FormInput.vue";

const userStore = useUserStore();
const formationStore = useFormationStore();

// Télécharger le PDF
const downloadExamPdf = () => {
  if (!userStore.examPdf) {
    userStore.message = 'Le fichier PDF n\'est pas disponible.';
    userStore.success = false;
    return;
  }

  try {
    const blob = new Blob([userStore.examPdf], {type: 'application/pdf'});
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

    userStore.message = 'Fichier PDF téléchargé avec succès.';
    userStore.success = true;
  } catch (error) {
    userStore.message = 'Erreur lors du téléchargement du fichier PDF.';
    userStore.success = false;
    console.error('Erreur lors du téléchargement du fichier PDF :', error);
  }
};

// Uploader le fichier de rendu
const uploadFile = async (event) => {
  const file = event.target.files[0];
  if (!file) {
    return;
  }

  try {
    const formData = {
      examDeposit: file,
    };

    await userStore.updateUserProfile(formData);

    userStore.message = 'Fichier soumis avec succès.';
    userStore.success = true;
  } catch (error) {
    userStore.message = 'Erreur lors de la soumission du fichier.';
    userStore.success = false;
    console.error('Erreur lors de l\'upload du fichier :', error);
  }
};

// Charger les données au montage
onMounted(async () => {
  await userStore.fetchUserProfile();
  await formationStore.fetchFormations();
});
</script>
