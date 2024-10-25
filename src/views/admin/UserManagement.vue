<template>
  <div class="user-management-container">
    <div class="section users">
      <h2>Users</h2>
      <table class="user-table">
        <thead>
        <tr>
          <th>Nom</th>
          <th>Prénom</th>
          <th>Email</th>
          <th>Rôle</th>
          <th>Statut</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="user in users" :key="user._id">
          <td>{{ user.lastName }}</td>
          <td>{{ user.firstName }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.role }}</td>
          <td>{{ user.status }}</td>
          <td>
            <button @click="editUser(user._id)">Modifier</button>
            <button @click="deleteUser(user._id)">Supprimer</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <p v-if="message" :class="{'success-message': success, 'error-message': !success}">
      {{ message }}
    </p>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import {ApiService} from '@/utils/apiService.js';

const users = ref([]);
const message = ref('');
const success = ref(false);

// Récupérer les utilisateurs au montage du composant
const fetchUsers = async () => {
  try {
    const response = await ApiService.getUsers();
    users.value = response;
  } catch (error) {
    message.value = 'Erreur lors de la récupération des utilisateurs';
    success.value = false;
  }
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

const editUser = (userId) => {
  console.log(`Modifier utilisateur avec ID : ${userId}`);
};

onMounted(() => {
  fetchUsers();
});
</script>

<style scoped lang="scss">
@import "@/styles/utils/variables";

.user-management-container {
  display: flex;
  flex-direction: column;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.user-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: $spacing-md;

  th, td {
    padding: $spacing-sm;
    border: 1px solid $text-color;
  }

  th {
    background-color: $primary-color;
    color: white;
  }

  td {
    text-align: center;
  }

  button {
    background-color: $primary-color;
    color: white;
    padding: $spacing-xs $spacing-sm;
    border: none;
    border-radius: $border-radius;
    cursor: pointer;
  }

  button:hover {
    background-color: lighten($primary-color, 10%);
  }
}

.success-message {
  color: $success-color;
}

.error-message {
  color: $error-color;
}
</style>