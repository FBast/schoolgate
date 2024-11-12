<template>
  <div class="container">
    <!-- Formations column -->
    <div class="panel formations">
      <div class="header">
        <h2 class="title">Formations</h2>
        <div class="actions">
          <a @click="addFormation"><i class="fa-regular fa-square-plus"></i></a>
        </div>
      </div>
      <div class="items-list">
        <div
            v-for="formation in formations"
            :key="formation._id"
            class="item"
            :class="{ active: formation._id === selectedFormation?._id }"
            @click="selectFormation(formation)"
        >
          <div class="item-content">
            <label>{{ formation.title }}</label>
            <div class="actions">
              <a @click.stop="updateFormation(formation._id)"><i class="fa-solid fa-pen-to-square"></i></a>
              <a @click.stop="deleteFormation(formation._id)"><i class="fa-solid fa-trash"></i></a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Grades column -->
    <div class="panel grades" :class="{ disabled: !selectedFormation }">
      <div class="header">
        <h2 class="title">Grades</h2>
        <div class="actions">
          <a @click="addGrade(selectedFormation)"><i class="fa-regular fa-square-plus"></i></a>
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
              <a @click.stop="updateGrade(grade._id)"><i class="fa-solid fa-pen-to-square"></i></a>
              <a @click.stop="deleteGrade(grade._id)"><i class="fa-solid fa-trash"></i></a>
              <a @click.stop="generateExam(grade._id)"><i class="fa-solid fa-file-pdf"></i></a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Topics column -->
    <div class="panel topics" :class="{ disabled: !selectedGrade }">
      <div class="header">
        <h2 class="title">Topics</h2>
      </div>
      <div class="items-list">
        <div
            v-for="topic in topics"
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
import { ref, onMounted } from 'vue';
import { ApiService } from '@/utils/apiService.js';

const formations = ref([]);
const grades = ref([]);
const topics = ref([]);
const selectedFormation = ref(null);
const selectedGrade = ref(null);
const selectedTopics = ref([]);

// Fetch formations
const fetchFormations = async () => {
  try {
    const responseData = await ApiService.getFormations();
    formations.value = responseData;
    if (formations.value.length > 0) {
      selectedFormation.value = formations.value[0];
      await fetchGrades();
    }
  } catch (error) {
    console.error('Error fetching formations:', error);
  }
};

// Fetch grades based on selectedFormation
const fetchGrades = async () => {
  if (!selectedFormation.value) return;

  try {
    const responseData = await ApiService.getGrades(selectedFormation.value._id);
    grades.value = responseData;
    if (grades.value.length > 0) {
      selectedGrade.value = grades.value[0];
      await fetchTopics();
    }
  } catch (error) {
    console.error('Error fetching grades:', error);
  }
};

// Fetch topics based on selectedGrade
const fetchTopics = async () => {
  if (!selectedGrade.value) return;

  try {
    const responseData = await ApiService.getTopics();
    topics.value = responseData;

    // Set selected topics based on the topics associated with the grade
    selectedTopics.value = selectedGrade.value.topics || [];
  } catch (error) {
    console.error('Error fetching topics:', error);
  }
};

// Select a formation and fetch its grades
const selectFormation = async (formation) => {
  selectedFormation.value = formation;
  selectedGrade.value = null;
  selectedTopics.value = [];
  await fetchGrades();
};

// Select a grade and fetch its topics
const selectGrade = async (grade) => {
  selectedGrade.value = grade;
  selectedTopics.value = grade.topics || [];
  await fetchTopics();
};

// Add a new formation
const addFormation = async () => {
  const newFormation = { title: `New Formation ${formations.value.length + 1}` };
  try {
    const responseData = await ApiService.createFormation(newFormation);
    formations.value.push(responseData.formation);
    await selectFormation(responseData.formation);
  } catch (error) {
    console.error('Error creating formation:', error);
  }
};

// Update a formation title
const updateFormation = async (id) => {
  const newTitle = prompt('Edit the formation title:');
  if (!newTitle) return;

  try {
    const responseData = await ApiService.updateFormation(id, { title: newTitle });
    const index = formations.value.findIndex((formation) => formation._id === id);
    formations.value[index] = responseData.formation;
    if (selectedFormation.value && selectedFormation.value._id === id) {
      selectedFormation.value = responseData.formation;
    }
  } catch (error) {
    console.error('Error updating formation:', error);
  }
};

// Delete a formation
const deleteFormation = async (id) => {
  try {
    await ApiService.deleteFormation(id);
    formations.value = formations.value.filter((formation) => formation._id !== id);
    if (selectedFormation.value && selectedFormation.value._id === id) {
      selectedFormation.value = formations.value.length > 0 ? formations.value[0] : null;
      grades.value = [];
      selectedGrade.value = null;
      selectedTopics.value = [];
      if (selectedFormation.value) await fetchGrades();
    }
  } catch (error) {
    console.error('Error deleting formation:', error);
  }
};

// Add a new grade to the selected formation
const addGrade = async () => {
  if (!selectedFormation.value) return;
  const newGrade = { grade: `Grade ${grades.value.length + 1}`, formationId: selectedFormation.value._id };
  try {
    const responseData = await ApiService.createGrade(newGrade);
    grades.value.push(responseData.grade);
    await selectGrade(responseData.grade);
  } catch (error) {
    console.error('Error creating grade:', error);
  }
};

// Update a grade title
const updateGrade = async (id) => {
  const newGrade = prompt('Edit the grade name:');
  if (!newGrade) return;

  try {
    const responseData = await ApiService.updateGrade(id, { grade: newGrade });
    const index = grades.value.findIndex((grade) => grade._id === id);
    grades.value[index] = responseData.grade;
    if (selectedGrade.value && selectedGrade.value._id === id) {
      selectedGrade.value = responseData.grade;
    }
  } catch (error) {
    console.error('Error updating grade:', error);
  }
};

// Delete a grade
const deleteGrade = async (id) => {
  try {
    await ApiService.deleteGrade(id);
    grades.value = grades.value.filter((grade) => grade._id !== id);
    if (selectedGrade.value && selectedGrade.value._id === id) {
      selectedGrade.value = grades.value.length > 0 ? grades.value[0] : null;
      selectedTopics.value = [];
      if (selectedGrade.value) await fetchTopics();
    }
  } catch (error) {
    console.error('Error deleting grade:', error);
  }
};

// Generate exam for a grade
const generateExam = async (gradeId) => {
  try {
    const response = await ApiService.generateExam(gradeId);
    const pdfBase64 = response.pdf;

    // Convertir la chaîne base64 en un Blob
    const byteCharacters = atob(pdfBase64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });

    // Créer un lien de téléchargement
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'exam.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    alert('Exam generated and downloaded successfully!');
  } catch (error) {
    console.error('Error generating exam:', error);
    alert('Error generating exam');
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

      const responseData = await ApiService.updateGrade(selectedGrade.value._id, gradeData);
      selectedGrade.value = responseData.grade;
    } catch (error) {
      console.error('Error updating grade:', error);
    }
  }
};

// Fetch initial data
onMounted(fetchFormations);
</script>