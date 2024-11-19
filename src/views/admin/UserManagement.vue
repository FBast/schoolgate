<template>
  <div class="layout-wide gap-md">
    <div class="panel">
      <div class="header">
        <h2 class="title">{{ $t('user_information') }}</h2>
      </div>
      <!-- Header List -->
      <div class="items-list-header">
        <div class="header-details">
          <span>Email</span>
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
            <label>{{ $t(user.status) }}</label>
            <div class="actions">
              <a @click.stop="editUser(user._id)">
                <i class="fa-solid fa-pen-to-square"></i>
              </a>
              <a @click.stop="deleteUser(user._id)">
                <i class="fa-solid fa-trash"></i>
              </a>
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
import { useI18n } from 'vue-i18n';
import { ApiService } from '@/utils/apiService.js';
import UserInformations from "@/views/admin/UserInformations.vue";

const { t } = useI18n();

const users = ref([]);
const expandedUserId = ref(null);
const message = ref('');
const success = ref(false);

// Récupérer les utilisateurs
const fetchUsers = async () => {
  try {
    const response = await ApiService.getUsers();
    users.value = response.filter(user => user.role === 'user');
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

// Mettre à jour les informations utilisateur
const handleUserUpdate = (updatedUser) => {
  const index = users.value.findIndex(user => user._id === updatedUser._id);
  if (index !== -1) {
    users.value[index] = updatedUser;
  }
};

const editUser = (userId) => {
  console.log(`${t('edit_user')} ${userId}`);
};

// Charger les utilisateurs au montage
onMounted(() => {
  fetchUsers();
});
</script>