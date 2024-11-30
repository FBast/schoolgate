<template>
  <div v-if="!formationStore.loading && !userStore.loading">
    <div class="panel">
      <div class="header">
        <h2 class="title">{{ $t('user_information') }}</h2>
      </div>
      <div class="items-list-header">
        <div class="header-details">
          <span>{{ $t('email') }}</span>
          <span>{{ $t('requested_formation') }}</span>
          <span>{{ $t('requested_grade') }}</span>
          <span>{{ $t('status') }}</span>
          <span class="actions">{{ $t('actions') }}</span>
        </div>
      </div>
      <div class="items-list">
        <div v-for="user in userStore.users"
            :key="user._id"
            class="item">
          <div class="item-content" :class="{ selected: userStore.selectedUser?._id === user._id }">
            <label>{{ user.email }}</label>
            <label>{{ formationStore.getFormationTitle(user.requestedFormation) || $t('formation_error') }}</label>
            <label>{{ formationStore.getGradeLabel(user.requestedGrade) || $t('grade_error') }}</label>
            <label>{{ $t(user.status) }}</label>
            <div class="actions">
              <a @click.stop="toggleDetails(user)">
                <i class="fa-solid fa-pen-to-square"></i>
              </a>
              <a @click.stop="deleteUser(user._id)">
                <i class="fa-solid fa-trash"></i>
              </a>
            </div>
          </div>
          <div class="item-foldout" :class="{ expanded: userStore.selectedUser?._id === user._id }">
            <UserInformation v-if="userStore.selectedUser?._id === user._id" />
          </div>
        </div>
      </div>
    </div>

    <div v-if="userStore.message" class="panel flex-vertical gap-md">
      <p :class="{ 'error-message': !userStore.success, 'success-message': userStore.success }">
        {{ userStore.message }}
      </p>
    </div>
  </div>
  <div v-else>
    <p>Chargement...</p>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/userStore';
import { useFormationStore } from '@/stores/formationStore';
import UserInformation from '@/views/admin/UserInformation.vue';

const userStore = useUserStore();
const formationStore = useFormationStore();

const toggleDetails = (user) => {
  if (userStore.selectedUser?._id === user._id) {
    userStore.clearSelectedUser();
  } else {
    userStore.selectUser(user);
  }
};

const deleteUser = async (userId) => {
  await userStore.deleteUser(userId);
};

</script>
