<template>
  <div class="container">
    <div class="panel users">
      <div class="header">
        <h2 class="title">Utilisateurs</h2>
      </div>
      <!-- Header List -->
      <div class="items-list-header">
        <div class="header-details">
          <span>Nom</span>
          <span>Prénom</span>
          <span>Email</span>
          <span>Rôle</span>
          <span>Statut</span>
          <span class="actions">Actions</span>
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
            <label>{{ user.lastName }}</label>
            <label>{{ user.firstName }}</label>
            <label>{{ user.email }}</label>
            <label>{{ user.role }}</label>
            <label>{{ user.status }}</label>
            <div class="actions">
              <a @click.stop="editUser(user._id)"><i class="fa-solid fa-pen-to-square"></i></a>
              <a @click.stop="deleteUser(user._id)"><i class="fa-solid fa-trash"></i></a>
            </div>
          </div>
          <!-- Item Foldout -->
          <div class="item-foldout" :class="{ expanded: expandedUserId === user._id }">
            <UserInformations
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
import { ApiService } from '@/utils/apiService.js';
import UserInformations from "@/views/admin/UserInformations.vue";

const users = ref([]);
const expandedUserId = ref(null);
const message = ref('');
const success = ref(false);

// Récupérer les utilisateurs
const fetchUsers = async () => {
  try {
    const response = await ApiService.getUsers();
    users.value = response;
  } catch (error) {
    message.value = 'Erreur lors de la récupération des utilisateurs';
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
    message.value = 'Utilisateur supprimé avec succès';
    success.value = true;
    await fetchUsers();
  } catch (error) {
    message.value = 'Erreur lors de la suppression de l\'utilisateur';
    success.value = false;
  }
};

// Mettre à jour les informations utilisateur
const handleUserUpdate = (updatedUser) => {
  const index = users.value.findIndex(user => user._id === updatedUser._id);
  if (index !== -1) {
    users.value[index] = updatedUser;
  }
};

const editUser = (userId) => {
  console.log(`Modifier utilisateur avec ID : ${userId}`);
};

// Charger les utilisateurs au montage
onMounted(() => {
  fetchUsers();
});
</script>