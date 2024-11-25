<template>
  <form @submit.prevent="updateUser">
    <div class="flex-horizontal padding-md gap-md">
      <div class="flex-vertical gap-md">
        <FormInput v-model="editableUser.firstName" label="Prénom" type="text" />
        <FormInput v-model="editableUser.lastName" label="Nom" type="text" />
        <FormInput v-model="editableUser.birthDate" label="Date de naissance" type="date" />
        <FormSelect v-model="editableUser.requestedFormation" :options="formationOptions" label="Formation demandée" />
        <FormSelect v-model="editableUser.requestedGrade" :options="gradeOptions" label="Année demandée" />
      </div>
      <div class="flex-vertical gap-md">
        <FormSelect v-model="editableUser.status" :options="statusOptions" label="Statut" />
        <FormTextarea v-model="editableUser.evaluation" label="Texte d'évaluation" />
        <FormInput v-model="editableUser.meetingDate" label="Date de rendez-vous" type="date" />
        <FormButton :label="$t('update')" />
      </div>
    </div>
  </form>
</template>

<script setup>
import { reactive, computed, watch } from 'vue';
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

const editableUser = reactive({});

watch(
    () => userStore.selectedUser,
    (newUser) => {
      if (newUser) {
        Object.assign(editableUser, {
          ...newUser,
          birthDate: newUser.birthDate?.split('T')[0] || '',
        });
      }
    },
    { immediate: true }
);

const statusOptions = Object.keys(STATUS_OPTIONS).map((key) => ({
  label: t(key),
  value: STATUS_OPTIONS[key],
}));

const formationOptions = computed(() => formationStore.formationOptions);

const gradeOptions = computed(() => {
  return formationStore.gradeOptionsByFormationId(editableUser.requestedFormation);
});

const updateUser = async () => {
  try {
    await userStore.updateUser(userStore.selectedUser._id, editableUser);
  } catch (error) {
    console.error(error);
  }
};

watch(
    () => editableUser.requestedFormation,
    (newFormation) => {
      if (newFormation) {
        // Vérifier si le grade actuel est valide pour la nouvelle formation
        const grades = formationStore.getGradesByFormationId(newFormation);
        const gradeIds = grades.map(grade => grade._id);
        if (!gradeIds.includes(editableUser.requestedGrade)) {
          editableUser.requestedGrade = '';
        }
      } else {
        editableUser.requestedGrade = '';
      }
    }
);
</script>