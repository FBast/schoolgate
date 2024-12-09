<template>
  <div class="flex-vertical gap-md">
    <!-- Formations column -->
    <div class="panel">
      <div class="header">
        <h2 class="title">{{ $t('formations') }}</h2>
        <div class="actions">
          <!-- Save All Changes -->
          <a @click="saveAllChanges">
            <i class="fas fa-save"></i>
          </a>
          <!-- Add Formation -->
          <a @click="addFormation">
            <i class="fas fa-square-plus"></i>
          </a>
        </div>
      </div>

      <!-- Formations List -->
      <div class="items-list">
        <div v-for="formation in formationStore.formations" :key="formation._id" class="item">
          <div
              class="item-content"
              :class="{ selected: formationStore.selectedFormation?._id === formation._id, modified: formation.isModified }"
          >
            <label>{{ formation.title }}</label>
            <div class="actions">
              <!-- Edit Formation -->
              <a @click.stop="toggleFormationDetails(formation)">
                <i class="fa-solid fa-pen-to-square"></i>
              </a>
              <!-- Delete Formation -->
              <a @click.stop="deleteFormation(formation._id)">
                <i class="fa-solid fa-trash"></i>
              </a>
            </div>
          </div>

          <!-- Grade Details -->
          <div v-if="formationStore.selectedFormation?._id === formation._id" class="item-foldout expanded">
            <div class="form-group flex-vertical gap-md padding-md">
              <FormInput
                  v-model="formationStore.selectedFormation.title"
                  :label="$t('formation_title')"
                  type="text"
                  required
                  @input="markFormationAsModified(formationStore.selectedFormation._id)"
              />

              <!-- Grades List -->
              <div class="sub-panel grades">
                <div class="header">
                  <h3 class="title">{{ $t('grades') }}</h3>
                  <div class="actions">
                    <!-- Add Grade -->
                    <a @click="addGrade">
                      <i class="fas fa-square-plus"></i>
                    </a>
                  </div>
                </div>
                <div class="items-list">
                  <div v-for="grade in formationStore.selectedFormation.grades" :key="grade._id" class="item">
                    <div class="item-content" :class="{ selected: formationStore.selectedGrade?._id === grade._id }">
                      <label>{{ grade.title }}</label>
                      <div class="actions">
                        <!-- Generate Exam -->
                        <a v-if="!formation.isModified" @click.stop="generateExam(formation, grade)">
                          <i class="fa-solid fa-file"></i>
                        </a>
                        <!-- Edit Grade -->
                        <a @click.stop="toggleGradeDetails(grade)">
                          <i class="fa-solid fa-pen-to-square"></i>
                        </a>
                        <!-- Delete Grade -->
                        <a @click.stop="deleteGrade(grade._id)">
                          <i class="fa-solid fa-trash"></i>
                        </a>
                      </div>
                    </div>

                    <!-- Grade Details -->
                    <div v-if="formationStore.selectedGrade?._id === grade._id" class="item-foldout expanded">
                      <div class="form-group flex-vertical gap-md padding-md">
                        <FormInput
                            v-model="grade.title"
                            :label="$t('grade_title')"
                            type="text"
                            required
                            @input="markFormationAsModified(formationStore.selectedFormation._id)"
                        />
                        <FormMultiSelect
                            v-model="grade.topics"
                            :options="topicStore.topics.map(topic => ({ label: topic.title, value: topic._id }))"
                            :label="$t('associated_topics')"
                            @input="markFormationAsModified(formationStore.selectedFormation._id)"
                            @selected="markFormationAsModified(formationStore.selectedFormation._id)"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- End of Grades List -->
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {defineEmits, onMounted, onUnmounted} from "vue";
import { useI18n } from "vue-i18n";
import { useFormationStore } from "@/stores/formationStore";
import { useTopicStore } from "@/stores/topicStore";
import FormInput from "@/components/FormInput.vue";
import FormMultiSelect from "@/components/FormMultiSelect.vue";
import {ApiService} from "@/utils/apiService.js";
import {convertBase64ToBufferData, downloadFileFromBuffer} from "@/utils/helpers.js";
import {AxiosHeaders as Buffer} from "axios";

const { t } = useI18n();
const formationStore = useFormationStore();
const topicStore = useTopicStore();
const emit = defineEmits(["notify"]);

onMounted(async () => {
  try {
    emit("notify", { success: true, message: t("loading_formations_and_topics") });
    await Promise.all([
      formationStore.fetchFormations(),
      topicStore.fetchTopics(),
    ]);
    emit("notify", { success: true, message: t("formations_and_topics_loaded_successfully") });
  } catch (error) {
    emit("notify", { success: false, message: t("error_loading_formations_and_topics") });
    console.error("Error loading formations and topics:", error);
  }
});

// onUnmounted(() => {
//   formationStore.selectFormation(null);
// });

const saveAllChanges = async () => {
  try {
    await formationStore.saveAllChanges();
    emit("notify", { success: true, message: t("all_changes_saved_successfully") });
  } catch (error) {
    emit("notify", { success: false, message: t("error_saving_changes") });
  }
};

const addFormation = () => {
  formationStore.addFormation();
  emit("notify", { success: true, message: t("new_formation_added_successfully") });
};

const deleteFormation = async (topicId) => {
  try {
    await formationStore.deleteFormation(topicId);
    emit("notify", { success: true, message: t("topic_formation_successfully") });
  } catch (error) {
    emit("notify", { success: false, message: error.message });
  }
};

const addGrade = () => {
  formationStore.addGrade();
  emit("notify", { success: true, message: t("new_grade_added_successfully") });
};

const deleteGrade = (gradeId) => {
  formationStore.deleteGrade(gradeId);
  emit("notify", { success: true, message: t("grade_deleted_successfully") });
};

const toggleFormationDetails = (formation) => {
  if (formationStore.selectedFormation?._id === formation._id) {
    formationStore.selectFormation(null);
  } else {
    formationStore.selectFormation(formation);
  }
};

const toggleGradeDetails = (grade) => {
  if (formationStore.selectedGrade?._id === grade._id) {
    formationStore.selectGrade(null);
  } else {
    formationStore.selectGrade(grade);
  }
};

const markFormationAsModified = (formationId) => {
  formationStore.markFormationAsModified(formationId);
};

const generateExam = async (formation, grade) => {
  try {
    const response = await ApiService.generateExam(formation._id, grade._id);
    const bufferData = convertBase64ToBufferData(response.pdf);
    downloadFileFromBuffer(bufferData, `Exam_${formation.title}_${grade.title}`, 'pdf');
  } catch (error) {
    console.error("Error generating exam", error);
  }
};

</script>