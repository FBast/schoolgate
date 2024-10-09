<template>
  <div class="exam-container">
    <div class="section topic">
      <h2>Sujets</h2>
      <div class="items-list">
        <div v-for="topic in topics" :key="topic._id" class="item">
          {{ topic.title }}
          <button @click="deleteTopic(topic._id)">Supprimer</button>
          <button @click="updateTopic(topic._id)">Modifier</button>
        </div>
      </div>
      <div class="actions">
        <button @click="AddTopic">+</button>
      </div>
    </div>

    <div class="section exercices">
      <h2>Exercices</h2>
      <div class="items-list">
        <div v-for="exercice in exercises" :key="exercice.id" class="item">
          {{ exercice.title }}
        </div>
      </div>
      <div class="actions">
        <button @click="addExercice">+</button>
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

const fetchTopics = async () => {
  try {
    const response = await ApiService.getTopics();
    topics.value = response;
  } catch (error) {
    console.error('Error fetching topics:', error);
  }
};

const AddTopic = async () => {
  const newExam = { title: `Nouvelle Epreuve ${topics.value.length + 1}` };
  try {
    const response = await ApiService.createExam(newExam);
    topics.value.push(response);
  } catch (error) {
    console.error('Error creating topic:', error);
  }
};

const deleteTopic = async (id) => {
  try {
    await ApiService.deleteTopic(id);
    topics.value = topics.value.filter((exam) => exam._id !== id);
  } catch (error) {
    console.error('Error deleting topic:', error);
  }
};

const updateTopic = async (id) => {
  const newTitle = prompt('Modifier le titre de l\'épreuve :');
  if (!newTitle) return;

  try {
    const updatedExam = await ApiService.updateTopic(id, { title: newTitle });
    const index = topics.value.findIndex((exam) => exam._id === id);
    topics.value[index] = updatedExam;
  } catch (error) {
    console.error('Error updating exam:', error);
  }
};

const addExercice = () => {
  const newId = exercises.value.length + 1;
  exercises.value.push({ id: newId, title: `Nouvel Exercice ${newId}` });
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
