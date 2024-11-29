<template>
  <form @submit.prevent="updateUser">
    <div class="flex-horizontal padding-md gap-md">
      <div class="flex-vertical gap-md">
        <FormInput v-model="userStore.selectedUser.firstName" label="Prénom" type="text" />
        <FormInput v-model="userStore.selectedUser.lastName" label="Nom" type="text" />
        <FormInput v-model="userStore.selectedUser.birthDate" label="Date de naissance" type="date" />
        <FormSelect v-model="userStore.selectedUser.requestedFormation" :options="formationStore.formationOptions" label="Formation demandée" />
        <FormSelect v-model="userStore.selectedUser.requestedGrade" :options="gradeOptions" label="Année demandée" />
      </div>
      <div class="flex-vertical gap-md">
        <FormSelect v-model="userStore.selectedUser.status" :options="statusOptions" label="Statut" />
        <FormTextarea v-model="userStore.selectedUser.evaluation" label="Texte d'évaluation" />
        <FormInput v-model="userStore.selectedUser.meetingDate" label="Date de rendez-vous" type="date" />
        <FormButton :label="$t('update')" type="submit" />
      </div>
    </div>
  </form>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useUserStore } from '@/stores/userStore';
import { useFormationStore } from '@/stores/formationStore';
import FormInput from '@/components/FormInput.vue';
import FormSelect from '@/components/FormSelect.vue';
import FormButton from '@/components/FormButton.vue';
import FormTextarea from '@/components/FormTextarea.vue';
import { STATUS_OPTIONS } from '@/utils/constants';

const { t } = useI18n();
const userStore = useUserStore();
const formationStore = useFormationStore();

const statusOptions = Object.keys(STATUS_OPTIONS).map((key) => ({
  label: t(key),
  value: STATUS_OPTIONS[key],
}));

const gradeOptions = computed(() => {
  return formationStore.gradeOptionsByFormationId(userStore.selectedUser?.requestedFormation);
});

const updateUser = async () => {
  try {
    await userStore.updateUser(userStore.selectedUser._id, userStore.selectedUser);
  } catch (error) {
    console.error(error);
  }
};
</script>