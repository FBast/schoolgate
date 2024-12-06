<template>
  <div class="flex-vertical gap-md">
    <div class="panel">
      <div class="header">
        <h2 class="title">{{ $t('candidates') }}</h2>
        <div class="actions">
          <a @click="saveAllChanges">
            <i class="fas fa-save"></i>
          </a>
        </div>
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
        <div v-for="user in userStore.users" :key="user._id" class="item">
          <div
              class="item-content"
              :class="{ selected: userStore.selectedUser?._id === user._id, modified: user.isModified }"
          >
            <label>{{ user.email }}</label>
            <label>{{ formationStore.getFormationTitle(user.requestedFormation) || $t('formation_error') }}</label>
            <label>{{ formationStore.getGradeTitle(user.requestedFormation, user.requestedGrade) || $t('grade_error') }}</label>
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
            <div v-if="userStore.selectedUser?._id === user._id" class="flex-vertical padding-md gap-md">
              <div class="flex-horizontal gap-md">
                <div class="flex-vertical gap-md">
                  <FormInput
                      v-model="user.firstName"
                      :label="$t('first_name')"
                      type="text"
                      @input="userStore.markUserAsModified(user._id)"
                  />
                  <FormInput
                      v-model="user.lastName"
                      :label="$t('last_name')"
                      type="text"
                      @input="userStore.markUserAsModified(user._id)"
                  />
                  <FormInput
                      v-model="user.birthDate"
                      :label="$t('birth_date')"
                      type="date"
                      @input="userStore.markUserAsModified(user._id)"
                  />
                  <FormSelect
                      v-model="user.requestedFormation"
                      :options="formationStore.formationOptions"
                      :label="$t('requested_formation')"
                      @change="userStore.markUserAsModified(user._id)"
                  />
                  <FormSelect
                      v-model="user.requestedGrade"
                      :options="formationStore.gradeOptions(user.requestedFormation)"
                      :label="$t('requested_grade')"
                      @change="userStore.markUserAsModified(user._id)"
                  />
                  <div class="flex-horizontal gap-md">
                    <FormButton
                        v-if="user.examSubject"
                        :label="$t('download_exam_subject')"
                        @click="downloadFileFromBuffer(user.examSubject, `${user.firstName}_${user.lastName}_Examen`, 'pdf')"
                    />
                    <FormButton
                        v-if="user.examReport"
                        :label="$t('download_exam_report')"
                        @click="downloadFileFromBuffer(user.examReport, `${user.firstName}_${user.lastName}_Rendu`, 'zip')"
                    />
                  </div>
                </div>
                <div class="flex-vertical gap-md">
                  <FormSelect
                      v-model="user.status"
                      :options="statusOptions"
                      :label="$t('status')"
                      @change="userStore.markUserAsModified(user._id)"
                  />
                  <FormInput
                      v-model="user.meetingDate"
                      :label="$t('meeting_date')"
                      type="datetime-local"
                      @input="userStore.markUserAsModified(user._id)"
                  />
                  <FormTextarea
                      v-model="user.evaluation"
                      :label="$t('evaluation_text')"
                      @input="userStore.markUserAsModified(user._id)"
                  />
                  <FormSelect
                      v-model="user.decision"
                      :options="decisionOptions"
                      :label="$t('candidate_decision')"
                      @change="userStore.markUserAsModified(user._id)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { useUserStore } from '@/stores/userStore';
import { useFormationStore } from '@/stores/formationStore';
import FormInput from '@/components/FormInput.vue';
import FormSelect from '@/components/FormSelect.vue';
import FormTextarea from '@/components/FormTextarea.vue';
import { STATUS_OPTIONS } from '@/utils/constants';
import {onMounted} from "vue";
import FormButton from "@/components/FormButton.vue";
import {downloadFileFromBuffer} from "@/utils/helpers.js";

const userStore = useUserStore();
const formationStore = useFormationStore();
const { t } = useI18n();
const emit = defineEmits(["notify"]);

const statusOptions = Object.keys(STATUS_OPTIONS).map(key => ({
  label: t(key),
  value: STATUS_OPTIONS[key],
}));

const decisionOptions = [
  { label: t('accept'), value: 'accepted' },
  { label: t('reject'), value: 'rejected' },
  { label: t('waitlist'), value: 'waitlisted' }
];

onMounted(async () => {
  try {
    emit("notify", { success: true, message: t("loading_users") });
    await Promise.all([
      userStore.fetchUsers(),
      formationStore.fetchFormations(),
    ]);
    emit("notify", { success: true, message: t("users_loaded_successfully") });
  } catch (error) {
    emit("notify", { success: false, message: t("error_loading_users") });
    console.error("Error loading users or formations", error);
  }
});

// onUnmounted(() => {
//   userStore.selectUser(null);
// });

const toggleDetails = (user) => {
  if (userStore.selectedUser?._id === user._id) {
    userStore.selectUser(null)
  } else {
    userStore.selectUser(user);
  }
};

const deleteUser = async (userId) => {
  try {
    await userStore.deleteUser(userId);
    emit("notify", { success: true, message: t("success_deleting_user") });
  } catch (error) {
    emit("notify", { success: true, message: t("error_deleting_user") });
  }
};

const saveAllChanges = async () => {
  try {
    await userStore.saveAllChanges();
    emit("notify", { success: true, message: t("all_changes_saved_successfully") });
  } catch (error) {
    emit("notify", { success: false, message: t("error_saving_changes") });
  }
};
</script>
