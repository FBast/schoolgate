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
          <button
              v-if="examPdfAvailable"
              class="button"
              @click="downloadExamPdf"
          >
            {{ $t('download_exam_pdf') }}
          </button>
          <label class="upload-label">
            <input type="file" @change="uploadFile" />
            {{ $t('upload_submission') }}
          </label>
        </div>
      </div>
    </div>
    <!-- Informations utilisateur -->
    <div class="panel flex-vertical gap-md">
      <div class="header">
        <h2 class="title">{{ $t('candidate_information') }}</h2>
      </div>
      <label>{{ $t('first_name') }} : {{ userInfo.firstName }}</label>
      <label>{{ $t('last_name') }} : {{ userInfo.lastName }}</label>
      <label>{{ $t('birth_date') }} : {{ formatDate(userInfo.birthDate) }}</label>
      <label>{{ $t('requested_formation') }} : {{ formations[userInfo.requestedFormation] }}</label>
      <label>{{ $t('requested_grade') }} : {{ grades[userInfo.requestedGrade] }}</label>
      <p v-if="message" :class="{'success-message': success, 'error-message': !success}">
        {{ message }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ApiService } from '@/utils/apiService.js';
import { formatDate } from "@/utils/helpers.js";
import {AxiosHeaders as Buffer} from "axios";

const userInfo = ref({});
const formations = ref([]);
const grades = ref([]);
const message = ref('');
const success = ref(false);
const examPdfAvailable = ref(false);

// Récupérer les informations utilisateur
const fetchUserInfo = async () => {
  try {
    userInfo.value = await ApiService.getUserProfile();
    examPdfAvailable.value = !!userInfo.value.examPdf; // Vérifie si le PDF est disponible
  } catch (error) {
    message.value = 'Erreur lors de la récupération des informations utilisateur.';
    success.value = false;
    console.error('Erreur lors de la récupération des informations utilisateur :', error);
  }
};

// Télécharger le PDF
const downloadExamPdf = () => {
  if (!userInfo.value.examPdf) {
    message.value = 'Le fichier PDF n\'est pas disponible.';
    success.value = false;
    return;
  }

  try {
    const pdfBuffer = Buffer.from(userInfo.value.examPdf.data); // Vérifiez la structure des données
    const blob = new Blob([pdfBuffer], { type: 'application/pdf' });
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

    message.value = 'Fichier PDF téléchargé avec succès.';
    success.value = true;
  } catch (error) {
    message.value = 'Erreur lors du téléchargement du fichier PDF.';
    success.value = false;
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
    const formData = new FormData();
    formData.append('submission', file);

    // Appeler le service pour mettre à jour le profil utilisateur
    const updatedUser = await ApiService.updateUserProfile(formData);

    userInfo.value = updatedUser;
    message.value = 'Fichier soumis avec succès.';
    success.value = true;
  } catch (error) {
    message.value = 'Erreur lors de la soumission du fichier.';
    success.value = false;
    console.error('Erreur lors de l\'upload du fichier :', error);
  }
};

// Charger les données au montage
onMounted(async () => {
  await fetchUserInfo();
});
</script>