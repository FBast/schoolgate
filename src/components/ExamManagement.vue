<template>
  <div class="exam-container">
    <div class="section topic">
      <h2>Sujets</h2>
      <div class="items-list">
        <div v-for="topic in topics" :key="topic._id" class="item"
             :class="{ active: topic._id === selectedTopicId.value }"
             @click="fetchExercises(topic._id)">
          {{ topic.title }}
          <button @click.stop="deleteTopic(topic._id)">Supprimer</button>
          <button @click.stop="updateTopic(topic._id)">Modifier</button>
        </div>
      </div>
      <div class="actions">
        <button @click="addTopic">+</button>
      </div>
    </div>

    <div class="section exercices">
      <h2>Exercices</h2>
      <div class="items-list">
        <div v-for="exercise in exercises" :key="exercise._id" class="item">
          {{ exercise.title }}
          <button @click.stop="deleteExercise(exercise._id)">Supprimer</button>
          <button @click.stop="updateExercise(exercise._id)">Modifier</button>
        </div>
      </div>
      <div class="actions">
        <button @click="addExercise(selectedTopicId)">+</button>
      </div>
    </div>

    <div class="section enonce">
      <h2>Enoncé</h2>
      <div class="content-box">
        {{ enonce }}
      </div>
    </div>

    <div class="section parameters">
      <h2>Paramètres</h2>
      <div class="parametres-box">
        <label for="file-upload">Image jointe :</label>
        <input type="file" id="file-upload" @change="handleFileUpload" />
        <span>{{ uploadedFileName }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ApiService } from '@/utils/apiService';

const topics = ref([]);
const exercises = ref([]);
const enonce = ref('Lorem ipsum dolor sit amet...');
const uploadedFileName = ref('');
const selectedTopicId = ref(null);

const fetchTopics = async () => {
  try {
    const responseData = await ApiService.getTopics();
    topics.value = responseData;

    if (topics.value.length > 0) {
      selectedTopicId.value = topics.value[0]._id;
      await fetchExercises(selectedTopicId.value);
    }
  } catch (error) {
    console.error('Error fetching topics:', error);
  }
};


const fetchExercises = async (topicId = null) => {
  selectedTopicId.value = topicId;
  try {
    const responseData = await ApiService.getExercises(topicId);
    exercises.value = responseData;
  } catch (error) {
    console.error('Error fetching exercises:', error);
  }
};


const addTopic = async () => {
  const newExam = { title: `Nouvelle Epreuve ${topics.value.length + 1}` };
  try {
    const responseData = await ApiService.createTopic(newExam);
    topics.value.push(responseData.topic);
  } catch (error) {
    console.error('Error creating topic:', error);
  }
};

const deleteTopic = async (id) => {
  try {
    await ApiService.deleteTopic(id);
    topics.value = topics.value.filter((topic) => topic._id !== id);
  } catch (error) {
    console.error('Error deleting topic:', error);
  }
};

const updateTopic = async (id) => {
  const newTitle = prompt('Modifier le titre de l\'épreuve :');
  if (!newTitle) return;

  try {
    const responseData = await ApiService.updateTopic(id, { title: newTitle });
    const index = topics.value.findIndex((topic) => topic._id === id);
    topics.value[index] = responseData.topic;
  } catch (error) {
    console.error('Error updating topic:', error);
  }
};

const addExercise = async (topicId) => {
  const newExercise = {
    title: `Nouvel Exercice ${exercises.value.length + 1}`,
    text: 'Description de l\'exercice...'
  };

  try {
    const responseData = await ApiService.createExercise(topicId, newExercise);
    exercises.value.push(responseData.exercise);
  } catch (error) {
    console.error('Error creating exercise:', error);
  }
};

const deleteExercise = async (id) => {
  try {
    await ApiService.deleteExercise(id);
    exercises.value = exercises.value.filter((exercise) => exercise._id !== id);
  } catch (error) {
    console.error('Error deleting exercise:', error);
  }
};

const updateExercise = async (id) => {
  const newTitle = prompt('Modifier le titre de l\'exercice :');
  if (!newTitle) return;

  try {
    const responseData = await ApiService.updateExercise(id, { title: newTitle });
    const index = exercises.value.findIndex((exercise) => exercise._id === id);
    exercises.value[index] = responseData.exercise;
  } catch (error) {
    console.error('Error updating exercise:', error);
  }
};

const handleFileUpload = (event) => {
  uploadedFileName.value = event.target.files[0].name;
};

onMounted(fetchTopics);
</script>

<style scoped lang="scss">
.exam-container {
  display: grid;
  grid-template-columns: 1fr 1fr 2fr;
  grid-gap: 20px;
  padding: 20px;

  .section {
    border: 1px solid #ccc;
    padding: 10px;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

    h2 {
      color: $primary-color;
      font-weight: bold;
      margin-bottom: 10px;
    }

    .items-list {
      max-height: 200px;
      overflow-y: auto;
      margin-bottom: 10px;

      .item {
        padding: 8px;
        border: 1px solid $primary-color;
        margin-bottom: 5px;
        cursor: pointer;
        &:hover {
          background-color: lighten($primary-color, 20%);
        }

        button {
          margin-left: 10px;
        }
      }
    }

    .actions {
      display: flex;
      justify-content: flex-end;
    }

    .content-box {
      height: 200px;
      border: 1px solid $primary-color;
      overflow-y: auto;
      padding: 10px;
      background-color: #f9f9f9;
    }

    .parametres-box {
      display: flex;
      align-items: center;

      label {
        margin-right: 10px;
      }

      input[type="file"] {
        margin-right: 10px;
      }

      span {
        font-style: italic;
      }
    }
  }
}
</style>
