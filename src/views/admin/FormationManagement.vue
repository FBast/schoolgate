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
            @click="formationStore.selectFormation(formation)"
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
            :class="{ active: grade._id === formationStore.selectedGrade?._id }"
            @click="formationStore.selectGrade(grade)"
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
    <div class="panel topics" :class="{ disabled: !formationStore.selectedGrade }">
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
import { computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useFormationStore } from "@/stores/formationStore";
import { useTopicStore } from "@/stores/topicStore";

const { t } = useI18n();
const formationStore = useFormationStore();
const topicStore = useTopicStore();

// Grades computed property
const grades = computed(() => {
  if (formationStore.selectedFormation) {
    return formationStore.getGradesByFormationId(formationStore.selectedFormation._id);
  } else {
    return [];
  }
});

// Selected topics
const selectedTopics = computed(() => {
  return formationStore.selectedGrade?.topics || [];
});

// Add formation
const addFormation = async () => {
  const title = prompt(t("add_formation"));
  if (title) {
    await formationStore.addFormation(title);
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
};

// Add grade
const addGrade = async () => {
  const gradeValue = prompt(t("add_grade"));
  if (gradeValue && formationStore.selectedFormation) {
    await formationStore.addGradeToFormation(formationStore.selectedFormation._id, { grade: gradeValue });
  }
};

// Update grade
const updateGrade = async (gradeId) => {
  const gradeValue = prompt(t("edit_grade"));
  if (gradeValue) {
    await formationStore.updateGrade(gradeId, { grade: gradeValue });
  }
};

// Delete grade
const deleteGrade = async (gradeId) => {
  await formationStore.deleteGrade(gradeId);
};

// Generate exam for grade
const generateExam = async (gradeId) => {
  const grade = grades.value.find((g) => g._id === gradeId);
  if (!grade) return;

  try {
    const response = await formationStore.generateExam(gradeId);
    const blob = new Blob([response.pdf], { type: "application/pdf" });
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

  if (formationStore.selectedGrade) {
    try {
      const gradeData = {
        grade: formationStore.selectedGrade.grade,
        topics: selectedTopics.value,
      };
      await formationStore.updateGrade(formationStore.selectedGrade._id, gradeData);
    } catch (error) {
      console.error(t("error_updating_grade"), error);
    }
  }
};
</script>