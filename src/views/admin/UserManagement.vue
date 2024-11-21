<template>
  <div class="layout-wide gap-md">
    <div class="panel">
      <div class="header">
        <h2 class="title">{{ $t('user_information') }}</h2>
      </div>
      <!-- Header List -->
      <div class="items-list-header">
        <div class="header-details">
          <span>{{ $t('email') }}</span>
          <span>{{ $t('requested_formation') }}</span>
          <span>{{ $t('requested_grade') }}</span>
          <span>{{ $t('status') }}</span>
          <span class="actions">{{ $t('actions') }}</span>
        </div>
      </div>
      <!-- Items List -->
      <div class="items-list">
        <div
            v-for="user in users"
            :key="user._id"
            class="item"
        >
          <!-- Item Content -->
          <div class="item-content" @click="toggleDetails(user._id)">
            <label>{{ user.email }}</label>
            <label>{{ formations[user.requestedFormation] || t('formation_error') }}</label>
            <label>{{ grades[user.requestedGrade] || t('grade_error') }}</label>
            <label>{{ $t(user.status) }}</label>
            <div class="actions">
              <a @click.stop="editUser(user._id)">
                <i class="fa-solid fa-pen-to-square"></i>
              </a>
              <a @click.stop="deleteUser(user._id)">
                <i class="fa-solid fa-trash"></i>
              </a>
              <a v-if="user.examPdf" @click.stop="downloadPdf(user._id)">
                <i class="fa-solid fa-file-pdf"></i>
              </a>
            </div>
          </div>
          <!-- Item Foldout -->
          <div class="item-foldout" :class="{ expanded: expandedUserId === user._id }">
            <UserInformation
                v-if="expandedUserId === user._id"
                :user="user"
                @update="handleUserUpdate"
            />
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
import UserInformation from "@/views/admin/UserInformation.vue";
import {ROLES_OPTIONS} from "@/utils/constants.js";

const { t } = useI18n();

const users = ref([]);
const formations = ref([]);
const grades = ref([]);
const expandedUserId = ref(null);
const message = ref('');
const success = ref(false);

// Transformer les formations et grades en dictionnaires
const fetchFormationsAndGrades = async () => {
  try {
    const formationsResponse = await ApiService.getFormations();
    const gradesResponse = await ApiService.getGrades();

    // Transformer en objets (dictionnaires)
    formations.value = formationsResponse.reduce(
        (dict, formation) => ({ ...dict, [formation._id]: formation.title }),
        {}
    );
    grades.value = gradesResponse.reduce(
        (dict, grade) => ({ ...dict, [grade._id]: grade.grade }),
        {}
    );
  } catch (error) {
    console.error(t('fetching_formations_error'), error);
  }
};

// Récupérer les utilisateurs
const fetchUsers = async () => {
  try {
    const response = await ApiService.getUsers();
    users.value = response.filter(user => user.role === ROLES_OPTIONS.user);
  } catch (error) {
    message.value = t('error_fetching_users');
    success.value = false;
  }
};

// Basculer l'affichage des détails utilisateur
const toggleDetails = (userId) => {
  expandedUserId.value = expandedUserId.value === userId ? null : userId;
};

// Supprimer un utilisateur
const deleteUser = async (userId) => {
  try {
    await ApiService.deleteUser(userId);
    message.value = t('success_user_deleted');
    success.value = true;
    await fetchUsers();
  } catch (error) {
    message.value = t('error_deleting_user');
    success.value = false;
  }
};

const downloadPdf = async (userId) => {
  try {
    // Récupérer l'utilisateur pour obtenir son PDF
    const user = await ApiService.getUser(userId);

    if (!user.examPdf) {
      message.value = t('no_pdf_available');
      success.value = false;
      return;
    }

    // Convertir le PDF en Blob
    const pdfBuffer = Buffer.from(user.examPdf.data); // `data` si c'est un buffer natif
    const blob = new Blob([pdfBuffer], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    // Créer un lien pour télécharger le PDF
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'exam.pdf');
    document.body.appendChild(link);
    link.click();

    // Nettoyer le lien temporaire
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    message.value = t('pdf_downloaded_successfully');
    success.value = true;
  } catch (error) {
    message.value = t('error_downloading_pdf');
    success.value = false;
    console.error('Erreur lors du téléchargement du PDF :', error);
  }
};

// Mettre à jour les informations utilisateur
const handleUserUpdate = (updatedUser) => {
  const index = users.value.findIndex((user) => user._id === updatedUser._id);
  if (index !== -1) {
    users.value[index] = updatedUser;
  }
};

const editUser = (userId) => {
  console.log(`${t('edit_user')} ${userId}`);
};

// Charger les données au montage
onMounted(async () => {
  await fetchFormationsAndGrades();
  await fetchUsers();
});
</script>