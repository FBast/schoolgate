<template>
  <div class="layout-wide flex-vertical gap-md">
    <!-- Formations column -->
    <div class="panel">
      <div class="header">
        <h2 class="title">{{ $t('formations') }}</h2>
        <div class="actions">
          <a @click="addFormation"><i class="fas fa-square-plus"></i></a>
        </div>
      </div>
      <div class="items-list">
        <div
            v-for="formation in formationStore.formations"
            :key="formation._id"
            class="item"
            :class="{ active: formation._id === formationStore.selectedFormation?._id }"
            @click="selectFormation(formation)"
        >
          <div class="item-content">
            <label>{{ formation.title }}</label>
            <div class="actions">
              <a @click.stop="updateFormation(formation._id)">
                <i class="fa-solid fa-pen-to-square"></i>
              </a>
              <a @click.stop="deleteFormation(formation._id)">
                <i class="fa-solid fa-trash"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Grades column -->
    <div class="panel" :class="{ disabled: !formationStore.selectedFormation }">
      <div class="header">
        <h2 class="title">{{ $t('grades') }}</h2>
        <div class="actions">
          <a @click="addGrade"><i class="fas fa-square-plus"></i></a>
        </div>
      </div>
      <div class="items-list">
        <div
            v-for="grade in grades"
            :key="grade._id"
            class="item"
            :class="{ active: grade._id === selectedGrade?._id }"
            @click="selectGrade(grade)"
        >
          <div class="item-content">
            <label>{{ grade.grade }}</label>
            <div class="actions">
              <a @click.stop="updateGrade(grade._id)">
                <i class="fa-solid fa-pen-to-square"></i>
              </a>
              <a @click.stop="deleteGrade(grade._id)">
                <i class="fa-solid fa-trash"></i>
              </a>
              <a @click.stop="generateExam(grade._id)">
                <i class="fa-solid fa-file-pdf"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Topics column -->
    <div class="panel topics" :class="{ disabled: !selectedGrade }">
      <div class="header">
        <h2 class="title">{{ $t('topics') }}</h2>
      </div>
      <div class="items-list">
        <div
            v-for="topic in topicStore.topics"
            :key="topic._id"
            class="item"
            :class="{ active: selectedTopics.includes(topic._id) }"
            @click="toggleTopicSelection(topic)"
        >
          <div class="item-content">
            <label>{{ topic.title }}</label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted} from "vue";
import {useI18n} from "vue-i18n";
import {useFormationStore} from "@/stores/formationStore";
import {useTopicStore} from "@/stores/topicStore";

const {t} = useI18n();
const formationStore = useFormationStore();
const topicStore = useTopicStore();

const selectedTopics = ref([]);
const selectedGrade = ref(null);
const grades = ref([]);

// Fetch initial data
onMounted(async () => {
  await formationStore.fetchFormations();
  if (formationStore.selectedFormation) {
    await fetchGrades(formationStore.selectedFormation._id);
  }
  await topicStore.fetchTopics();
});

// Fetch grades for the selected formation
const fetchGrades = async (formationId) => {
  grades.value = await formationStore.fetchGradesByFormationId(formationId);
};

// Select formation and fetch grades
const selectFormation = async (formation) => {
  formationStore.selectFormation(formation);
  selectedGrade.value = null;
  selectedTopics.value = [];
  await fetchGrades(formation._id);
};

// Select grade and update selected topics
const selectGrade = (grade) => {
  selectedGrade.value = grade;
  selectedTopics.value = grade.topics || [];
};

// Add formation
const addFormation = async () => {
  const title = prompt(t("add_formation"));
  if (title) {
    await formationStore.addFormation(title);
    if (formationStore.selectedFormation) {
      await fetchGrades(formationStore.selectedFormation._id);
    }
  }
};

// Update formation
const updateFormation = async (formationId) => {
  const title = prompt(t("edit_formation"));
  if (title) {
    await formationStore.updateFormation(formationId, title);
  }
};

// Delete formation
const deleteFormation = async (formationId) => {
  await formationStore.deleteFormation(formationId);
  if (formationStore.selectedFormation) {
    await fetchGrades(formationStore.selectedFormation._id);
  }
};

// Add grade
const addGrade = async () => {
  const gradeValue = prompt(t("add_grade"));
  if (gradeValue && formationStore.selectedFormation) {
    await formationStore.addGradeToFormation(formationStore.selectedFormation._id, {grade: gradeValue});
    await fetchGrades(formationStore.selectedFormation._id);
  }
};

// Update grade
const updateGrade = async (gradeId) => {
  const gradeValue = prompt(t("edit_grade"));
  if (gradeValue) {
    await formationStore.updateGrade(gradeId, {grade: gradeValue});
    await fetchGrades(formationStore.selectedFormation._id);
  }
};

// Delete grade
const deleteGrade = async (gradeId) => {
  await formationStore.deleteGrade(gradeId);
  await fetchGrades(formationStore.selectedFormation._id);
};

// Generate exam for grade
const generateExam = async (gradeId) => {
  const grade = grades.value.find((g) => g._id === gradeId);
  if (!grade) return;

  try {
    const response = await ApiService.generateExam(gradeId);
    const blob = new Blob([response.pdf], {type: "application/pdf"});
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${grade.grade}_exam.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error(t("error_generating_exam"), error);
  }
};

// Toggle topic selection
const toggleTopicSelection = async (topic) => {
  const index = selectedTopics.value.indexOf(topic._id);
  if (index === -1) {
    selectedTopics.value.push(topic._id);
  } else {
    selectedTopics.value.splice(index, 1);
  }

  if (selectedGrade.value) {
    try {
      const gradeData = {
        grade: selectedGrade.value.grade,
        topics: selectedTopics.value,
      };
      await formationStore.updateGrade(selectedGrade.value._id, gradeData);
    } catch (error) {
      console.error(t("error_updating_grade"), error);
    }
  }
};
</script>